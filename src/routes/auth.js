const express = require('express')
require('dotenv').config()
const { google } = require('googleapis')
const jwt = require('jsonwebtoken')

const router = express.Router()

const redirectUri = process.env.NODE_ENV
  ? 'http://localhost:8080/auth/google/callback'
  : `${process.env.SERVER_URL}/auth/google/callback`

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
)
const scopes = ['https://www.googleapis.com/auth/userinfo.email']

const authorizationUrl = oauth2Client.generateAuthUrl({
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

module.exports = router
