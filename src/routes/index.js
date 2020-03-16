const express = require('express');
const router = express.Router();
const auth = require('../auth');
router.get('/', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.render('pages/dashboard');
});
router.get('/cotizar', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.send('tratando de cotizar');
});
router.get('/comprar', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.send('tratando de comprar');
});
router.get('/vender', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.send('tratando de vender');
});
router.get('/historial', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.send('tratando de ver el historial');
});

module.exports = router;