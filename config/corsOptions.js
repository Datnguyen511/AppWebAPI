const allow = require('./allow')
const corsOptions = {
    origin: (origin, callback) => {
        /*cho phep postman truy cap api*/
        if (allow.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed'))
        }
    },
    credentials: true, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions