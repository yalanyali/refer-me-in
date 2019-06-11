// window.localStorage.clear()

if (location.href.indexOf('medium.com') !== -1) {
  const body = document.body
  let nagSelector = '.postMeterBar'
  let nagRemoved = false

  let observer = new MutationObserver(mutations => {
    mutations.map(mutation => {
      if (mutation.addedNodes && (mutation.addedNodes.length > 0)) {
        let nag = mutation.target.querySelector(nagSelector)
        if (nag) {
          nag.parentNode.removeChild(nag)
          nagRemoved = true
        }
        if (nagRemoved) {
          observer.disconnect()
        }
      }
    })
  })

  observer.observe(body, {
    childList: true,
    subtree: true
  })
}
