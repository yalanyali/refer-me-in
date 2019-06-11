const domainList = ['medium.com']
const domainOptions = {
  'medium.com': {
    domain: 'medium.com',
    referer: 'https://t.co',
    deleteCookies: true
  }
}
const requestFilter = {
  urls: domainList.map(s => `*://*.${s}/*`)
}
const requestPerms = [
  'requestHeaders',
  'blocking',
  'extraHeaders'
]

const getOptions = () => {
  chrome.storage.local.get(['argsVideo', 'argsAudio'],
    (options) => { return options })
}

const domainMatches = (url) => {
  let matchedDomain = ''
  for (let d in domainList) {
    if (url.includes(domainList[d])) {
      matchedDomain = domainList[d]
      break
    }
  }
  return matchedDomain
}

const removeCookies = (domain) => {
  console.log('removeCookies:', domain)
  chrome.cookies.getAll({ domain: domain }, (cookies) => {
    // console.log(cookies)
    cookies.map(cookie => {
      chrome.cookies.remove({ 'url': 'https://' + domain, 'name': cookie.name }, (deletedCookie) => { console.log('Cookie deleted:', deletedCookie) })
    })
  })
}

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
  // console.log(details)
  const matchedDomain = domainMatches(details.url)
  if (matchedDomain === '') { return }
  const siteConfig = domainOptions[matchedDomain]
  if (siteConfig.deleteCookies) {
    removeCookies(matchedDomain)
  }
  var newRef = siteConfig.referer
  var gotRef = false

  // Look for referer and change if found
  for (let n in details.requestHeaders) {
    gotRef = details.requestHeaders[n].name.toLowerCase() === 'referer'
    if (gotRef) {
      details.requestHeaders[n].value = newRef
      break
    }
  }
  // Add referer
  if (!gotRef) {
    details.requestHeaders.push({ name: 'Referer', value: newRef })
  }

  return { requestHeaders: details.requestHeaders }
}, requestFilter, requestPerms)
