const axios = require('axios');
const apiKey = require('./config/keys').API_KEY;

const quote = async function(symbol, callback){
    let response = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/batch?types=quote&token=${apiKey}`)

    let answer = {
        "name": response.data.quote.companyName,
        "price": response.data.quote.latestPrice,
        "symbol": response.data.quote.symbol
    }
    console.log('aqui ',answer);
    return answer;

}

module.exports = quote;