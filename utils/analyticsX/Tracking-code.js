(async function () {
  const trackingserver = 'http://localhost:7000/'
  const trackingendpoint = `${trackingserver}api/Pageview/Track`
  const siteid = document.currentScript.getAttribute('data-siteid')
  // user ip address
  const response = await fetch('https://api.ipify.org?format=json')
  const { ip } = await response.json()
  // const locationResponse = await fetch(`https://ipinfo.io/${ip}/json`);
  // const locationData = await locationResponse.json();
  // console.log(locationData)
  const isSessionStorageSupported = typeof Storage !== 'undefined'
  let sessionData
  if (isSessionStorageSupported && sessionStorage.getItem('sessionData')) {
    sessionData = JSON.parse(sessionStorage.getItem('sessionData'))
    sessionData.pagesViewed.push(window.location.href)
  } else {
    sessionData = {
      sessionId: generateSessionId(),
      startTime: Date.now(),
      pagesViewed: [window.location.pathname]
    }
    if (isSessionStorageSupported) {
      sessionStorage.setItem('sessionData', JSON.stringify(sessionData))
    }
  }

  // Calculate time spent on the page (in seconds)
  const pageLoadTime = Date.now()
  // this logic for time spent would be updated on page exit
  const currentTime = Date.now()
  const timeOnPageInMilliseconds = currentTime - pageLoadTime
  const timeOnPageInSeconds = Math.floor(timeOnPageInMilliseconds / 1000)

  function getDeviceType () {
    return window.innerWidth < 768 ? 'Mobile' : 'Desktop'
  }

  function getOperatingSystem () {
    const userAgent = navigator.userAgent
    if (userAgent.match(/Android/i)) return 'Android'
    if (userAgent.match(/iPhone|iPad|iPod/i)) return 'iOS'
    if (userAgent.match(/Windows/i)) return 'Windows'
    if (userAgent.match(/Mac OS X/i)) return 'Mac OS X'
    if (userAgent.match(/Linux/i) || userAgent.match(/X11/i)) return 'Linux'
    return 'Unknown'
  }

  function generateSessionId () {
    return Date.now().toString() + Math.floor(Math.random() * 100000).toString()
  }

  function getReferrerDomain () {
    const referrer = document.referrer
    if (!referrer) {
      return 'Direct'
    }

    const url = new URL(referrer)
    return url.hostname
  }

  function getTrafficSource () {
    const referrerDomain = getReferrerDomain()

    const trafficSources = [
      {
        name: 'Direct',
        domains: ['Direct']
      },
      {
        name: 'Organic Search',
        domains: [/\bgoogle\.com$/, /\bbing\.com$/, /\byahoo\.com$/, /\bduckduckgo\.com$/]
      },
      {
        name: 'Social Media',
        domains: [
          /\b(www\.)?facebook\.com$/, /\b(www\.)?twitter\.com$/,
          /\b(www\.)?instagram\.com$/, /\b(www\.)?linkedin\.com$/,
          /\b(www\.)?pinterest\.com$/, /\b(www\.)?tiktok\.com$/
        ]
      }
    // Add more traffic sources as needed
    ]

    const matchedSource = trafficSources.find(source =>
      source.domains.some(domain => {
        if (typeof domain === 'string') {
          return domain === referrerDomain
        } else if (domain instanceof RegExp) {
          return domain.test(referrerDomain)
        }
        return false
      })
    )

    return matchedSource ? matchedSource.name : 'Other Referral'
  }

  function getBrowserInfo () {
    const ua = navigator.userAgent
    const browserInfo = {
      name: '',
      version: '',
      platform: ''
    }

    if (/Firefox/i.test(ua)) {
      browserInfo.name = 'Firefox'
    } else if (/Chrome/i.test(ua)) {
      browserInfo.name = 'Chrome'
    } else if (/Safari/i.test(ua)) {
      browserInfo.name = 'Safari'
    } else if (/MSIE|Trident/i.test(ua)) {
      browserInfo.name = 'Internet Explorer'
    }

    const matches = ua.match(/(?!.*OPR)(?:Edge|Edg)\/([\d.]+)/)
    if (matches && matches.length >= 2) {
      browserInfo.name = 'Microsoft Edge'
      browserInfo.version = matches[1]
    }

    browserInfo.version = browserInfo.version || ua.match(/version\/([\d.]+)/i)
    browserInfo.version = browserInfo.version ? browserInfo.version[1] : 'Unknown'

    browserInfo.platform = /Win/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'Mac OS' : /Android/i.test(ua) ? 'Android' : /Linux/i.test(ua) ? 'Linux' : 'Unknown'

    return browserInfo
  }

  async function checker () {
    const check = await axios.get(`${trackingserver}api/Pageview/checksid/${sessionData.sessionId}`)
    return check.data
  }

  async function trackPageView () {
    // we need a get request here if sessionid already exists in data. if it does we call function to create page else we call function to create track object and page creation
    const response = await checker()
    if (response.message === 'No-Exist') {
      const data = {
        siteId: siteid,
        //  page: window.location.pathname,
        // timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: getReferrerDomain(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        language: navigator.language,
        browser: getBrowserInfo(),
        ip,
        sessionId: sessionData.sessionId,
        trafficSource: getTrafficSource(),
        sessionStartTime: sessionData.startTime,
        sessionDuration: null,
        pagesViewed: sessionData.pagesViewed,
        timeOnPages: null,
        deviceType: getDeviceType(),
        operatingSystem: getOperatingSystem()
      }
      const response = await axios.post(trackingendpoint, data, {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    const responder = await axios.get(`${trackingserver}api/Pageview/sid/${sessionData.sessionId}`)
    const encodedIdValue = encodeURIComponent(window.location.pathname)
    const avdr = await axios.get(`${trackingserver}api/Pagedetail/checkpsp/${responder.data.data._id}/${sessionData.sessionId}/${encodedIdValue}`)
    if (avdr.data.message !== 'Exist') {
      const newdata = {
        pageview: responder.data.data._id,
        sessionid: sessionData.sessionId,
        page: window.location.pathname
      }
      const pagedetail = await axios.post(`${trackingserver}api/Pagedetail/Track`, newdata, {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  async function updatepagetime () {
    const currentTime = Date.now()
    const timespent = Math.floor((currentTime - pageLoadTime) / 1000)
    const spd = Math.floor((currentTime - pageLoadTime) / 1000)
    const encodedIdValue = encodeURIComponent(window.location.pathname)
    const responder = await axios.get(`${trackingserver}api/Pageview/sid/${sessionData.sessionId}`)
    const adddata = {
      pageview: responder.data.data._id,
      sessionId: sessionData.sessionId,
      sessionpageduration: spd,
      page: encodedIdValue,
      timeOnPage: timespent
    }
    console.log(adddata)
    const end = await axios.put(`${trackingserver}api/Pagedetail/updateping/`, adddata, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log(end)
  }

  function trackEvent (eventType, trackingCode, additionalInfo) {
  // Create tracking data for the event
    const eventData = {
      type: eventType,
      Tc: trackingCode,
      userAgent: navigator,
      additionalInfo: additionalInfo || null,
      ipAddress: ip,
      sessionId: sessionData.sessionId
    }
    console.log(eventData)
    // Send the eventData to your analytics server using Axios or another method
    // You can use trackingEndpoint to specify the server endpoint
    /*  axios.post(trackingEndpoint, eventData, {
    headers: { 'Content-Type': 'application/json' },
  }); */
  }

  document.addEventListener('click', function (event) {
    const button = event.target
    if (button.tagName === 'BUTTON' && button.getAttribute('data-event-button-tracking-code')) {
      const eventType = 'button-click' // You can set a common event type
      const trackingCode = button.getAttribute('data-event-button-tracking-code')

      // Now, you have eventType and trackingCode to send to your tracking module
      trackEvent(eventType, trackingCode)
    }
  })
  document.addEventListener('click', function (event) {
    // event.preventDefault()
	 const a = event.target
	 if (a.tagName === 'A' && a.getAttribute('data-event-link-tracking-code')) {
		 const eventType = 'Link-click'
		 const trackingCode = a.getAttribute('data-event-link-tracking-code')
		 trackEvent(eventType, trackingCode, null)
	 }
  })
  document.addEventListener('submit', function (event) {
	 event.preventDefault()
	 const form = event.target
	 // console.log(eventData)
	 if (form.tagName === 'FORM' && form.getAttribute('data-event-form-tracking-code')) {
		 const formData = new FormData(form)
      const eventData = {
		  formFields: {}
      }

      formData.forEach((value, key) => {
		  eventData.formFields[key] = value
      })
		 const eventType = 'form-submittion'
		 const trackingCode = form.getAttribute('data-event-form-tracking-code')
		 trackEvent(eventType, trackingCode, eventData.formFields)
	 }
  })
  // Tracking Download Links
  document.addEventListener('click', function (event) {
	 const clickdownloadlink = event.target
	 if (clickdownloadlink.tagName === 'A' && clickdownloadlink.getAttribute('data-event-download-tracking-code')) {
		 const eventType = 'Download'
		 const trackingCode = clickdownloadlink.getAttribute('data-event-download-tracking-code')
		 const filename = clickdownloadlink.getAttribute('data-download-file-desc')
		 const data = {
			 desc: filename
		 }
		 trackEvent(eventType, trackingCode, data)
	 }
  })
  // Tracking Search
  // search without submit button we track input the input has to have id = searchInput
  // Get all input elements with the 'data-event-search-tracking-code' attribute
  const searchInputs = document.querySelectorAll('input[data-event-search-tracking-code]')

  // Add an input event listener to each search input
  searchInputs.forEach(function (inputElement) {
    inputElement.addEventListener('input', function (event) {
      const searchQuery = inputElement.value
      const eventType = 'search'
      const trackingCode = inputElement.getAttribute('data-event-search-tracking-code')

      // Include the search query in the event data
      trackEvent(eventType, trackingCode, { query: searchQuery })
    })
  })

  // search with button
  document.addEventListener('submit', function (event) {
    const form = event.target

    if (form.tagName === 'FORM' && form.hasAttribute('data-event-search-tracking-code')) {
      const eventType = 'search'
      const trackingCode = form.getAttribute('data-event-search-tracking-code')
      const searchQuery = form.querySelector('input[name="query"]').value

      // Include the search query in the event data
      trackEvent(eventType, trackingCode, { query: searchQuery })
    }
  })

  trackPageView()
  window.addEventListener('beforeunload', updatepagetime)
})()
