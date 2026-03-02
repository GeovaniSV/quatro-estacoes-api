import env from '#start/env'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: env.get('nodemailer_email'),
    clientId: env.get('google_client_id'),
    clientSecret: env.get('google_client_secret'),
    refreshToken: env.get('google_refresh_token'),
  },
})

export { transporter }
