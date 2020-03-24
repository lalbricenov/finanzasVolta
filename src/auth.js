const User = require('./models/User');
const redirectLogin = function(req, res, next){
    console.log(req.session)
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } 
        else 
        {      
            if (user === null) {     
                // var err = new Error('Not authorized');
                // err.status = 400;
                console.log(req.session.sid,user)
                return res.redirect('/users/login');
            } else {
                return next();
            }
        }
    });
}
const redirectHome = function(req, res, next){
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } 
        else 
        {      
            if (user === null) {     
                // var err = new Error('Not authorized');
                // err.status = 400;
                return next();
            } else {
                return res.redirect('/');
            }
        }
    });
}

module.exports = {redirectLogin, redirectHome}