import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
// Usage: console.log('Cookies: ', JSON.stringify(req.cookies, null, 2))
import cookieParser from 'cookie-parser'
import testRoutes from './routes/testRoutes'

dotenv.config()
const app = express()

const message = 'Whuddup!'
console.log(message)

///////////////////////////////////////////////////////////////////////////
//
// This is an eslint-plugin-promise test.
//
// export const promise1 = new Promise((resolve, _reject) => {
//   resolve('Success!')
// })
//
// export const func = () => {
//   return promise1
//     .then((value) => {
//       return value
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }
//
// promise1
//   .then((value) => {
//     return value
//   })
//   .catch((err) => {
//     console.log(err)
//   })
//
///////////////////////////////////////////////////////////////////////////

// let x = 2

/* ======================
  CORS Global Middleware
====================== */
// No need to add 'http://localhost:3000' since it's covered
// by  process.env.NODE_ENV === 'development' check.
// Otherwise, add allowed domains here...
// const allowOrigins = [
//   // 'http://localhost:3000',
//   // '...'
// ]

// // Done in video: https://www.youtube.com/watch?v=JR9BeI7FY3M&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=3 at 21:00
// const corsOptions = {
//   origin: (origin, callback) => {
//     // This should allow all origins during development.
//     // This way, we can test Postman calls.
//     // An alternative syntax would be: if (!origin) { callback(null, true) }
//     if (process.env.NODE_ENV === 'development') {
//       // The first arg is the error object.
//       // The second arg is the allowed boolean.
//       callback(null, true)
//       // This else if is saying if the origin URL is in the
//       // list of allowedOrigins, then allow it (i.e. callback(null, true))
//       // Note: that will also end up disallowing Postman
//     } else if (allowOrigins.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true, // This sets the Access-Control-Allow-Credentials header
//   // methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
//   // The default may be 204, but some devices have issues with that
//   // (Smart TVs, older browsers, etc), so you might want to set it to 200 instead.
//   optionsSuccessStatus: 200
// }

// const corsOptions = {
//   origin: 'https://davidscript.com',
//   optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions))

app.use(cors())

/* ======================
Other Global Middleware
====================== */

app.use(express.json()) // Needed for reading req.body.
app.use(express.urlencoded({ extended: false })) // For handling FormData
app.use(cookieParser())

/* ======================

====================== */

app.get('/', (req, res) => {
  const body = req.body || {}

  return res.status(200).json({
    message: 'Remote change',
    envTest: process.env.TEST,
    body: body
  })
})

/* ======================
        Routes
====================== */

app.use('/test', testRoutes)

/* ======================

====================== */

app.use((req, res, _next) => {
  return res.status(404).json({
    error: 'Not Found'
  })
})

/* ======================

====================== */
// Elastic Beanstalk will look for process.env.PORT.
// It will also look at your package.json start script.
// Which is why ours is: node dist/index.js

//# Note that for some reason, eb commands like eb init and eb create
//# work in Terminal, but not really in VS Code. Not sure why.
//# https://www.youtube.com/watch?v=pVwmtABdOwk at 13:30
//# Here he begins to discuss .ebextensions which will actually help do the transpilation on the server.

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
