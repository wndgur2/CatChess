#!/usr/bin/env node
var __getOwnPropNames = Object.getOwnPropertyNames
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports
    )
  }

// src/routes/auth.js
var require_auth = __commonJS({
  'src/routes/auth.js'(exports2, module2) {
    var express = require('express')
    require('dotenv').config()
    var { google } = require('googleapis')
    var jwt = require('jsonwebtoken')
    var router = express.Router()
    var redirectUri = process.env.NODE_ENV
      ? 'http://localhost:8080/auth/google/callback'
      : `${process.env.SERVER_URL}/auth/google/callback`
    var oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    )
    var scopes = ['https://www.googleapis.com/auth/userinfo.email']
    var authorizationUrl = oauth2Client.generateAuthUrl({
      scope: scopes,
      include_granted_scopes: true,
    })
    router.get('/google', (req, res) => {
      res.redirect(authorizationUrl)
    })
    router.get('/google/callback', async (req, res) => {
      const code = req.query.code
      let userInfo = {}
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('Error exchanging code for tokens:', err.message)
          return res.redirect('/')
        }
        try {
          oauth2Client.setCredentials(token)
          res.cookie('token', token)
          const tokenData = jwt.decode(token.id_token)
          userInfo.name = tokenData.name
          userInfo.email = tokenData.email
          res.cookie('name', userInfo.name)
          res.cookie('email', userInfo.email)
        } catch (error) {
          console.error('Error getting id_token data:', error.message)
        } finally {
          res.redirect(`/?lang=${req.cookies.lang}`)
        }
      })
    })
    module2.exports = router
  },
})

// src/modules/constants/cats.json
var require_cats = __commonJS({
  'src/modules/constants/cats.json'(exports2, module2) {
    module2.exports = {
      stealthyStalker: {
        id: 'stealthyStalker',
        name: { en: 'Stealthy Stalker', ko: '\uC740\uBC00\uD55C \uCD94\uC801\uC790' },
        synergies: ['Nature'],
        desc: {
          en: 'Expert hunter who utilize own natural camouflage.',
          ko: '\uC740\uD3D0\uAC00 \uB6F0\uC5B4\uB09C \uC0AC\uB0E5\uAFBC. \uC788\uC744 \uC218\uB3C4 \uC788\uACE0 \uC5C6\uC744 \uC218\uB3C4 \uC788\uC2B5\uB2C8\uB2E4.',
        },
        cost: 1,
        skill: 'roar',
        ad: 10,
        speed: 13,
        hp: 150,
        armor: 3,
        range: 1,
      },
      vibrato: {
        id: 'vibrato',
        name: { en: 'Vibrato', ko: '\uD0D0\uC9C0\uBB18' },
        synergies: ['Therme'],
        desc: {
          en: 'Creative souls who harness the vibrations of the underground world to create mesmerizing art.',
          ko: '\uBBF8\uC138\uD55C \uC9C4\uB3D9\uB3C4 \uAC10\uC9C0\uD558\uB294 \uC608\uBBFC\uD55C \uACE0\uC591\uC774.',
        },
        cost: 1,
        skill: 'neckBite',
        ad: 12,
        speed: 15,
        hp: 100,
        armor: 1,
        range: 1,
      },
      ironcladCrusader: {
        id: 'ironcladCrusader',
        name: { en: 'Ironclad Knight', ko: '\uCCA0\uAC11 \uAE30\uC0AC' },
        synergies: ['Poeir'],
        desc: {
          en: "Formidable warrior in impenetrable steel armor forged from the Poeir's foundries.",
          ko: '\uD3EC\uC5D0\uB974\uC0B0 \uAC15\uCCA0\uB85C \uBB34\uC7A5\uD55C \uC804\uC0AC.',
        },
        cost: 1,
        skill: 'roar',
        ad: 10,
        speed: 13,
        hp: 95,
        armor: 1,
        range: 3,
      },
      royalBellyRubber: {
        id: 'royalBellyRubber',
        name: { en: 'Royal Belly Rubber', ko: '\uAD81\uB514\uD321\uD321\uC0AC' },
        synergies: ['Poeir'],
        desc: {
          en: "Skilled masseurs trained in the art of giving luxurious belly rubs to the empire's noble cats.",
          ko: '\uD3EC\uC5D0\uB974 \uADC0\uC871 \uACE0\uC591\uC774\uC758 \uAD81\uB514 \uCC45\uC784\uC790.',
        },
        cost: 2,
        skill: 'roar',
        ad: 25,
        speed: 6,
        hp: 350,
        armor: 2,
        range: 1,
      },
      blink: {
        id: 'blink',
        name: { en: 'Blink', ko: '\uC7BD\uC2F8\uB0E5' },
        synergies: ['Therme'],
        desc: {
          en: 'Resourceful hunters who stalk prey in the darkness of the underground.',
          ko: '\uC9C0\uD558\uC758 \uB0A0\uB835\uD55C \uC0AC\uB0E5\uAFBC.',
        },
        cost: 2,
        skill: 'neckBite',
        ad: 25,
        speed: 12,
        hp: 190,
        armor: 3,
        range: 1,
      },
      cosmos: {
        id: 'cosmos',
        name: { en: 'Cosmos', ko: '\uCF54\uC2A4\uBAA8\uC2A4' },
        synergies: ['Nature'],
        desc: {
          en: 'The revered shaman of the Nature tribe defending their kin with celestial might.',
          ko: '\uCC9C\uC0C1\uC758 \uD798\uC73C\uB85C \uB3D9\uC871\uC744 \uBCF4\uD638\uD558\uB294 \uC790\uC5F0 \uBD80\uC871\uC758 \uC8FC\uC220\uC0AC.',
        },
        cost: 2,
        skill: 'roar',
        ad: 10,
        speed: 35,
        hp: 140,
        armor: 1,
        range: 3,
      },
      padoPoe: {
        id: 'padoPoe',
        name: { en: 'Pado Poe', ko: '\uD30C\uB3C4 \uC655\uC790' },
        synergies: ['Poeir'],
        desc: {
          en: '221th child of the king of the Poeir, who started the second great war against Therme.',
          ko: '\uD14C\uB974\uBA54 \uC81C\uAD6D\uACFC 2\uCC28 \uC790\uC6D0 \uC804\uC7C1\uC744 \uC77C\uC73C\uD0A8 \uD3EC\uC5D0\uB974 5\uC138\uC758 221\uBC88\uC9F8 \uC544\uB4E4.',
        },
        cost: 3,
        skill: 'roar',
        ad: 15,
        speed: 8,
        hp: 210,
        armor: 6,
        range: 2,
      },
      magmaWarden: {
        id: 'magmaWarden',
        name: { en: 'Magma Warden', ko: '\uB9C8\uADF8\uB9C8 \uADFC\uC704\uBCD1' },
        synergies: ['Therme'],
        desc: {
          en: 'Plop-plop. Would it be hot?',
          ko: '\uBD80\uAE00\uBD80\uAE00 \uB053\uC2B5\uB2C8\uB2E4. \uB728\uAC81\uB2E4\uB294 \uB73B\uC77C\uAE4C\uC694?',
        },
        cost: 3,
        skill: 'roar',
        ad: 17,
        speed: 20,
        hp: 140,
        armor: 1,
        range: 4,
      },
      twinky: {
        id: 'twinky',
        name: { en: 'Twinky', ko: '\uD2B8\uC719\uD0A4' },
        synergies: ['Nature'],
        desc: {
          en: 'Visionary artist who draw inspiration from the twinkling night sky.',
          ko: '\uBE5B\uB098\uB294 \uBC24\uD558\uB298\uC5D0\uC11C \uC601\uAC10\uC744 \uC774\uB04C\uC5B4\uB0B4\uB294 \uC120\uC9C0\uC790.',
        },
        cost: 3,
        skill: 'roar',
        ad: 17,
        speed: 20,
        hp: 140,
        armor: 1,
        range: 4,
      },
      lionheartClawson: {
        id: 'lionheartClawson',
        name: { en: 'Lionheart Clawson', ko: '\uD074\uB85C\uC190 \uC7A5\uAD70' },
        synergies: ['Poeir'],
        desc: {
          en: 'A noble and courageous knight of the empire of Poeir.',
          ko: '\uC6A9\uB9F9\uD55C \uD3EC\uC5D0\uB974\uC758 \uC815\uC608 \uAE30\uC0AC.',
        },
        cost: 4,
        skill: 'roar',
        ad: 30,
        speed: 12,
        hp: 320,
        armor: 10,
        range: 1,
      },
      greatClaw: {
        id: 'greatClaw',
        name: { en: 'Greatclaw', ko: '\uC790\uC5F0 \uD30C\uC218\uAFBC' },
        synergies: ['Nature'],
        desc: {
          en: 'Protector of sacred groves and ancient landmarks, sworn to defend the nature.',
          ko: '\uC790\uC5F0\uC744 \uC9C0\uD0A4\uAE30\uB85C \uB9F9\uC138\uD55C \uACE0\uB300\uC758 \uC218\uD638\uC790.',
        },
        cost: 4,
        skill: 'roar',
        ad: 25,
        speed: 16,
        hp: 240,
        armor: 7,
        range: 1,
      },
      moltenShadow: {
        id: 'moltenShadow',
        name: { en: 'Molten Shadow', ko: '\uADF8\uB9BC\uC790 \uC0AC\uB0E5\uAFBC' },
        synergies: ['Therme'],
        desc: {
          en: 'Hunter who thrives in the fiery depths of volcanic regions. "Ashes to ashes, dust to dust."',
          ko: '\uD654\uC0B0 \uAE4A\uC740 \uACF3\uC5D0 \uC11C\uC2DD\uD558\uB294 \uC0AC\uB0E5\uAFBC. "\uC7AC\uB294 \uC7AC\uB85C, \uBA3C\uC9C0\uB294 \uBA3C\uC9C0\uB85C."',
        },
        cost: 4,
        skill: 'roar',
        ad: 60,
        speed: 10,
        hp: 80,
        armor: 2,
        range: 1,
      },
    }
  },
})

// src/modules/constants/creeps.json
var require_creeps = __commonJS({
  'src/modules/constants/creeps.json'(exports2, module2) {
    module2.exports = {
      crab: {
        id: 'crab',
        name: { en: 'Crab', ko: '\uBD81\uD574 \uAC8C' },
        desc: { en: 'A crab in north ocean.', ko: '\uBD81\uD574\uC758 \uAC8C\uC774\uB2E4.' },
        synergies: [],
        cost: 1,
        skill: 'roar',
        ad: 8,
        speed: 10,
        hp: 110,
        armor: 1,
        range: 1,
      },
      devilCat: {
        id: 'devilCat',
        name: { en: 'Devil cat', ko: '\uC545\uBB18' },
        desc: {
          en: 'A feline with modified genes.',
          ko: '\uC870\uC791\uB41C \uC720\uC804\uC790\uC758 \uACE0\uC591\uC787\uACFC \uB3D9\uBB3C\uC774\uB2E4.',
        },
        synergies: [],
        cost: 2,
        skill: 'roar',
        ad: 12,
        speed: 32,
        hp: 240,
        armor: 2,
        range: 1,
      },
      eel: {
        id: 'eel',
        name: { en: 'Eel', ko: '\uC7A5\uC5B4' },
        desc: {
          en: 'An electrical eel in Doo river.',
          ko: '\uB450\uAC15\uC5D0 \uC0AC\uB294 \uC804\uAE30\uBC40\uC7A5\uC5B4.',
        },
        synergies: [],
        cost: 2,
        skill: 'neckBite',
        ad: 20,
        speed: 25,
        hp: 130,
        armor: 0,
        range: 3,
      },
      frog: {
        id: 'frog',
        name: { en: 'Frog', ko: '\uB3C5\uAC1C\uAD6C\uB9AC' },
        desc: {
          en: 'A mischievous frog with a poison.',
          ko: '\uC7A5\uB09C\uB07C\uAC00 \uB9CE\uC740 \uAC1C\uAD6C\uB9AC.',
        },
        synergies: [],
        cost: 1,
        skill: 'roar',
        ad: 26,
        speed: 49,
        hp: 70,
        armor: 0,
        range: 1,
      },
      mrTerry: {
        id: 'mrTerry',
        name: { en: 'Mr. Terry', ko: '\uAE40\uC528' },
        desc: {
          en: '"Hey! I could be a cat."',
          ko: '"\uC774\uBD10! \uB098\uB3C4 \uACE0\uC591\uC774\uB77C\uB124."',
        },
        synergies: [],
        cost: 1,
        skill: 'roar',
        ad: 60,
        speed: 10,
        hp: 12e3,
        armor: 8,
        range: 1,
      },
    }
  },
})

// src/routes/data.js
var require_data = __commonJS({
  'src/routes/data.js'(exports2, module2) {
    var express = require('express')
    var router = express.Router()
    router.get('/cats', (req, res, next) => {
      const filteredData = filterUnitsByLanguage(require_cats(), req.cookies.lang)
      res.json(filteredData)
    })
    router.get('/creeps', (req, res, next) => {
      const filteredData = filterUnitsByLanguage(require_creeps(), req.cookies.lang)
      res.json(filteredData)
    })
    function filterUnitsByLanguage(data, language) {
      if (!language) language = 'en'
      const filteredData = Object.values(data).map((unit) => ({
        ...unit,
        name: unit.name[language] || unit.name.en,
        desc: unit.desc[language] || unit.desc.en,
      }))
      return filteredData
    }
    module2.exports = router
  },
})

// src/db/schema/User.js
var require_User = __commonJS({
  'src/db/schema/User.js'(exports2, module2) {
    var mongoose = require('mongoose')
    var Schema = mongoose.Schema
    var userSchema = new Schema({
      username: String,
      email: { type: String, required: true, unique: true },
      win: { type: Number, default: 0 },
      loss: { type: Number, default: 0 },
      isOnline: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    })
    var User = mongoose.model('User', userSchema)
    module2.exports = User
  },
})

// src/db/schema/Device.js
var require_Device = __commonJS({
  'src/db/schema/Device.js'(exports2, module2) {
    var mongoose = require('mongoose')
    var Schema = mongoose.Schema
    var deviceSchema = new Schema({
      userAgent: { type: String, required: true },
      language: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      createdAtLocale: { type: String, required: true },
      ip: { type: String, required: true },
    })
    var Device = mongoose.model('Device', deviceSchema)
    module2.exports = Device
  },
})

// src/db/mongoDB.js
var require_mongoDB = __commonJS({
  'src/db/mongoDB.js'(exports2, module2) {
    require('dotenv').config()
    var mongoose = require('mongoose')
    require_User()
    require_Device()
    mongoose.connect(process.env.DB_URI)
    var db = mongoose.connection
    db.on('error', (error) => {
      console.error('connection error:', error)
    })
    db.on('connected', () => {
      console.log('Connected to MongoDB')
    })
    module2.exports = mongoose
  },
})

// src/routes/user.js
var require_user = __commonJS({
  'src/routes/user.js'(exports2, module2) {
    var express = require('express')
    var router = express.Router()
    var mongoDB = require_mongoDB()
    var jwt = require('jsonwebtoken')
    router.post('/log/browser', (req, res, next) => {
      const device = req.body
      device.ip = req.ip
      const Device = mongoDB.model('Device')
      const newDevice = new Device(device)
      newDevice.save()
      res.sendStatus(200)
    })
    router.get('/init', async (req, res, next) => {
      const id_token = req.headers.authorization.split('"id_token":"')[1].split('"')[0]
      const email = jwt.decode(id_token).email
      console.log(email)
      const user = await initUser(email)
      res.json(user)
    })
    async function initUser(email) {
      const User = mongoDB.model('User')
      let user = await User.findOne({
        email,
      })
      if (!user) {
        const newUser = new User({
          email,
        })
        await newUser.save()
        user = newUser
      }
      return user
    }
    router.put('/win', async (req, res, next) => {
      const id_token = req.headers.authorization.split('"id_token":"')[1].split('"')[0]
      const email = jwt.decode(id_token).email
      const user = await updateUser(email, 'win')
      res.json(user)
    })
    router.put('/lose', async (req, res, next) => {
      const id_token = req.headers.authorization.split('"id_token":"')[1].split('"')[0]
      const email = jwt.decode(id_token).email
      const user = await updateUser(email, 'lose')
      res.json(user)
    })
    async function updateUser(email, result) {
      const User = mongoDB.model('User')
      let user = await User.findOne({
        email,
      })
      if (result === 'win') {
        user.win++
      } else {
        user.loss++
      }
      await user.save()
      return user
    }
    module2.exports = router
  },
})

// src/app.js
var require_app = __commonJS({
  'src/app.js'(exports2, module2) {
    var express = require('express')
    var bodyParser = require('body-parser')
    var cookieParser = require('cookie-parser')
    var authRouter = require_auth()
    var dataRouter = require_data()
    var userRouter = require_user()
    require_mongoDB()
    var app = express()
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(express.static(__dirname + '/../client/public'))
    app.set('view engine', 'pug')
    app.set('views', __dirname + '/../client/views')
    app.set('view options', { compileDebug: false })
    var languageMiddleware = (req, res, next) => {
      let lang = req.headers['accept-language']
      if (lang.includes('ko')) req.lang = 'ko'
      else req.lang = 'en'
      next()
    }
    app.use(languageMiddleware)
    app.get('/', (req, res, next) => {
      if (req.query.lang) req.lang = req.query.lang
      res.cookie('lang', req.lang)
      res.render('page', { language: req.lang })
    })
    app.use('/data', dataRouter)
    app.use('/user', userRouter)
    app.use('/auth', authRouter)
    console.log('ENV: ', process.env.NODE_ENV)
    module2.exports = app
  },
})

// src/modules/constants/ITEMS.js
var require_ITEMS = __commonJS({
  'src/modules/constants/ITEMS.js'(exports2, module2) {
    var ITEMS = {
      longSword: {
        id: 'longSword',
        name: 'Long Sword',
        img: '\u{1F5E1}\uFE0F',
        desc: 'Sharp and pointy...',
        ad: 5,
      },
      rubyCrystal: {
        id: 'rubyCrystal',
        name: 'Ruby Crystal',
        img: '\u{1F52E}',
        desc: 'Shiny shiny!',
        hp: 45,
      },
      helmet: {
        id: 'helmet',
        name: 'Helmet',
        img: '\u{1FA96}',
        desc: 'Look out for the brainshot!',
        armor: 4,
      },
      boots: {
        id: 'boots',
        name: 'Boots',
        img: '\u{1F462}',
        desc: 'Smelly cat boots.',
        speed: 3,
      },
    }
    module2.exports = ITEMS
  },
})

// src/modules/Item.js
var require_Item = __commonJS({
  'src/modules/Item.js'(exports2, module2) {
    var ITEMS = require_ITEMS()
    var Item = class _Item {
      static getRandomItem() {
        let candidates = Object.keys(ITEMS)
        return new _Item(candidates[Math.floor(Math.random() * candidates.length)])
      }
      constructor(id) {
        let proto = ITEMS[id]
        this.id = id
        this.name = proto.name
        this.desc = proto.desc
        this.img = proto.img
        this.ad = proto.ad ? proto.ad : 0
        this.hp = proto.hp ? proto.hp : 0
        this.armor = proto.armor ? proto.armor : 0
        this.range = proto.range ? proto.range : 0
        this.speed = proto.speed ? proto.speed : 0
      }
    }
    module2.exports = Item
  },
})

// src/modules/unit/Modifier.js
var require_Modifier = __commonJS({
  'src/modules/unit/Modifier.js'(exports2, module2) {
    var Modifier = class {
      constructor(data, duration) {
        this.ad = 0
        this.speed = 0
        this.range = 0
        this.hp = 0
        this.armor = 0
        this.adRatio = 1
        this.speedRatio = 1
        this.rangeRatio = 1
        this.hpRatio = 1
        this.armorRatio = 1
        for (const [key, value] of Object.entries(data)) this[key] = value
        this.duration = duration
        this.leftTime = duration
      }
    }
    module2.exports = Modifier
  },
})

// src/modules/constants/CONSTS.js
var require_CONSTS = __commonJS({
  'src/modules/constants/CONSTS.js'(exports2, module2) {
    var TIME_STEP = process.env.NODE_ENV === 'development' ? 60 : 70
    var PLAYER_NUM = 2
    var DIRECTIONS = [
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
      ],
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [-1, -1],
        [1, -1],
      ],
    ]
    var GAME_STATES = {
      ARRANGE: 'arrange',
      READY: 'ready',
      BATTLE: 'battle',
      FINISH: 'finish',
    }
    var SHOP_POSSIBILITIES = [
      [100, 0, 0, 0],
      [90, 10, 0, 0],
      [75, 25, 0, 0],
      [50, 30, 20, 0],
      [30, 40, 29, 1],
      [15, 40, 40, 5],
      [5, 35, 40, 20],
      [0, 25, 35, 40],
    ]
    module2.exports = {
      GAME_STATES,
      TIME_STEP,
      PLAYER_NUM,
      DIRECTIONS,
      SHOP_POSSIBILITIES,
    }
  },
})

// src/modules/constants/SKILLS.js
var require_SKILLS = __commonJS({
  'src/modules/constants/SKILLS.js'(exports2, module2) {
    var Modifier = require_Modifier()
    var { TIME_STEP } = require_CONSTS()
    var INFINITY = 30
    var SKILLS = {
      roar: {
        id: 'roar',
        name: 'Roar',
        desc: 'Stuns 1s enemies around.',
        mp: 70,
        active: true,
        execute: (cat) => {
          const DURATION = 1
          const RANGE = 1
          const TARGET_AMOUNT = INFINITY
          cat.battleField
            .getNearestUnits(cat, RANGE, TARGET_AMOUNT, false)
            .forEach(({ _, target }) => {
              target.pushModifier(new Modifier({ speedRatio: 0 }, secondToTimeStep(DURATION)))
            })
        },
      },
      neckBite: {
        id: 'neckBite',
        name: 'Neck Bite',
        desc: 'Bites the neck of the enemy, dealing 200% of AD damage.',
        mp: 50,
        active: true,
        execute: (cat) => {
          const TARGET_AMOUNT = 1
          cat.battleField
            .getNearestUnits(cat, cat.range, TARGET_AMOUNT, (getAlly = false))
            .forEach(({ _, target }) => {
              let damage = cat.getStat('ad') * 2 - target.getStat('armor')
              cat.attack(target, damage)
            })
        },
      },
    }
    function secondToTimeStep(second) {
      return parseInt((second * 1e3) / TIME_STEP)
    }
    module2.exports = SKILLS
  },
})

// src/modules/utils.js
var require_utils = __commonJS({
  'src/modules/utils.js'(exports2, module2) {
    var Player = require_Player()
    var players = []
    function sendMsg(ws, type, data) {
      ws.send(
        JSON.stringify({
          type,
          data,
        })
      )
    }
    function getPlayerById(id) {
      return players.find((player) => player.id === id)
    }
    function getPlayerByWs(ws) {
      return players.find((player) => player.ws === ws)
    }
    function addPlayer(player) {
      players.push(player)
    }
    function removePlayer(id) {
      players = players.filter((player) => player.id !== id)
    }
    module2.exports = {
      sendMsg,
      addPlayer,
      getPlayerById,
      getPlayerByWs,
      removePlayer,
    }
  },
})

// src/modules/unit/Unit.js
var require_Unit = __commonJS({
  'src/modules/unit/Unit.js'(exports2, module2) {
    var Item = require_Item()
    var SKILLS = require_SKILLS()
    var { getPlayerById } = require_utils()
    var Unit = class _Unit {
      static number = 0
      constructor(proto, playerId, x, y, tier) {
        if (!proto) {
          console.log('PROTOTYPE ID ERROR')
          return
        }
        this.uid = _Unit.number++
        this.tier = tier
        this.id = proto.id
        this.name = proto.name
        this.synergies = proto.synergies
        this.desc = proto.desc
        this.originalCost = proto.cost
        this.cost = proto.cost * Math.pow(3, tier - 1)
        if (tier > 1) this.cost -= 1
        const MAGNITUDE = this.tier + (this.tier == 3 ? 0.5 : 0)
        this.ad = parseInt(proto.ad * MAGNITUDE)
        this.speed = parseInt(proto.speed * Math.sqrt(MAGNITUDE))
        this.maxHp = parseInt(proto.hp * MAGNITUDE)
        this.armor = parseInt(proto.armor * MAGNITUDE)
        this.range = proto.range
        this.hp = this.maxHp
        this.skill = SKILLS[proto.skill]
        this.maxMp = parseInt(this.skill.mp)
        this.mp = 0
        this.x = x
        this.y = y
        this.owner = playerId
        this.die = false
        this.delay = 0
        this.items = []
        this.modifiers = []
      }
      update() {
        if (this.die) return
        this.updateModifiers()
        if (this.mp >= this.maxMp) {
          this.delay = this.speed
          return this.cast()
        }
        if (this.delay > 0) {
          this.delay -= this.getStat('speed')
          return
        }
        let res = this.battleField.getNearestUnits(this, 30, 1, false)
        if (res.length < 1) return
        this.delay += 100
        let { distance, target } = res[0]
        if (distance <= this.getStat('range')) return this.ordinaryAttack(target)
        else return this.move(this.battleField.getNextMove(this, target))
      }
      updateModifiers() {
        this.modifiers.forEach((modifier) => {
          modifier.leftTime -= 1
          if (modifier.leftTime <= 0) this.modifiers.splice(this.modifiers.indexOf(modifier), 1)
        })
      }
      getStat(key) {
        let stat = this[key]
        this.modifiers.forEach((modifier) => {
          stat += modifier[key]
        })
        let ratio = 1
        this.modifiers.forEach((modifier) => {
          ratio *= modifier[key + 'Ratio']
        })
        return stat * ratio
      }
      cast() {
        this.skill.execute(this)
        this.mp -= this.maxMp
        this.sendMsgToGame('unitCast', {
          uid: this.uid,
        })
      }
      ordinaryAttack(target) {
        this.mp += 5
        this.attack(target, this.getStat('ad') - target.getStat('armor'))
        this.sendMsgToGame('unitManaGen', {
          uid: this.uid,
          mp: this.mp,
        })
      }
      attack(target, damage) {
        if (damage <= 0) damage = 1
        target.hp -= damage
        this.sendMsgToGame('unitAttack', {
          attacker: { uid: this.uid },
          target: {
            uid: target.uid,
            hp: target.hp,
          },
          damage,
        })
        if (target.hp <= 0) {
          target.die = true
          this.battleField.field[target.y][target.x] = null
          this.sendMsgToGame('unitDie', {
            uid: target.uid,
          })
          if (target.owner.split('-')[0] == 'creep') {
            getPlayerById(this.owner).pushItem(Item.getRandomItem())
            if (process.env.NODE_ENV === 'development') {
              getPlayerById(this.owner).pushItem(Item.getRandomItem())
              getPlayerById(this.owner).pushItem(Item.getRandomItem())
            }
          }
        }
      }
      move(nextMove) {
        if (!nextMove) return
        let y = nextMove[0],
          x = nextMove[1]
        this.battleField.field[this.y][this.x] = null
        this.battleField.field[y][x] = this
        this.y = y
        this.x = x
        this.sendMsgToGame('unitMove', {
          uid: this.uid,
          nextX: x,
          nextY: y,
        })
      }
      equip(item) {
        if (this.items.length >= 3) return false
        this.items.push(item)
        this.ad += item.ad
        this.hp += item.hp
        this.maxHp += item.hp
        this.armor += item.armor
        this.range += item.range
        this.speed += item.speed
        return true
      }
      pushModifier(modifier) {
        this.modifiers.push(modifier)
        modifier.unit = this
      }
      sendMsgToGame(type, data) {
        const p = getPlayerById(this.owner)
        if (!p.battle.id) return
        p.game.sendMsgToAll(type, { ...data, battleId: p.battle.id })
      }
      clone() {
        let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        clone.modifiers = []
        return clone
      }
    }
    module2.exports = Unit
  },
})

// src/modules/unit/SimpleCat.js
var require_SimpleCat = __commonJS({
  'src/modules/unit/SimpleCat.js'(exports2, module2) {
    var Unit = require_Unit()
    var CATS = require_cats()
    var SimpleCat = class _SimpleCat extends Unit {
      static prototypes = CATS
      static getRandomCatType(cost) {
        let candidates
        if (cost)
          candidates = Object.values(_SimpleCat.prototypes).filter((cat) => cat.cost === cost)
        else candidates = Object.values(_SimpleCat.prototypes)
        return candidates[Math.floor(Math.random() * candidates.length)]
      }
      constructor(id, player, x, y, tier = 1) {
        super(_SimpleCat.prototypes[id], player.id, x, y, tier)
      }
    }
    module2.exports = SimpleCat
  },
})

// src/modules/Player.js
var require_Player = __commonJS({
  'src/modules/Player.js'(exports2, module2) {
    var SimpleCat = require_SimpleCat()
    var { SHOP_POSSIBILITIES, GAME_STATES } = require_CONSTS()
    var { sendMsg, addPlayer } = require_utils()
    var IN_QUEUE = 3
    var Player = class {
      static getNewId() {
        return Math.random().toString(36).substr(2, 6)
      }
      constructor(id, ws) {
        addPlayer(this)
        this.id = id
        this.ws = ws
        this.game = null
      }
      init() {
        this.level = 1
        this.exp = -2
        this.money = process.env.NODE_ENV === 'development' ? 500 : 0
        this.maxExp = 4
        this.maxHp = process.env.NODE_ENV === 'development' ? 40 : 100
        this.hp = this.maxHp
        this.board = [
          [null, null, null, null, null],
          [null, null, null, null, null],
          [null, null, null, null, null],
        ]
        this.queue = [null, null, null, null, null, null, null]
        this.items = [null, null, null, null, null, null]
        this.winning = 0
        this.losing = 0
        this.synergies = {}
        this.battle = null
      }
      updatePlayer() {
        this.updateHp()
        this.updateExp()
        this.updateLevel()
        this.updateShop()
        this.updateMoney()
        this.updateBoard()
        this.updateQueue()
        this.updateSynergies()
        this.updateWinning()
        this.updateLosing()
        this.updateItems()
      }
      /**
       * @param {number} newMoney
       */
      set _money(newMoney) {
        this.money = parseInt(newMoney)
        this.updateMoney()
      }
      get _money() {
        return this.money
      }
      set _exp(newExp) {
        if (this.level === SHOP_POSSIBILITIES.length) return
        this.exp = parseInt(newExp)
        if (this.exp >= this.maxExp) {
          this.exp -= this.maxExp
          this.level++
          this.maxExp += this.level * 2
          this.updateLevel()
        }
        this.updateExp()
      }
      get _exp() {
        return this.exp
      }
      set _winning(newWinning) {
        if (newWinning > this._winning) this._losing = 0
        this.winning = parseInt(newWinning)
        this.updateWinning()
      }
      get _winning() {
        return this.winning
      }
      set _losing(newLosing) {
        if (newLosing > this._losing) this._winning = 0
        this.losing = parseInt(newLosing)
        this.updateLosing()
      }
      get _losing() {
        return this.losing
      }
      set _shop(newShop) {
        this.shop = newShop
        this.updateShop()
      }
      surrender() {
        this.hp = 0
        this.game.endState()
      }
      buyCat(index) {
        if (!this.shop[index]) return false
        let catId = this.shop[index].id
        let catProto = SimpleCat.prototypes[catId]
        if (this.money < catProto.cost) return false
        for (let i = 0; i < this.queue.length; ++i) {
          if (this.queue[i]) continue
          this.queue[i] = new SimpleCat(catId, this, i, 3)
          this._money = this.money - catProto.cost
          this.shop[index] = null
          this.checkUpgrade()
          this.updateShop()
          return true
        }
        console.log('\uB300\uAE30\uC11D\uC5D0 \uBE48\uC790\uB9AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.')
        return false
      }
      checkUpgrade() {
        let catIdTierAmount = {},
          checkingArea
        if (this.game.state === GAME_STATES.ARRANGE) checkingArea = [...this.board, this.queue]
        else checkingArea = [this.queue]
        checkingArea.forEach((row) => {
          row.forEach((cat) => {
            if (!cat) return
            if (!catIdTierAmount[cat.id]) catIdTierAmount[cat.id] = [0, 0, 0]
            catIdTierAmount[cat.id][cat.tier - 1]++
          })
        })
        while (true) {
          let isUpgraded = false
          for (let id in catIdTierAmount)
            for (let tier = 0; tier < 2; ++tier) {
              if (catIdTierAmount[id][tier] < 3) continue
              isUpgraded = true
              catIdTierAmount[id][tier] -= 3
              catIdTierAmount[id][tier + 1] += 1
              this.upgradeCat(id, tier + 1)
            }
          if (!isUpgraded) break
        }
        this.updateBoard()
        this.updateQueue()
      }
      upgradeCat(id, tier) {
        let oldCat
        for (let i = 0; i < 3 && !oldCat; ++i)
          for (let j = 0; j < 5; ++j) {
            if (this.board[i][j] && this.board[i][j].id === id && this.board[i][j].tier == tier) {
              oldCat = this.board[i][j]
              break
            }
          }
        if (!oldCat) oldCat = this.queue.find((c) => c && c.id === id && c.tier == tier)
        let newCat = new SimpleCat(id, this, oldCat.x, oldCat.y, tier + 1)
        if (oldCat.y == IN_QUEUE) this.queue[oldCat.x] = newCat
        else this.board[oldCat.y][oldCat.x] = newCat
        let items = oldCat.items
        let toDelete = 2
        ;[...this.board, this.queue].forEach((row) => {
          row.forEach((c) => {
            if (c && c.id === id && c.tier == tier && toDelete) {
              if (c.y == IN_QUEUE) this.queue[c.x] = null
              else this.board[c.y][c.x] = null
              items.push(...c.items)
              toDelete--
            }
          })
        })
        items = items.length > 3 ? items.slice(0, 3) : items
        items.forEach((item) => newCat.equip(item))
      }
      sellCat(uid) {
        let cat = this.getUnitByUid(uid)
        if (!cat) return false
        this._money += cat.cost
        let c
        if (cat.y === IN_QUEUE) {
          c = this.queue[cat.x]
          this.queue[cat.x] = null
          this.updateQueue()
        } else {
          c = this.board[cat.y][cat.x]
          this.board[cat.y][cat.x] = null
          this.updateBoard()
          this.countSynergy()
        }
        c.items.forEach((item) => this.pushItem(item))
        return true
      }
      putCat(uid, to) {
        if (to.y <= 2 && this.game.state !== GAME_STATES.ARRANGE) {
          this.updateQueue()
          return false
        }
        let unitToMove = this.getUnitByUid(uid)
        let unitToSwap
        if (!unitToMove) {
          this.updateBoard()
          this.updateQueue()
          return false
        }
        if (unitToMove.y === IN_QUEUE) {
          if (to.y === IN_QUEUE) {
            unitToSwap = this.queue[to.x]
            this.queue[to.x] = unitToMove
            this.queue[unitToMove.x] = unitToSwap
          } else {
            let amount = 0
            this.board.forEach((row) => {
              row.forEach((cat) => (cat ? amount++ : null))
            })
            unitToSwap = this.board[to.y][to.x]
            if (amount == this.level && !unitToSwap) {
              this.updateBoard()
              this.updateQueue()
              return false
            }
            this.board[to.y][to.x] = unitToMove
            this.queue[unitToMove.x] = unitToSwap
            this.countSynergy()
          }
        } else {
          unitToMove = this.board[unitToMove.y][unitToMove.x]
          if (to.y === IN_QUEUE) {
            unitToSwap = this.queue[to.x]
            this.board[unitToMove.y][unitToMove.x] = unitToSwap
            this.queue[to.x] = unitToMove
            this.countSynergy()
          } else {
            unitToSwap = this.board[to.y][to.x]
            this.board[to.y][to.x] = unitToMove
            this.board[unitToMove.y][unitToMove.x] = unitToSwap
          }
        }
        if (unitToSwap) {
          unitToSwap.x = unitToMove.x
          unitToSwap.y = unitToMove.y
        }
        unitToMove.x = to.x
        unitToMove.y = to.y
        this.updateBoard()
        this.updateQueue()
        return true
      }
      countSynergy() {
        this.synergies = {}
        this.board.forEach((row) => {
          row.forEach((cat) => {
            if (!cat) return
            cat.synergies.forEach((synergy) => {
              if (!this.synergies[synergy]) this.synergies[synergy] = []
              if (!this.synergies[synergy].includes(cat.id)) this.synergies[synergy].push(cat.id)
            })
          })
        })
        this.updateSynergies()
      }
      reload(freeReload = false) {
        if (!freeReload) {
          if (this.money < 2) return false
          this._money -= 2
        }
        let result = []
        let possibilities = SHOP_POSSIBILITIES[this.level - 1]
        for (let i = 0; i < 4; ++i) {
          let randomValue = Math.random() * 100
          for (let cost = 1; cost <= 4; ++cost) {
            if (randomValue <= possibilities[cost - 1]) {
              result.push(SimpleCat.getRandomCatType(cost))
              break
            }
            randomValue -= possibilities[cost - 1]
          }
        }
        this._shop = result
        return true
      }
      buyExp() {
        if (this.money < 4) return false
        if (this.level === SHOP_POSSIBILITIES.length) return false
        this._money -= 4
        this._exp += 4
        return true
      }
      pushItem(item) {
        for (let i = 0; i < this.items.length; ++i)
          if (this.items[i] === null) {
            this.items[i] = item
            this.updateItems()
            return true
          }
        return false
      }
      giveItem(item, uid) {
        let cat
        let curItem = this.items[item.y * 2 + item.x]
        if (!curItem) return false
        if (this.game.state !== GAME_STATES.ARRANGE) {
          cat = this.battle.battleField.getUnitByUid(uid)
          if (cat) {
            if (cat.equip(curItem)) {
              this.items[this.items.findIndex((i) => i === curItem)] = null
              this.updateItems()
              this.battle.updateUnitItem(cat)
              return true
            }
          }
        }
        cat = this.getUnitByUid(uid)
        if (!cat) return false
        if (cat.equip(curItem)) {
          this.items[this.items.findIndex((i) => i === curItem)] = null
          this.updateItems()
          this.updateBoard()
          this.updateQueue()
          return true
        }
        return false
      }
      reward() {
        this.reload(true)
        let income = 4
        income += Math.min(parseInt(this.money / 10), 5)
        if (this.winning >= 4) income += 2
        else if (this.winning >= 2) income += 1
        income += this.losing
        this._money = this.money + income
        this._exp += 2
      }
      // update messages
      updateShop() {
        if (!this.shop) return
        sendMsg(this.ws, 'shopUpdate', {
          player: this.id,
          shop: this.shop,
        })
      }
      updateMoney() {
        this.game.sendMsgToAll('moneyUpdate', {
          player: this.id,
          money: this.money,
        })
      }
      updateBoard() {
        this.game.sendMsgToAll('boardUpdate', {
          player: this.id,
          board: this.board,
        })
      }
      updateQueue() {
        this.game.sendMsgToAll('queueUpdate', {
          player: this.id,
          queue: this.queue,
        })
      }
      updateSynergies() {
        this.game.sendMsgToAll('synergiesUpdate', {
          player: this.id,
          synergies: this.synergies,
        })
      }
      updateLevel() {
        this.game.sendMsgToAll('levelUpdate', {
          player: this.id,
          level: this.level,
        })
      }
      updateExp() {
        sendMsg(this.ws, 'expUpdate', {
          player: this.id,
          exp: this.exp,
          maxExp: this.maxExp,
        })
      }
      updateHp() {
        this.game.sendMsgToAll('hpUpdate', {
          player: this.id,
          hp: this.hp,
        })
      }
      updateWinning() {
        this.game.sendMsgToAll('winningUpdate', {
          player: this.id,
          winning: this.winning,
        })
      }
      updateLosing() {
        this.game.sendMsgToAll('losingUpdate', {
          player: this.id,
          losing: this.losing,
        })
      }
      updateItems() {
        this.game.sendMsgToAll('itemUpdate', {
          player: this.id,
          items: this.items,
        })
      }
      getUnitByUid(uid) {
        let cat
        ;[...this.board, this.queue].forEach((row) => {
          row.forEach((c) => {
            if (c && c.uid === uid) cat = c
          })
        })
        return cat
      }
    }
    module2.exports = Player
  },
})

// src/modules/constants/CREEP_ROUNDS.js
var require_CREEP_ROUNDS = __commonJS({
  'src/modules/constants/CREEP_ROUNDS.js'(exports2, module2) {
    var CREEP_ROUNDS = {
      1: [
        [null, null, 'crab', null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
      ],
      2: [
        [null, null, 'devilCat', null, null],
        [null, null, null, null, null],
        [null, 'eel', null, 'eel', null],
      ],
      3: [
        [null, 'frog', 'frog', 'frog', null],
        [null, 'frog', 'frog', 'frog', null],
        [null, null, null, null, null],
      ],
      4: [
        [null, 'crab', null, 'crab', null],
        [null, null, null, null, null],
        ['eel', null, 'eel', null, 'eel'],
      ],
      5: [
        [null, null, null, null, null],
        [null, null, 'mrTerry', null, null],
        [null, null, null, null, null],
      ],
    }
    Object.freeze(CREEP_ROUNDS)
    module2.exports = CREEP_ROUNDS
  },
})

// src/modules/BattleField.js
var require_BattleField = __commonJS({
  'src/modules/BattleField.js'(exports2, module2) {
    var { DIRECTIONS } = require_CONSTS()
    var BattleField = class {
      constructor(field) {
        this.field = field
        this.catsOfPlayer = {}
        this.field.forEach((row, i) => {
          row.forEach((c, j) => {
            if (c == null) return
            c.battleField = this
            c.y = i
            c.x = j
            c.hp = c.maxHp
            c.delay = 0
          })
        })
      }
      getNextMove(cat, target) {
        let visited = []
        this.field.forEach((row) =>
          visited.push(row.map((c) => c !== null && c.owner === cat.owner))
        )
        let queue = []
        queue.push([cat.y, cat.x, [(cat.y, cat.x)]])
        visited[cat.y][cat.x] = true
        while (queue.length > 0) {
          let [y, x, path] = queue.shift()
          if (y === target.y && x === target.x) return path[1]
          DIRECTIONS[y % 2].forEach(([dy, dx]) => {
            let ny = y + dy,
              nx = x + dx
            if (ny < 0 || ny >= 6 || nx < 0 || nx >= 5) return
            if (visited[ny][nx]) return
            visited[ny][nx] = true
            queue.push([ny, nx, [...path, [ny, nx]]])
          })
        }
      }
      getNearestUnits(cat, range, amount, getAlly2 = false) {
        let visited = []
        this.field.forEach((row) => {
          visited.push(row.map((_) => false))
        })
        let queue = []
        queue.push([cat.y, cat.x, 0])
        visited[cat.y][cat.x] = true
        let res = []
        while (queue.length > 0) {
          let [y, x, distance] = queue.shift()
          if (distance > range) break
          if (
            this.field[y][x] &&
            (getAlly2 ? this.field[y][x].owner === cat.owner : this.field[y][x].owner !== cat.owner)
          )
            res.push({ distance, target: this.field[y][x] })
          DIRECTIONS[y % 2].forEach(([dy, dx]) => {
            let ny = y + dy,
              nx = x + dx
            if (ny < 0 || ny >= 6 || nx < 0 || nx >= 5) return
            if (visited[ny][nx]) return
            visited[ny][nx] = true
            queue.push([ny, nx, distance + 1])
          })
        }
        if (res.length > amount) res = res.slice(0, amount)
        return res
      }
      getFarthestUnits(cat, range, amount, getAlly2 = false) {}
      getLowestHpUnits(cat, range, amount, getAlly2 = false) {}
      getCats(playerId = null) {
        let res = []
        if (playerId == null) {
          this.field.forEach((row) => {
            row.forEach((cat) => {
              if (cat) res.push(cat)
            })
          })
          return res
        }
        this.field.forEach((row) => {
          row.forEach((cat) => {
            if (cat && cat.owner === playerId) res.push(cat)
          })
        })
        return res
      }
      getUnitByUid(uid) {
        let cat
        this.field.forEach((row) => {
          row.forEach((c) => {
            if (c && c.uid == uid) cat = c
          })
        })
        return cat
      }
    }
    module2.exports = BattleField
  },
})

// src/modules/constants/SYNERGIES.js
var require_SYNERGIES = __commonJS({
  'src/modules/constants/SYNERGIES.js'(exports2, module2) {
    var SYNERGIES = {
      Poeir: {
        apply: (unit, amount) => {
          if (amount < 3) return
          else if (amount < 6) unit.ad *= 1.25
          else if (amount >= 6) unit.ad *= 1.5
          unit.ad = Math.floor(unit.ad)
        },
      },
      Therme: {
        apply: (unit, amount) => {
          if (amount < 2) return
          else if (amount < 4) unit.speed *= 1.1
          else if (amount < 6) unit.speed *= 1.25
          else if (amount >= 6) unit.speed *= 1.5
          unit.speed = Math.floor(unit.speed)
        },
      },
      Nature: {
        apply: (unit, amount) => {
          if (amount < 2) return
          else if (amount < 4) unit.armor *= 1.1
          else if (amount < 6) unit.armor *= 1.25
          else if (amount >= 6) unit.armor *= 1.5
          unit.armor = Math.floor(unit.armor)
        },
      },
    }
    module2.exports = SYNERGIES
  },
})

// src/modules/Battle.js
var require_Battle = __commonJS({
  'src/modules/Battle.js'(exports2, module2) {
    var BattleField = require_BattleField()
    var { sendMsg } = require_utils()
    var { TIME_STEP } = require_CONSTS()
    var SYNERGIES = require_SYNERGIES()
    var Battle = class _Battle {
      static newId = 0
      constructor(player1, player2, isCreep = false) {
        this.id = _Battle.newId++
        this.finished = false
        this.game = player1.game
        this.player1 = player1
        this.player2 = player2
        this.player1.battle = this
        this.player2.battle = this
        this.isCreep = isCreep
        let board1 = player1.board.map((row) => row.map((c) => (c ? c.clone() : null)))
        let board2 = player2.board
          .map((row) => row.map((c) => (c ? c.clone() : null)).reverse())
          .reverse()
        this.battleField = new BattleField([...board2, ...board1])
        player1.battle = this
        player2.battle = this
        this.applySynergies()
        ;[this.player1, this.player2].forEach((player) => {
          if (!player.ws) return
          sendMsg(player.ws, 'battleReady', {
            battleId: this.id,
            board: this.battleField.field.map((row) =>
              row.map((c) => (c ? { ...c, battleField: null } : null))
            ),
            reversed: player === this.player2,
          })
        })
      }
      applySynergies() {
        ;[this.player1, this.player2].forEach((player) => {
          this.battleField.field.forEach((row) => {
            row.forEach((cat) => {
              if (!cat) return
              if (!cat.synergies) return
              for (const [synergy, cats] of Object.entries(player.synergies)) {
                if (cat.synergies.includes(synergy)) {
                  SYNERGIES[synergy].apply(cat, cats.length)
                }
              }
            })
          })
        })
      }
      initBattle() {
        ;[this.player1, this.player2].forEach((player) => {
          if (!player.ws) return
          sendMsg(player.ws, 'battleInit', {
            timeStep: TIME_STEP,
          })
        })
        this.battleInterval = setInterval(() => this.updateBattle(), TIME_STEP)
      }
      updateUnitItem(unit) {
        ;[this.player1, this.player2].forEach((player) => {
          if (!player.ws) return
          sendMsg(player.ws, 'unitItemUpdate', {
            battleId: this.id,
            unit: { ...unit, battleField: null },
          })
        })
      }
      updateBattle() {
        let p1Cats = this.battleField.getCats(this.player1.id)
        let p2Cats = this.battleField.getCats(this.player2.id)
        const units = [...p1Cats, ...p2Cats]
        for (let i = units.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[units[i], units[j]] = [units[j], units[i]]
        }
        if (p1Cats.length > 0 && p2Cats.length > 0) units.forEach((c) => c.update())
        else {
          this.end()
          this.punish()
        }
      }
      end() {
        if (this.finished) return
        clearInterval(this.battleInterval)
      }
      punish() {
        if (this.finished) return
        let p1Units = this.battleField.getCats(this.player1.id).length,
          p2Units = this.battleField.getCats(this.player2.id).length,
          damage
        if (p1Units > p2Units) {
          if (!this.isCreep) {
            this.player1._money++
            this.player1._winning++
            this.player2._losing++
          }
          damage = p1Units - p2Units + this.player1.level
          this.player2.hp -= damage
        } else if (p1Units < p2Units) {
          if (!this.isCreep) {
            this.player2._money++
            this.player2._winning++
            this.player1._losing++
          }
          damage = p2Units - p1Units + this.player2.level
          this.player1.hp -= damage
        } else {
          this.player1._losing++
          this.player2._losing++
          this.player2.hp -= this.player1.level
          this.player1.hp -= this.player2.level
        }
        ;[this.player1, this.player2].forEach((player) => {
          this.game.sendMsgToAll('hpUpdate', {
            player: player.id,
            hp: player.hp,
          })
        })
        this.finished = true
        if (this.game.battles.every((battle) => battle.finished)) this.game.finishState()
      }
    }
    module2.exports = Battle
  },
})

// src/modules/unit/Creep.js
var require_Creep = __commonJS({
  'src/modules/unit/Creep.js'(exports2, module2) {
    var Unit = require_Unit()
    var CREEPS = require_creeps()
    var Creep = class _Creep extends Unit {
      static prototypes = CREEPS
      constructor(id, pid) {
        super(_Creep.prototypes[id], pid, 0, 0, 1)
      }
    }
    module2.exports = Creep
  },
})

// src/modules/Game.js
var require_Game = __commonJS({
  'src/modules/Game.js'(exports2, module2) {
    var { sendMsg, getPlayerById, removePlayer } = require_utils()
    var { GAME_STATES, PLAYER_NUM } = require_CONSTS()
    var CREEP_ROUNDS = require_CREEP_ROUNDS()
    var Player = require_Player()
    var Battle = require_Battle()
    var Creep = require_Creep()
    var Game = class _Game {
      static matchingPlayers = []
      /**
       * @type {Game[]} games
       */
      static games = []
      static startMatching(from, ws) {
        let player = getPlayerById(from)
        if (_Game.matchingPlayers.find((player2) => player2.id === from)) return
        if (player) {
          player.ws = ws
          if (player.game) {
            sendMsg(ws, 'gameMatched', {
              players: player.game.players.map((p) => p.id),
            })
            player.game.sendGameData(from)
            return
          }
        } else player = new Player(from, ws)
        _Game.matchingPlayers.push(player)
        if (_Game.matchingPlayers.length === PLAYER_NUM)
          new _Game(_Game.matchingPlayers.splice(0, PLAYER_NUM))
      }
      static cancelMatching(pid) {
        let player = getPlayerById(pid)
        let i = _Game.matchingPlayers.indexOf(player)
        if (player && i >= 0) _Game.matchingPlayers.splice(i, 1)
      }
      /**
       * @param {[Player]} players
       */
      constructor(players) {
        this.players = players
        console.log('game start')
        console.log(this.players.map((p) => p.id))
        _Game.games.push(this)
        this.players.forEach((player) => {
          sendMsg(player.ws, 'gameMatched', {
            players: this.players.map((player2) => player2.id),
          })
        })
        this.players.forEach((player) => {
          player.game = this
          player.init()
          player.updatePlayer()
        })
        this.creeps = []
        this.players.forEach((_, i) => {
          this.creeps.push(new Player(`creep-${i}`))
          this.creeps[i].init()
          this.creeps[i].game = this
        })
        this.round = 1
        this.stage = 0
        this.timer = setInterval(() => {
          if (this.time <= 0) return
          this.time = this.time - 1
          this.sendMsgToAll('timeUpdate', {
            time: this.time,
          })
        }, 1e3)
        try {
          this.arrangeState()
        } catch (e) {
          console.error(e)
        }
      }
      sendGameData(from) {
        let player = getPlayerById(from)
        this.updateState()
        this.updateStage()
        this.players.forEach((p) => {
          sendMsg(player.ws, 'playerData', {
            id: p.id,
            hp: p.hp,
          })
        })
        if (this.state !== GAME_STATES.ARRANGE)
          this.battles.forEach((battle) => battle.updateBattle())
        player.updatePlayer()
      }
      set _stage(newStage) {
        if (newStage === 6) {
          this.round++
          newStage = 1
        }
        this.stage = newStage
        this.updateStage()
      }
      // 게임 진행: arrange -> ready -> battle -> finish -> arrange
      arrangeState() {
        clearTimeout(this.timeout)
        this.battles = []
        this._stage = this.stage + 1
        this.state = GAME_STATES.ARRANGE
        this.time = process.env.NODE_ENV === 'development' ? 8 : 12
        this.updateState()
        this.players.forEach((player) => {
          player.checkUpgrade()
          player.reward()
        })
        this.timeout = setTimeout(() => {
          this.readyState()
        }, this.time * 1e3)
      }
      readyState() {
        clearTimeout(this.timeout)
        this.players.forEach((player) => {
          let catN = 0
          player.board.forEach((row) => {
            row.forEach((cell) => {
              if (cell) catN++
            })
          })
          while (catN < player.level) {
            let c = player.queue.find((cat) => cat != null)
            if (!c) break
            let nextX, nextY
            do {
              nextX = Math.floor(Math.random() * 5)
              nextY = Math.floor(Math.random() * 3)
            } while (player.board[nextY][nextX] != null)
            player.putCat(c.uid, {
              x: nextX,
              y: nextY,
            })
            catN++
          }
        })
        this.state = GAME_STATES.READY
        this.time = 3
        this.updateState()
        this.timeout = setTimeout(() => {
          this.battleState()
        }, this.time * 1e3)
        if (this.stage == 1 && this.round <= Object.keys(CREEP_ROUNDS).length) {
          this.players.forEach((player, i) => {
            this.creeps[i].level = this.round
            this.creeps[i].board = CREEP_ROUNDS[this.round].map((row) =>
              row.map((c) => {
                if (!c) return null
                return new Creep(c, this.creeps[i].id)
              })
            )
            this.battles.push(new Battle(player, this.creeps[i], true))
          })
        } else this.battles.push(new Battle(this.players[0], this.players[1]))
      }
      battleState() {
        clearTimeout(this.timeout)
        this.state = GAME_STATES.BATTLE
        this.time = 25
        this.updateState()
        this.battles.forEach((battle) => battle.initBattle())
        this.timeout = setTimeout(() => this.finishState(), this.time * 1e3)
      }
      finishState() {
        clearTimeout(this.timeout)
        this.state = GAME_STATES.FINISH
        this.time = 1
        this.updateState()
        this.battles.forEach((battle) => {
          battle.end()
          battle.punish()
        })
        let isEnd = false
        this.players.forEach((player) => {
          if (player.hp <= 0) isEnd = true
        })
        if (isEnd) this.timeout = setTimeout(() => this.endState(), this.time * 1e3)
        else this.timeout = setTimeout(() => this.arrangeState(), this.time * 1e3)
      }
      endState() {
        clearTimeout(this.timeout)
        clearInterval(this.timer)
        this.battles.forEach((battle) => battle.end())
        this.sendMsgToAll('gameEnd', {
          winner: this.players[0].hp > 0 ? this.players[0].id : this.players[1].id,
        })
        this.players.forEach((player) => {
          player.game = null
        })
        this.creeps.forEach((creep) => {
          creep.game = null
          removePlayer(creep.id)
        })
        _Game.games.splice(_Game.games.indexOf(this), 1)
        delete this.players
        delete this
      }
      sendMsgToAll(type, data) {
        this.players.forEach((player) => {
          sendMsg(player.ws, type, data)
        })
      }
      updateState() {
        this.sendMsgToAll('stateUpdate', {
          state: this.state,
          time: this.time,
        })
      }
      updateStage() {
        this.sendMsgToAll('stageUpdate', {
          round: this.round,
          stage: this.stage,
        })
      }
    }
    module2.exports = Game
  },
})

// src/modules/socket.js
var require_socket = __commonJS({
  'src/modules/socket.js'(exports2, module2) {
    var Player = require_Player()
    var Game = require_Game()
    var { sendMsg, getPlayerById, getPlayerByWs } = require_utils()
    var webSocket = require('ws')
    var { client } = require_mongoDB()
    module2.exports = (server) => {
      const wss = new webSocket.Server({ server })
      wss.on('connection', (ws, req) => {
        console.log('New client connected')
        ws.on('message', (message) => {
          let msg = JSON.parse(message)
          let { from, type, data } = msg
          console.log(msg)
          try {
            switch (type) {
              case 'reqNewId': {
                sendMsg(ws, 'resNewId', Player.getNewId())
                break
              }
              case 'startMatching': {
                Game.startMatching(from, ws)
                break
              }
              case 'cancelMatching': {
                Game.cancelMatching(from)
                break
              }
              case 'reqSurrender': {
                const p = getPlayerById(from)
                if (p) p.surrender()
                break
              }
              case 'reqBuyCat': {
                const p = getPlayerById(from)
                if (p) p.buyCat(data.index)
                break
              }
              case 'reqPutCat': {
                const p = getPlayerById(from)
                if (p) p.putCat(data.uid, data.to)
                break
              }
              case 'reqSellCat': {
                const p = getPlayerById(from)
                if (p) p.sellCat(data.uid)
                break
              }
              case 'reqReload': {
                const p = getPlayerById(from)
                if (p) p.reload()
                break
              }
              case 'reqBuyExp': {
                const p = getPlayerById(from)
                if (p) p.buyExp()
                break
              }
              case 'reqGiveItem': {
                const p = getPlayerById(from)
                if (p) p.giveItem(data.item, data.uid)
                break
              }
            }
          } catch (e) {
            console.error(e)
          }
        })
        ws.on('error', (error) => {
          console.error(error)
        })
        ws.on('close', () => {
          console.log('Client disconnected')
          const p = getPlayerByWs(ws)
          if (p) {
            if (Game.matchingPlayers.includes(p)) {
              Game.cancelMatching(p.id)
              console.log('Matching canceled', Game.matchingPlayers)
            }
          }
        })
      })
    }
  },
})

// src/bin/www
run()
async function run() {
  try {
    let normalizePort2 = function (val) {
        var port2 = parseInt(val, 10)
        if (isNaN(port2)) {
          return val
        }
        if (port2 >= 0) {
          return port2
        }
        return false
      },
      onError2 = function (error) {
        if (error.syscall !== 'listen') {
          throw error
        }
        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
          case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
          default:
            throw error
        }
      },
      onListening2 = function () {
        var addr = server.address()
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
        debug('Listening on ' + bind)
        console.log('Listening on ' + bind)
      }
    var normalizePort = normalizePort2,
      onError = onError2,
      onListening = onListening2
    var app = require_app()
    var debug = require('debug')('catchess:server')
    var http = require('http')
    var webSocket = require_socket()
    var port
    var server
    port = normalizePort2(process.env.PORT || '8080')
    app.set('port', port)
    server = http.createServer(app)
    server.listen(port)
    server.on('error', onError2)
    server.on('listening', onListening2)
    webSocket(server)
  } catch (err) {
    console.log(err)
    run()
  }
}
