const express = require('express');
const router = express.Router();
const auth = require('../auth');
const quote = require('../quote');
const Transaction = require('../models/Transaction');

router.get('/', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.render('pages/dashboard');
});
router.get('/cotizar', auth.redirectLogin, function(req, res){
    let resp;
    quote('aapl').then(function(ans){
        resp = ans;
        res.send(resp);
    });
    
});
router.get('/comprar', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.render('pages/buy');
});
router.post('/comprar', auth.redirectLogin, function(req, res){
    console.log(req.body);
    let errors = [];
    let symbol = req.body.symbol;
    let numAcciones = req.body.numAcciones;

    if(!symbol || !numAcciones ){
        errors.push({msg:"Por favor llene todos los campos"});
    }
    if(numAcciones < 1 ){
        errors.push({msg:"El número de acciones debe ser mayor a cero"});
    }    
    if(errors.length > 0)
    {
        return res.render("pages/buy", {errors:errors});
    }
    else{
        let unitPrice = 100;// Implement functionality to query the API to get the cost

        let newTransaction = new Transaction();
        newTransaction.userId = req.session.userId;
        newTransaction.symbol = req.body.symbol;
        newTransaction.valorPorAccion = unitPrice;///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        newTransaction.numAcciones = req.body.numAcciones;

        console.log(newTransaction);
        newTransaction.valorTotal = parseInt(newTransaction.numAcciones) * parseInt(newTransaction.valorPorAccion);

        

        newTransaction.save(function(err, transaction){
            if(err){
                console.log(err);
                errors.push({msg:"Imposible realizar la transacción"});
                res.render("pages/buy", {errors:errors});
            }
            else{
                console.log(transaction);
                res.redirect('/historial');
            }
            
        })        
    }

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