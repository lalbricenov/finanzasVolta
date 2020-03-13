const express = require("express");
const path = require("path"); 
const morgan = require('morgan');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');

const app = express();

// DB config and connection
const db = require('./config/keys').MONGOURL
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(db => console.log("Db connected"))
    .catch(err => console.log(err));


// ICÓNO QUE APARECE EN LA PESTAÑA DEL NAVEGADOR
app.use(favicon(path.join(__dirname,'static','favicon.ico')));

// CONFIGURATION OF  STATIC FOLDER ----------------------------------------------------------
app.use('/static', express.static(__dirname + '/static'));


// MIDDLEWARE ---------------------------------------------------------------------------------
// morgan dev is a set of middlewares that log the request in the terminal during development.
app.use(morgan('dev'));

// BODYPARSER es para leer los datos del cuerpo de la solicitud
app.use(express.urlencoded({extended:false}));

//---------------------------------------------------------------------------------------------

// CONFIGURATION OF VIEWS FOLDER AND VIEW ENGINE 
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
//-----------------------------------------------------------------------------------------------


// ROUTES -----------------------------------------------------------------------------------------
// importing routes from the file that is inside the routes folder
const indexRoutes = require('./routes/index.js'); 
const userRoutes = require('./routes/users.js'); 
// this makes the app use the routes defined in the variable indexRoutes. It add the prefix / to the routes (in this case the prefix is empty)
app.use('/',indexRoutes);
app.use('/users',userRoutes);
// --------------------------------------------------------------------------------------------


//----------------------------LOCALS: helper functions -------------------------------------

// app.locals = require('./static/js/creditCard');


// SETTING PORT AND STARTING APP --------------------------------------------------------------
// This is the port that will be used for the server. process.env.PORT will be used if available, otherwise 3000 will be selected. 
app.set('port', process.env.PORT || 3000);

// This start the app, in the sense that from this point on the requests will be listened to.
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
});
// ---------------------------------------------------------------------------------------------

