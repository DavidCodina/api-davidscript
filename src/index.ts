// Third-party imports
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser' // Usage: console.log('Cookies: ', JSON.stringify(req.cookies, null, 2))

// Custom imports
import testRoutes from 'routes/testRoutes'

//# The noteRoutes and noteController are all set up,
//# Next I need to build out the rest of the CRUD
//# Ultimatley, I want to switch to a BLOG CRUD.
import noteRoutes from 'routes/noteRoutes'
import { connectDB } from 'config/db'

///////////////////////////////////////////////////////////////////////////
//
// Gotcha regarding nodemon:
//
// The dev script is simply: "nodemon src/index.ts"
// This just seems to work, with one exception, it won't update when .js files are changed.
// The solution was to add a nodemon.json file:
//
//   { "watch": ["src"], "ext": "*" }
//
//
// Or just do "dev": "nodemon src/index.ts -e '*'",
//
// That fixes the issue of watching non-ts files, but then we still need
// to be able to use alias paths through ts-alias. The docs for tsc-alias
// suggest this for watching changes to the files.
//
//  "build:watch": "tsc && (concurrently \"tsc -w\" \"tsc-alias -w\")"
//
//
// Thus our dev script must include: \"nodemon dist/index.js\" like this:
//
//   "dev": "tsc && (concurrently \"tsc -w\" \"tsc-alias -w\" \"nodemon dist/index.js\")",
//
//
// If you want, you can add a delay to nodemon. This will prevent nodemon from restarting several times:
//
//   [3] [nodemon] restarting due to changes...
//   [3] [nodemon] restarting due to changes...
//   [3] [nodemon] restarting due to changes...
//   [3] [nodemon] restarting due to changes...
//   [3] [nodemon] restarting due to changes...
//
//
// I actually don't think we need to explicitly tell nodemon to look at dist/index.js, so I omitted that part.
// Finally, I added the script that manually adds views and public folders to the dist.
//
//  "dev": "tsc && (concurrently \"tsc -w\" \"tsc-alias -w\" \"npm run add-public-and-views-to-dist\" \"nodemon --delay 0.25\")",
//
//
// And that's how it's done! This solution works fine, but eventually, I would like to move the build process
// over to esbuild, remove "add-public-and-views-to-dist" and then update what the dev script does.
//
///////////////////////////////////////////////////////////////////////////

dotenv.config()
const app = express()
connectDB()

// const message = 'Whuddup!'
// console.log(message)

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

// Serve static files. For example, when the index.html is served,
// it uses: <link rel="stylesheet" href="./styles/main.css" />
app.use('/', express.static(path.join(__dirname, '/public')))

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// Dave Gray : MERN Stack Project video 2 at 21:00 uses the regex.
// https://www.youtube.com/watch?v=H-9l-gTq-C4&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=2
// Gotcha: the build process uses tsc, which does not copy .html, .css, etc.
// You can probably solve this using esbuild to transpile the code.
// However, if you know exactly what files and folders you want to include, you
// can modify the package.json build command as follows. That said, cp may not work
// in windows systems. If that's the case, then you can use the copyfiles package.
//
//   https://vccolombo.github.io/blog/tsc-how-to-copy-non-typescript-files-when-building/
//
//   "add-public-and-views-to-dist": "cp -r src/public src/views dist",
//   "build": "rimraf dist && tsc && tsc-alias && npm run add-public-and-views-to-dist",
//
//
// https://vccolombo.github.io/blog/tsc-how-to-copy-non-typescript-files-when-building/
//
///////////////////////////////////////////////////////////////////////////

app.get('^/$|/index(.html)?', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '/views', 'index.html'))
})

/* ======================
        Routes
====================== */

app.use('/test', testRoutes)
app.use('/notes', noteRoutes)

/* ======================

====================== */

// I've also seen people do this:
//
// app.use((req, res, _next) => {
//   return res.status(404).json({ error: 'Not Found' })
// })

app.all('*', (req, res) => {
  return res.status(404).json({
    error: 'Not Found!'
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

mongoose.connection.once('open', () => {
  console.log('\n\nCalling app.listen() now that the database is connected.')
  app.listen(PORT, () => {
    console.log(`\nServer listening on port ${PORT}!\n`)
  })
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})
