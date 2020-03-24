const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const app = express();
const keys  = require('./config/keys');

// DB config and connection
const db = keys.MONGOURL
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(db => console.log("Connected to atlas, Db name:", db.connections[0].name))
    .catch(err => console.log(err));

// SESIÓN DE USUARIO cookie -----------------------------------------
const IN_PROD = (process.env.NODE_ENV === 'production');// this is set on the operating system
app.use(session({
    name:'sid',
    resave:'false',
    saveUninitialized: false,
    secret:'This!s 4 secretV0lt4*',
    cookie:{
        maxAge:1000*60*60,//1 hora
        sameSite: true,
        secure: IN_PROD
    }
}))



// ICÓNO QUE APARECE EN LA PESTAÑA DEL NAVEGADOR
app.use(favicon(path.join(__dirname,'static','favicon.ico')));

// CONFIGURATION OF  STATIC FOLDER ----------------------------------------------------------
app.use('/static', express.static(__dirname + '/static'));


// MIDDLEWARE ---------------------------------------------------------------------------------
// morgan dev is a set of middlewares that log the request in the terminal during development.
let morgan;
if(IN_PROD){
    morgan = require('morgan');
    app.use(morgan('dev'));
} 

// BODYPARSER es para leer los datos del cuerpo de la solicitud
app.use(express.urlencoded({extended:false}));


// SANITIZE USER INPUT
app.use(mongoSanitize());
//---------------------------------------------------------------------------------------------

// CONFIGURATION OF VIEWS FOLDER AND VIEW ENGINE
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
//-----------------------------------------------------------------------------------------------


// ROUTES -----------------------------------------------------------------------------------------
// importing routes from the file that is inside the routes folder
const userRoutes = require('./routes/users.js');
const indexRoutes = require('./routes/index.js');

// this makes the app use the routes defined in the variable indexRoutes. It add the prefix / to the routes (in this case the prefix is empty)
app.use('/users',userRoutes);
app.use('/',indexRoutes);// login required
// --------------------------------------------------------------------------------------------


//----------------------------LOCALS: helper functions -------------------------------------

app.locals.formatCurrency = function(value) {
    return "US$" + value.toFixed(2);
  }

// SETTING PORT AND STARTING APP --------------------------------------------------------------
// This is the port that will be used for the server. process.env.PORT will be used if available, otherwise 3000 will be selected.
app.set('port', process.env.PORT || 3000);

// This start the app, in the sense that from this point on the requests will be listened to.
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
});
// ---------------------------------------------------------------------------------------------

