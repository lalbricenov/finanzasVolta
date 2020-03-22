const mongoose = require('mongoose');
// const mongoose = require('./User');

const TransactionSchema = new mongoose.Schema({
    userId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isSell:{
        type: Boolean,
        required: true
    },
    symbol:{
        type: String,
        uppercase: true,
        required: true
    },
    valorPorAccion:{
        type: Number,
        min:0, 
        required: true
    },
    cambioNumAcciones:{
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    },
    cambioSaldoDinero:{
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