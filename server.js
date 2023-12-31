require('dotenv').config()
require ('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const { user } = require('./middleware/user')
const errorlog  = require('./middleware/errorlog')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/connections')
const mongoose = require('mongoose')
const {logevents} = require('./middleware/user')
const port = process.env.port || 3500

console.log(process.env.NODE_ENV)
connectDB()

app.use(user)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieparser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
  app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'ui', 'error.html'))
    }
    else if (req.accepts('json')){
        res.json({message: '404 Not Found'})
    }
    else {
        res.type('txt').send('404 Not Found')
    }
})
app.use(errorlog)
mongoose.connection.once('open', () => {
    console.log('Da ket noi voi Mongoose')
    app.listen(port, () => {
        console.log(`Dang chay o cong ${port}`);
      })
})
mongoose.connection.on('error', err => {
    console.log(err)
    logevents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})