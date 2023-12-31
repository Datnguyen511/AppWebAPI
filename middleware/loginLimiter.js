const rateLimit = require('express-rate-limit')
const { logEvents } = require('./user')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, 
    message:
        { message: 'Thu lai sau 1 phut' },
    handler: (req, res, next, options) => {
        logEvents(`Qua nhieu request vui long thu lai sau: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errlog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, 
    legacyHeaders: false, 
})
module.exports = loginLimiter