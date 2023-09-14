const { logevents } = require('./user')

const errorlog = (err, req, res, next) => {
    logevents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errlog.log')
    console.log(err.stack)
    const status = res.statusCode ? res.statusCode:500

    res.status(status)
    res.json({message: err.message, isError:true})
}
module.exports = errorlog