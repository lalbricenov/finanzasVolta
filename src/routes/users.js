const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require('../models/User');

router.get('/', function(req, res){
    res.redirect("/");
});
router.get('/login', function(req, res){
    res.render("pages/login");
});
router.get('/register', function(req, res){
    res.render("pages/register");
});
router.post('/login', function(req, res){
    res.render("pages/login");
});
router.post('/register', function(req, res){
    // console.log(req.body);
    let user = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "passwordConf": req.body.passwordConf
    };
    let errors = [];
    
    // Check required fields
    if(!user.name || !user.email || !user.password || !user.passwordConf ){
        errors.push({msg:"Por favor llene todos los campos"});
    }

    // Check passwords match
    if(user.password !== user.passwordConf){
        errors.push({msg:"Las contraseñas no coinciden"});
    }

    // Verificar longitud de la contraseña
    if(user.password.length < 6){
        errors.push({msg:"Las contraseña debe tener al menos 6 caracteres"});
    }

    if(errors.length > 0)
    {

        res.render("pages/register", {errors:errors, user:user});
    }
    else{
        
        User.findOne({'email': user.email},'name', function(err, oldUser){
            if(oldUser)// Si ya habia un usuario con ese correo
            {
                console.log(oldUser);
                errors.push({msg:"El correo ya está registrado"});
                res.render("pages/register", {errors:errors, user:user});
            }
            else
            {
                let newUser = new User(user);
                // hash password en 2 pasos: generar salt, hacer hash
                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(user.password, salt, function(err, hash){
                        // Guardar como contraseña el hash apenas creado
                        newUser.password = hash;
                        console.log(newUser);
                        newUser.save(function(error, user){
                            if(error)
                            {
                                console.log(err);
                                errors.push({msg:"Imposible realizar el registro"});
                                res.render("pages/register", {errors:errors, user:user});
                            }
                            else
                            {
                                res.redirect('login');
                            }
                        })
                    });
                });
                
                
            }
        })
    }
    
});


module.exports = router;