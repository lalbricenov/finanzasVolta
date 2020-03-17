const mongoose = require('mongoose');
// const mongoose = require('./User');

const TransactionSchema = new mongoose.Schema({
    userId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    symbol:{
        type: String, 
        required: true
    },
    valorPorAccion:{
        type: Number,
        min:0, 
        required: true
    },
    numAcciones:{
        type: Number,
        required: true
    },
    valorTotal:{
        type:Number,
        required:true
    },
    date:{
        type: Date, 
        default: Date.now
    }
});

const Transaction = mongoose.model('Transactions', TransactionSchema);
module.exports = Transaction;