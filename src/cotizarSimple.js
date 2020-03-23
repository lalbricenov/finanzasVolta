const axios = require('axios');
const apiKey = require('./config/keys').API_KEY;

const cotizar = async function(symbol){
    let response;
    try{

        response =  await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${apiKey}`);
    } catch(err){
        console.log(err);
        return undefined;        
    }

    console.log(response);
    // Si el programa llega hasta este punto quiere decir que no hubo error
    let answer = {
        "name": response.data.companyName,
        "price": response.data.latestPrice,
        "symbol": response.data.symbol
    }
    console.log(answer);
    return answer;
}

module.exports = cotizar;