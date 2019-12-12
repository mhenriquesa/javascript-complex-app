const express = require('express')
const router = require('./router')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const app = express()

let sessionOptions = session({
    secret: 'woeifowiejf',
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})
 
//-------------------------------------------
/*
Atenção: A sequecencia de app.use() importa.
Se sessionOptions for para baixo de router, quebra o app.
Acredito que router precisa ser o ultimo a ser carregado.
*/
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(sessionOptions)
app.use(flash())
app.use(express.urlencoded({extended: false}))  // acesso a dados do user pelo body do elemento
app.use(express.json())
app.use(express.static('public'))              //permitir acesso a pasta public
app.use(function (req, res, next) {           // Permite os EJS templates ter acesso as informações do user quando logado
    res.locals.user = req.session.user
    next()
})

//Manter 'router' por ultimo
app.use('/', router) 

module.exports = app