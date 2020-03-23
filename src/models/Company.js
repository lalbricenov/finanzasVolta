const mongoose = require('mongoose');
// const mongoose = require('./User');

const CompanySchema = new mongoose.Schema({
    symbol:{
        type: String,
        uppercase: true,
        required: true
    },
    companyName:{
        type: String,
        required: true
    }
 
});

const Company = mongoose.model('Companies', CompanySchema);
module.exports = Company;