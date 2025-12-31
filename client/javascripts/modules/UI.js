import Painter from './3D/Painter.js'
import Battle from './Battle.js'
import Player from './Player.js'
import Socket from './Socket.js'
import Sound from './Sound.js'
import Game from './Game.js'
import Unit from './Unit.js'
import User from './User.js'
import { getCookie, getText } from './utils.js'
import { CANCEL_MATCHING, MATCH, NOT_SUPPORTED_DEVICE } from './constants/texts.js'

export default class UI {
  static draggingId
  static isDragging = false
  static infoUnit
  static muted = true

  static init(playable = true) {
    scroll()
    createUnitCards()
    User.init()
    this.hydrate(playable)
  }

  static hydrate(playable) {
    document.onclick = Sound.playClick

    document.querySelector('#signinBtn').onclick = User.signIn
    document.querySelector('#signoutBtn').onclick = User.signOut
    document.querySelector('#deck').onclick = newMainCard
    document.querySelector('#fullscreenBtn').onclick = () => {
      fullscreen(document.documentElement)
    }

    //footer
    document.querySelector('#languageBtn').onclick = languageBtnClick

    document.querySelector('#ko').onclick = () => {
      languageChange('ko')
    }
    document.querySelector('#en').onclick = () => {
      languageChange('en')
    }
    document.querySelector('#soundBtn').onclick = () => {
      let soundImg = document.querySelector('#soundImg')
      Sound.mute()
      if (Sound.muted) soundImg.setAttribute('src', '/images/home/note2.png')
      else soundImg.setAttribute('src', '/images/home/note.png')
    }

    document.querySelector('#developerBtn').onclick = () => {
      window.open('https://github.com/wndgur2/CatChess')
    }

    if (!playable) {
      document.querySelector('#playBtnText').innerHTML = getText(NOT_SUPPORTED_DEVICE)
      return
    }

    document.querySelector('#playBtn').onclick = startMatching

    document.querySelector('#modalClose').onclick = UI.closeModal
    document.querySelector('#modalBackdrop').onclick = UI.closeModal

    document.querySelector('#surrenderBtn').onclick = () => {
      const surrenderEl = document.querySelector('#surrenderWrapper')
      UI.openModal(surrenderEl.innerHTML)
      document.querySelector('#surrenderConfirm').onclick = () => {
        Socket.sendMsg('reqSurrender', '')
        UI.closeModal()
      }
    }

    document.querySelector('#reload').onclick = () => {
      Socket.sendMsg('reqReload', '')
    }

    document.onkeypress = (event) => {
      switch (event.key.toUpperCase()) {
        case 'D':
          Socket.sendMsg('reqReload', '')
          break
        case 'ㅇ':
          Socket.sendMsg('reqReload', '')
          break
        case 'F':
          Socket.sendMsg('reqBuyExp', '')
          break
        case 'ㄹ':
          Socket.sendMsg('reqBuyExp', '')
          break
        case 'E':
          Painter.sellUnitOnKeypress()
          break
        case 'ㄷ':
          Painter.sellUnitOnKeypress()
          break
      }
    }

    document.querySelector('#buyExp').onclick = () => {
      Socket.sendMsg('reqBuyExp', '')
    }

    let shopEl = document.querySelector('#shop')
    shopEl.onmouseenter = shopMouseEnter
    shopEl.onmouseleave = shopMouseLeave
    shopEl.onpointerup = shopPointerUp

    let shoplistEl = document.querySelector('#shoplist')
    for (let i = 0; i < shoplistEl.children.length; ++i) {
      shoplistEl.children[i].onclick = () => {
        if (!Player.player.shop[i]) return
        Socket.sendMsg('reqBuyCat', {
          index: i,
        })
        UI.popDown()
      }
    }

    // 2 x 3 inventory
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        let item = document.querySelector(`#inventory-${i}-${j}`)
        item.ondragstart = inventoryDragStart
        item.draggable = false
        item.onmousemove = inventoryItemMouseMove
        item.onmouseleave = inventoryItemMouseLeave
      }
    }

    // unit info
    let itemEls = document.getElementsByClassName('item')
    for (let i = 0; i < itemEls.length; i++) {
      itemEls[i].onmousemove = itemMouseMove
      itemEls[i].onmouseout = itemMouseLeave
    }

    let skillEl = document.getElementById('unitSkillWrapper')
    skillEl.onmousemove = skillMouseMove
    skillEl.onmouseout = skillMouseLeave

    onclose = () => {
      Painter.running = false
    }
  }

  static openModal(content, callback) {
    console.log('open modal')
    const modalEl = document.getElementById('modal')
    modalEl.style.opacity = '1'
    modalEl.style.visibility = 'visible'

    const modalBodyEl = document.getElementById('modalBody')
    modalBodyEl.innerHTML = content
    if (callback) UI.callback = callback
  }

  static closeModal() {
    const modalEl = document.getElementById('modal')
    if (UI.callback) {
      UI.callback()
      UI.callback = null
    }
    modalEl.style.opacity = '0'
    setTimeout(() => {
      modalEl.style.visibility = 'hidden'
    }, 200)
  }

  static getCellUnitByCellId(id) {
    let position = id.split('-')

    switch (Game.state) {
      case 'arrange':
        if (position[0] === 'ally') return Player.player.board[position[1]][position[2]]
        else return Player.player.queue[position[2]]
      default:
        if (position[0] === 'ally') return Battle.board[parseInt(position[1]) + 3][position[2]]
        else if (position[0] === 'enemy') return Battle.board[position[1]][position[2]]
        else return Player.player.queue[position[2]]
    }
  }

  static popUp(html, mouseEvent) {
    let popUpEl = document.getElementById('popUp')
    popUpEl.innerHTML = html
    popUpEl.style.display = 'flex'

    if (mouseEvent.clientX + popUpEl.clientWidth > window.innerWidth)
      popUpEl.style.left = mouseEvent.clientX - popUpEl.clientWidth + 'px'
    else popUpEl.style.left = mouseEvent.clientX + 'px'

    if (mouseEvent.clientY + popUpEl.clientHeight > window.innerHeight)
      popUpEl.style.top = mouseEvent.clientY - popUpEl.clientHeight + 'px'
    else popUpEl.style.top = mouseEvent.clientY + 'px'
  }

  static popDown() {
    let popUpEl = document.getElementById('popUp')
    popUpEl.style.display = 'none'
  }

  static showUnitInfo(unit) {
    this.infoUnit = unit
    let unitInfoEl = document.getElementById('unitInfo')
    unit.showInfo()
    unitInfoEl.style.display = 'flex'

    let shopEl = document.getElementById('shop')
    shopEl.style.display = 'none'
  }

  static hideUnitInfo() {
    let unitInfoEl = document.getElementById('unitInfo')
    unitInfoEl.style.display = 'none'
    if (this.infoUnit) this.infoUnit.focused = false
    this.infoUnit = null

    let sellEl = document.getElementById('sell')
    sellEl.style.display = 'none'

    let shoplistEl = document.getElementById('shoplist')
    shoplistEl.style.display = 'flex'

    let shopEl = document.getElementById('shop')
    shopEl.style.display = 'flex'
  }

  static gameStart() {
    UI.closeModal()
    document.getElementById('home').style.display = 'none'
    document.getElementById('game').style.display = 'flex'
    fullscreen(document.getElementById('game'))

    Painter.startRender()
  }

  static gameEnd() {
    Painter.running = false
    cancelMatching()
    document.getElementById('game').style.display = 'none'
    document.getElementById('home').style.display = 'inline-block'
    User.authenticate()
    Painter.clearUnits()
  }
}

function inventoryDragStart(event) {
  UI.draggingId = event.target.id
  UI.isDragging = true
}

function inventoryItemMouseMove(event) {
  let index = parseInt(this.id.split('-')[1]) * 2 + parseInt(this.id.split('-')[2])
  if (Player.player.items[index]) UI.popUp(Player.player.items[index].info(), event)
}

function inventoryItemMouseLeave(event) {
  UI.popDown()
}

function itemMouseMove(event) {
  if (UI.infoUnit.items[this.id]) UI.popUp(UI.infoUnit.items[this.id].info(), event)
}

function itemMouseLeave(event) {
  UI.popDown()
}

function skillMouseMove(event) {
  UI.popUp(UI.infoUnit.skillInfo(), event)
}

function skillMouseLeave(event) {
  UI.popDown()
}

function shopMouseEnter(event) {
  if (!Painter.isDragging) return
  event.preventDefault()

  let shoplistEl = document.getElementById('shoplist')
  shoplistEl.style.display = 'none'

  let sellEl = document.getElementById('sell')
  sellEl.innerHTML = `고양이 판매하기 [E]<br/>💰${Painter.draggingObject.unit.cost}`
  sellEl.style.display = 'flex'
}

function shopMouseLeave(event) {
  if (!Painter.isDragging) return
  event.preventDefault()

  let sellEl = document.getElementById('sell')
  sellEl.style.display = 'none'

  let shoplistEl = document.getElementById('shoplist')
  shoplistEl.style.display = 'flex'
}

function shopPointerUp(event) {
  if (!Painter.isDragging) return
  Socket.sendMsg('reqSellCat', {
    uid: Painter.draggingObject.unit.uid,
  })

  let sellEl = document.getElementById('sell')
  sellEl.style.display = 'none'

  let shoplistEl = document.getElementById('shoplist')
  shoplistEl.style.display = 'flex'

  Player.player._shop = Player.player.shop
}

function startMatching() {
  Socket.sendMsg('startMatching', '')

  const playBtn = document.getElementById('playBtn')
  const playBtnText = document.getElementById('playBtnText')
  playBtn.className = 'btnWide btn'

  let mouseOver = false
  let matchingTime = 0
  let timeText = '00:00'

  playBtnText.innerHTML = timeText
  UI.interval = setInterval(() => {
    matchingTime++
    const minute = Math.floor(matchingTime / 60)
    const second = matchingTime % 60
    timeText = `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
    if (mouseOver) return
    playBtnText.innerHTML = timeText
  }, 1000)

  playBtn.onclick = () => {
    cancelMatching()
    playBtn.onclick = startMatching
  }
  playBtn.onmouseover = () => {
    mouseOver = true
    playBtnText.innerHTML = getText(CANCEL_MATCHING)
  }
  playBtn.onmouseout = () => {
    mouseOver = false
    playBtnText.innerHTML = timeText
  }
}

function cancelMatching() {
  Socket.sendMsg('cancelMatching', '')
  clearInterval(UI.interval)

  const playBtn = document.getElementById('playBtn')
  playBtn.className = `btnActive btn`
  playBtn.onmouseover = null
  playBtn.onmouseout = null
  const playBtnText = document.getElementById('playBtnText')
  playBtnText.innerHTML = getText(MATCH)
}

function scroll() {
  if (!getCookie('scroll')) return
  window.scrollTo(0, parseInt(getCookie('scroll')))
  document.cookie = 'scroll=0'
}

function createUnitCards() {
  newMainCard()
  loadDescCards()
}

function newMainCard() {
  const MAX_AMOUNT = 5
  const cards = document.getElementById('cards')
  const currentCats = [...cards.children].map((card) => card.id)
  const values = Object.values(Unit.CATS).filter((value) => !currentCats.includes(value.id))
  if (values.length > 0) {
    if (cards.children.length >= MAX_AMOUNT) {
      const i = cards.children.length - MAX_AMOUNT
      cards.children[i].setAttribute(
        'style',
        'width: 0px; margin:0px; opacity: 0; pointer-events: none;'
      )
      setTimeout(() => {
        if (cards.children.length > MAX_AMOUNT) cards.removeChild(cards.children[0])
      }, 400)
    }

    const cat = values[Math.floor(Math.random() * values.length)]
    const cardWrapper = newCard('main', cat)
    cards.appendChild(cardWrapper)

    setTimeout(() => {
      cardWrapper.style.opacity = '1'
      cardWrapper.style.width = '11dvw'
      cardWrapper.onmouseover = (e) => {
        cardWrapper.style.width = '12dvw'
      }
      cardWrapper.onmouseout = (e) => {
        cardWrapper.style.width = '11dvw'
      }
    }, 20)
  }
}

function loadDescCards() {
  var timeout
  ;['Poeir', 'Therme', 'Nature'].forEach((synergy) => {
    const cats = Object.values(Unit.CATS).filter((cat) => cat.synergies.includes(synergy))
    cats.forEach((cat) => {
      const cardWrapper = newCard('desc', cat)
      cardWrapper.onmouseenter = () => {
        if (timeout) clearTimeout(timeout)
        // show full body image on the right
        const popUp = document.getElementById('unitPopUpWrapper')
        popUp.style.visibility = 'visible'
        popUp.style.opacity = '1'
        const popUpImage = document.getElementById('popUpImage')
        popUpImage.onerror = () => {
          popUpImage.src = `/images/portraits/${cat.id}.jpg`
        }
        popUpImage.src = `/images/fullbody/${cat.id}.jpg`
      }
      cardWrapper.onmouseleave = () => {
        const popUp = document.getElementById('unitPopUpWrapper')
        popUp.style.opacity = '0'
        timeout = setTimeout(() => {
          popUp.style.visibility = 'hidden'
        }, 200)
      }
      document.getElementById(synergy).appendChild(cardWrapper)
    })
  })

  const creeps = Unit.CREEPS
  for (const creep in creeps) {
    document.getElementById('Creep').appendChild(newCard('desc', creeps[creep]))
  }
}

function newCard(type, cat) {
  let cardWrapper = document.createElement('div')
  cardWrapper.id = cat.id
  cardWrapper.className = type == 'main' ? 'mainCardWrapper' : 'cardWrapper'

  let card = document.createElement('div')
  card.className = type == 'main' ? 'mainCard' : 'card'
  cardWrapper.appendChild(card)

  let cardImgWrapper = document.createElement('div')
  cardImgWrapper.className = 'cardImgWrapper'
  card.appendChild(cardImgWrapper)

  let cardImg = document.createElement('img')
  cardImg.className = 'cardImg'
  cardImg.src = `/images/portraits/${cat.id}.jpg`
  cardImgWrapper.appendChild(cardImg)

  let cardDescWrapper = document.createElement('div')
  cardDescWrapper.className = 'cardDescWrapper'
  cardDescWrapper.style.wordBreak = 'break-all'

  let cardName = document.createElement('span')
  cardName.className = 'cardName'
  cardName.innerHTML = cat.name
  cardDescWrapper.appendChild(cardName)

  let cardDesc = document.createElement('span')
  cardDesc.className = 'cardDesc'
  cardDesc.innerHTML = cat.desc
  cardDescWrapper.appendChild(cardDesc)

  card.appendChild(cardDescWrapper)

  return cardWrapper
}

function fullscreen(el) {
  if (document.fullscreenElement) document.exitFullscreen()
  else el.requestFullscreen()
}

function languageBtnClick() {
  const language = document.getElementById('languagePopUp')
  if (language.style.display === 'flex') language.style.display = 'none'
  else language.style.display = 'flex'
}

function languageChange(language) {
  document.cookie = `scroll=${window.scrollY}`
  document.cookie = `lang=${language}`
  location.href = `/?lang=${language}`
}
