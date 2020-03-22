const express = require('express');
const router = express.Router();
const auth = require('../auth');
const quote = require('../quote');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/', auth.redirectLogin, function(req, res){
    // let errors = []
    console.log(req.session)
    Transaction.aggregate([
        {$match:{"userId":ObjectId(req.session.userId)}},
        {$group:{
            _id:{"symbol":"$symbol"},
            valorTransacciones:{$sum:"$cambioSaldoDinero"},
            totalAcciones:{$sum:"$cambioNumAcciones"}
        }}
    ], function(err, results){
        if(err) return req.res.send(err);
        else{
            let portafolio = {cash:10000, total:0, stocks:[]};
            if(results.length > 0)
            {
                for(result of results){
                    portafolio.cash = portafolio.cash + result.valorTransacciones;
                    let stock = {
                        symbol:result._id.symbol,
                        name:"Este es el nombre",
                        numAcciones:result.totalAcciones,
                        valorPorAccion:105,// se debe determinar 
                        valorTotal:105*result.totalAcciones
                    }
                    portafolio.total += stock.valorTotal;
                    portafolio.stocks.push(stock);
                }
                // console.log(portafolio)
            }
            portafolio.total += portafolio.cash;
            res.render('pages/dashboard', {portafolio:portafolio});
        }
        
    })
    
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
    let numAcciones = parseFloat(req.body.numAcciones);

    if(!symbol || !numAcciones ){
        errors.push({msg:"Por favor llene todos los campos"});
    }
    if(numAcciones < 1 || !Number.isInteger(numAcciones)){
        errors.push({msg:"El número de acciones debe ser un entero mayor a cero"});
    }    
    if(errors.length > 0)
    {
        return res.render("pages/buy", {errors:errors});
    }
    else{
        let unitPrice = 100;// Implement functionality to query the API to get the cost
        let valorCompra = unitPrice * numAcciones;
        
        // Verificación de que el usuario tenga sufiente dinero para hacer la transacción
        Transaction.aggregate([
            {$match:{"userId":ObjectId(req.session.userId)}},
            {$group:{ _id:null, cambioSaldo:{$sum:"$cambioSaldoDinero"}}}
        ], function(err, result){
            if(err){
                // console.log("aqui" + err)
                errors.push({msg:"Imposible realizar la transacción"});
                res.render("pages/buy", {errors:errors});
            }
            else{
                let saldo = 10000;
                console.log(result);
                if(result.length > 0)
                {
                    saldo = saldo + result[0].cambioSaldo;
                }     
                
                // console.log(transactions);
                console.log(saldo);
                if(saldo >= valorCompra)
                {
                    let newTransaction = new Transaction();
                    newTransaction.valorPorAccion = unitPrice;
                    newTransaction.cambioNumAcciones = numAcciones;
                    newTransaction.cambioSaldoDinero = -valorCompra;//El usuario gasta dinero al comprar
                    newTransaction.userId = req.session.userId;
                    newTransaction.symbol = req.body.symbol;
                    newTransaction.isSell = false;// Si no es una venta, entonces es una compra
                    // console.log(newTransaction);
                    newTransaction.save(function(err, transaction){
                        if(err){
                            console.log(err);
                            errors.push({msg:"Imposible realizar la transacción"});
                            res.render("pages/buy", {errors:errors});
                        }
                        else{
                            // console.log(transaction);
                            res.redirect('/');
                        }
                        
                    })        
                }
                else{
                    errors.push({msg:`Saldo insuficiente para realizar la transacción. Saldo: ${req.app.locals.formatCurrency(saldo)}. Valor compra ${req.app.locals.formatCurrency(valorCompra)}`});
                    res.render("pages/buy", {errors:errors});
                }
            }
        })
    }

});
router.get('/vender', auth.redirectLogin, function(req, res){
    console.log(req.session);
    res.render("pages/sell");
});

router.post('/vender', auth.redirectLogin, function(req, res){
    console.log(req.body);
    let errors = [];
    let symbol = req.body.symbol;
    let numAcciones = parseFloat(req.body.numAcciones);

    if(!symbol || !numAcciones ){
        errors.push({msg:"Por favor llene todos los campos"});
    }
    if(numAcciones < 1 || !Number.isInteger(numAcciones) ){
        errors.push({msg:"El número de acciones debe ser mayor a cero"});
    }    
    if(errors.length > 0)
    {
        return res.render("pages/sell", {errors:errors});
    }
    else{
        Transaction.aggregate([
            {$match:{symbol:symbol, "userId":ObjectId(req.session.userId)}},
            {$group:{ _id:null, saldoNumAcciones:{$sum:"$cambioNumAcciones"}}}
        ], function(err, result){
            if(err){
                // console.log("aqui" + err)
                errors.push({msg:"Imposible realizar la transacción"});
                res.render("pages/sell", {errors:errors});
            }
            else{
                console.log(result);
                let numAccionesActuales;
                if(result.length == 0)
                {
                    numAccionesActuales = 0;
                }else{
                    numAccionesActuales = result[0].saldoNumAcciones;
                }
                console.log(result);
                
                // Si el usuario sí posee suficientes acciones
                if(numAccionesActuales >= numAcciones)
                {
                    let unitPrice = 100;// Implement functionality to query the API to get the cost
                    let newTransaction = new Transaction();
                    newTransaction.valorPorAccion = unitPrice;
                    newTransaction.cambioNumAcciones = -numAcciones;
                    newTransaction.cambioSaldoDinero = numAcciones * unitPrice;//El usuario gasta dinero al comprar
                    newTransaction.userId = req.session.userId;
                    newTransaction.symbol = req.body.symbol;
                    newTransaction.isSell = true;// Si no es una venta, entonces es una compra
                    // console.log(newTransaction);
            
                    // console.log(newTransaction);
            
                    newTransaction.save(function(err, transaction){
                        if(err){
                            console.log(err);
                            errors.push({msg:"Imposible realizar la transacción"});
                            res.render("pages/sell", {errors:errors});
                        }
                        else{
                            console.log(transaction);
                            res.redirect('/');
                        }
                        
                    })        

                }
                else
                {
                    errors.push({msg:`No posee suficientes acciones ${req.body.symbol.toUpperCase()}. Saldo: ${numAccionesActuales}.`});
                    res.render("pages/sell", {errors:errors});
                }
            }
        })
        
    }

});

router.get('/historial', auth.redirectLogin, function(req, res){
    console.log(req.session);
    Transaction.find({userId:req.session.userId},function(err, transactions){
        if(err)
            res.send('tratando de ver el historial, pero se fallo');
        else
            res.render('pages/historial', {transactions:transactions});
    });    
});

module.exports = router;