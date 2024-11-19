import Painter from './modules/3D/Painter.js'
import Socket from './modules/Socket.js'
import UI from './modules/UI.js'
import Unit from './modules/Unit.js'

window.onload = () => {
  init()
}

async function init() {
  fetchUserLog()
  await fetchResource()
  if (!isPlayableDevice()) {
    UI.init(false)
    return
  }
  ;[UI, Socket, Painter].forEach((module) => {
    module.init()
  })
}

async function fetchResource() {
  await Unit.fetchData()
  await fetchImages()
  endLoading()
}

async function fetchImages() {
  const data = Object.values(Unit.CATS).concat(Object.values(Unit.CREEPS))
  let count = 0
  startLoading()
  data.forEach((unit) => {
    const img = new Image()
    img.src = `/images/portraits/${unit.id}.jpg`
    img.onload = () => {
      document.querySelector('#loadingText').innerHTML = `Fetching Data... ${count}/${data.length}`
    }
    img.onerror = () => {
      console.log('Error fetching image.')
    }
  })
}

function startLoading() {
  document.querySelector('#loading').style.display = 'flex'
}

function endLoading() {
  document.querySelector('#loading').style.display = 'none'
}

function isPlayableDevice() {
  const agent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent)

  return !isMobile
}

async function fetchUserLog() {
  const browserInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage,
  }
  fetch('/api/log/browser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(browserInfo),
  })
}
