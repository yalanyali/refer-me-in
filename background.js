const defaultSites = {
  'American Banker': 'americanbanker.com',
  'Baltimore Sun': 'baltimoresun.com',
  'Barron\'s': 'barrons.com',
  'Bloomberg': 'bloomberg.com',
  'Business Insider': 'businessinsider.com',
  'Caixin': 'caixinglobal.com',
  'Crain\'s Chicago Business': 'chicagobusiness.com',
  'Chicago Tribune': 'chicagotribune.com',
  'Corriere Della Sera': 'corriere.it',
  'Daily Press': 'dailypress.com',
  'Dagens Nyheter': 'dn.se',
  'DeMorgen': 'demorgen.be',
  'Denver Post': 'denverpost.com',
  'Dynamed Plus': 'dynamed.com',
  'The Economist': 'economist.com',
  'Les Echos': 'lesechos.fr',
  'Eindhovens Dagblad': 'ed.nl',
  'Encyclopedia Britannica': 'britannica.com',
  'Examiner': 'examiner.com.au',
  'Financial News': 'fnlondon.com',
  'Financial Times': 'ft.com',
  'Foreign Affairs': 'foreignaffairs.com',
  'Foreign Policy': 'foreignpolicy.com',
  'Glassdoor': 'glassdoor.com',
  'Haaretz': 'haaretz.co.il',
  'Haaretz English': 'haaretz.com',
  'Hartford Courant': 'courant.com',
  'Harper\'s Magazine': 'harpers.org',
  'Harvard Business Review': 'hbr.org',
  'Inc.com': 'inc.com',
  'Irish Times': 'irishtimes.com',
  'La Repubblica': 'repubblica.it',
  'Liberation': 'liberation.fr',
  'Los Angeles Times': 'latimes.com',
  'Medium': 'medium.com',
  'MIT Technology Review': 'technologyreview.com',
  'Newsrep': 'thenewsrep.com',
  'New York Magazine': 'nymag.com',
  'Nikkei Asian Review': 'asia.nikkei.com',
  'NRC': 'nrc.nl',
  'OrlandoSentinel': 'orlandosentinel.com',
  'Quartz': 'qz.com',
  'Quora': 'quora.com',
  'San Francisco Chronicle': 'sfchronicle.com',
  'Scientific American': 'scientificamerican.com',
  'SunSentinel': 'sun-sentinel.com',
  'Telegraaf': 'telegraaf.nl',
  'The Advocate': 'theadvocate.com.au',
  'The Age': 'theage.com.au',
  'The Australian': 'theaustralian.com.au',
  'The Australian Financial Review': 'afr.com',
  'The Boston Globe': 'bostonglobe.com',
  'The Business Journals': 'bizjournals.com',
  'The Globe and Mail': 'theglobeandmail.com',
  'The Japan Times': 'japantimes.co.jp',
  'TheMarker': 'themarker.com',
  'The Mercury News': 'mercurynews.com',
  'The Morning Call': 'mcall.com',
  'The Nation': 'thenation.com',
  'The News-Gazette': 'news-gazette.com',
  'The New Statesman': 'newstatesman.com',
  'The New York Times': 'nytimes.com',
  'The New Yorker': 'newyorker.com',
  'The Seattle Times': 'seattletimes.com',
  'The Spectator': 'spectator.co.uk',
  'The Sydney Morning Herald': 'smh.com.au',
  'The Toronto Star': 'thestar.com',
  'The Washington Post': 'washingtonpost.com',
  'The Wall Street Journal': 'wsj.com',
  'Winston-Salem Journal': 'journalnow.com',
  'Vanity Fair': 'vanityfair.com',
  'Wired': 'wired.com'
}

const restrictions = {
  'barrons.com': 'barrons.com/articles'
}

// Don't remove cookies before page load
const sitesAllowCookies = [
  'asia.nikkei.com',
  'nytimes.com',
  'wsj.com',
  'ft.com',
  'fd.nl',
  'mercurynews.com',
  'theage.com.au',
  'economist.com',
  'bostonglobe.com',
  'denverpost.com',
  'chicagobusiness.com',
  'theadvocate.com.au',
  'examiner.com.au',
  'hbr.org',
  'medium.com',
  'washingtonpost.com',
  'nymag.com',
  'theaustralian.com.au',
  'telegraaf.nl', // keep accept cookies
  'demorgen.be'
]

// Removes cookies after page load
const sitesRemoveCookies = [
  'asia.nikkei.com',
  'ed.nl',
  'ft.com',
  'fd.nl',
  'mercurynews.com',
  'theage.com.au',
  'economist.com',
  'bostonglobe.com',
  'wired.com',
  'denverpost.com',
  'chicagobusiness.com',
  'harpers.org',
  'theadvocate.com.au',
  'examiner.com.au',
  'lesechos.fr',
  'liberation.fr',
  'hbr.org',
  'medium.com',
  'foreignpolicy.com',
  'wsj.com',
  'seattletimes.com',
  'thenewsrep.com',
  'washingtonpost.com',
  'sfchronicle.com',
  'nymag.com',
  'foreignaffairs.com',
  'scientificamerican.com',
  'telegraaf.nl',
  'thestar.com',
  'qz.com',
  'demorgen.be'
]

// Override User-Agent with Googlebot
const sitesUseGoogleBot = [
  'theaustralian.com.au',
  'barrons.com',
  'linkedin.com'
]

function setDefaultOptions () {
  chrome.storage.sync.set({
    sites: defaultSites
  }, function () {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id })
  })
}

const blockedRegexes = [
  /.+:\/\/.+\.tribdss\.com\//,
  /thenation\.com\/.+\/paywall-script\.php/,
  /haaretz\.co\.il\/htz\/js\/inter\.js/
]

const userAgentDesktop = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const userAgentMobile = 'Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)'

let enabledSites = []

// Get the enabled sites
chrome.storage.sync.get({
  sites: {}
}, (items) => {
  // let sites = items.sites
  enabledSites = Object.keys(items.sites).map((key) => {
    return items.sites[key]
  })
})

// Listen for changes to options
chrome.storage.onChanged.addListener((changes, namespace) => {
  let key
  for (key in changes) {
    let storageChange = changes[key]
    if (key === 'sites') {
      let sites = storageChange.newValue
      enabledSites = Object.keys(sites).map((key) => {
        return sites[key]
      })
    }
  }
})

// Set and show default options on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    setDefaultOptions()
  } else if (details.reason === 'update') {
    // User updated extension
  }
})

// WSJ bypass
chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (!isSiteEnabled(details) || details.url.indexOf('mod=rsswn') !== -1) {
    return
  }

  let param
  let updatedUrl

  param = getParameterByName('mod', details.url)

  if (param === null) {
    updatedUrl = stripQueryStringAndHashFromPath(details.url)
    updatedUrl += '?mod=rsswn'
  } else {
    updatedUrl = details.url.replace(param, 'rsswn')
  }
  return { redirectUrl: updatedUrl }
},
{ urls: ['*://*.wsj.com/*'], types: ['main_frame'] },
['blocking']
)

// Disable javascript for these sites
chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (!isSiteEnabled(details) || details.url.indexOf('mod=rsswn') !== -1) {
    return
  }
  return { cancel: true }
},
{
  urls: ['*://*.thestar.com/*', '*://*.economist.com/*', '*://*.theglobeandmail.com/*', '*://*.afr.com/*', '*://*.bizjournals.com/*', '*://*.businessinsider.com/*'],
  types: ['script']
},
['blocking']
)

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
  if (!isSiteEnabled(details)) {
    return
  }

  if (blockedRegexes.some((regex) => { return regex.test(details.url) })) {
    return { cancel: true }
  }

  let requestHeaders = details.requestHeaders
  let tabId = details.tabId

  let useUserAgentMobile = false
  let setReferer = false

  // if referer exists, set it to google
  requestHeaders = requestHeaders.map((requestHeader) => {
    if (requestHeader.name === 'Referer') {
      if (details.url.indexOf('wsj.com') !== -1 || details.url.indexOf('ft.com') !== -1) {
        requestHeader.value = 'https://www.facebook.com/'
      } else {
        requestHeader.value = 'https://www.google.com/'
      }
      setReferer = true
    }
    if (requestHeader.name === 'User-Agent') {
      useUserAgentMobile = requestHeader.value.toLowerCase().includes('mobile')
    }

    return requestHeader
  })

  // otherwise add it
  if (!setReferer) {
    if (details.url.indexOf('wsj.com') !== -1) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.facebook.com/'
      })
    } else {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.google.com/'
      })
    }
  }

  // override User-Agent to use Googlebot
  let useGoogleBot = sitesUseGoogleBot.filter((item) => {
    return typeof item === 'string' && details.url.indexOf(item) > -1
  }).length > 0

  if (useGoogleBot) {
    requestHeaders.push({
      'name': 'User-Agent',
      'value': useUserAgentMobile ? userAgentMobile : userAgentDesktop
    })
    requestHeaders.push({
      'name': 'X-Forwarded-For',
      'value': '66.249.66.1'
    })
  }

  // remove cookies before page load
  requestHeaders = requestHeaders.map((requestHeader) => {
    for (let siteIndex in sitesAllowCookies) {
      if (details.url.indexOf(sitesAllowCookies[siteIndex]) !== -1) {
        return requestHeader
      }
    }
    if (requestHeader.name === 'Cookie') {
      requestHeader.value = ''
    }
    return requestHeader
  })

  if (tabId !== -1) {
    // run contentScript inside tab
    chrome.tabs.executeScript(tabId, {
      file: 'contentScript.js',
      runAt: 'document_start'
    }, (res) => {
      if (chrome.runtime.lastError || res[0]) {

      }
    })
  }

  return { requestHeaders: requestHeaders }
}, {
  urls: ['<all_urls>']
}, ['blocking', 'requestHeaders', 'extraHeaders'])

// remove cookies after page load
chrome.webRequest.onCompleted.addListener((details) => {
  for (let domainIndex in sitesRemoveCookies) {
    let domainVar = sitesRemoveCookies[domainIndex]
    if (!enabledSites.includes(domainVar) || details.url.indexOf(domainVar) === -1) {
      continue // don't remove cookies
    }
    chrome.cookies.getAll({ domain: domainVar }, (cookies) => {
      for (let i = 0; i < cookies.length; i++) {
        chrome.cookies.remove({ url: (cookies[i].secure ? 'https://' : 'http://') + cookies[i].domain + cookies[i].path, name: cookies[i].name })
      }
    })
  }
}, {
  urls: ['<all_urls>']
})

function isSiteEnabled (details) {
  let isEnabled = enabledSites.some((enabledSite) => {
    let useSite = details.url.indexOf('.' + enabledSite) !== -1
    if (enabledSite in restrictions) {
      return useSite && details.url.indexOf(restrictions[enabledSite]) !== -1
    }
    return useSite
  })
  return isEnabled
}

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')

  let results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function stripQueryStringAndHashFromPath (url) {
  return url.split('?')[0].split('#')[0]
}
