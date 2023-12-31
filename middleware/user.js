const {format} = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require ('fs')
const fsP = require('fs').promises
const path = require('path')


const logevents = async (message, logFileName) => {
    const datetime = `${format(new Date(), 'ddMMyyyy\tss:mm:HH')}`
    const logitem = `${datetime}\t${uuid()}\t${message}\n`
    try {
        if (!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsP.mkdir(path.join(__dirname,'..','logs'))

        }
        await fsP.appendFile(path.join(__dirname, '..','logs', logFileName), logitem)
    }
    catch(err){
        console.log(err)
    }
}
const user = (req, res, next) => {
    logevents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqlog.log') 
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logevents, user }
