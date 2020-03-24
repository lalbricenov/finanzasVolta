const axios = require('axios');
const apiKey = require('./config/keys').API_KEY;
const Company = require('./models/Company');

const cotizarFull = async function(symbol){
    let response;
    try{
        response =  await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${apiKey}`);
    } catch(err){
        console.log(err.data);
        return undefined;        
    }

    // console.log("Full:" ,response.data);
    // Si el programa llega hasta este punto quiere decir que no hubo error
    let answer = {
        "name": response.data.companyName,
        "price": response.data.iexRealtimePrice,
        "symbol": response.data.symbol
    }
    // console.log("Full: ", answer);
    return answer;
}
const cotizarFree = async function(symbol)
{
    let response;
    try{
        response = await axios.get(`https://cloud.iexapis.com/stable/tops/last?token=${apiKey}&symbols=${symbol}`);
    } catch(err){
        console.log(err);
        return undefined;        
    }
    response = response.data[0];
    // console.log(response2.data)
    // console.log(response);
    // Si el programa llega hasta este punto quiere decir que no hubo error
    let answer = {
        "price": response.price,
        "symbol": response.symbol
    }
    // console.log("Free:" ,response);
    // console.log("Free: ", answer);
    return answer;
}
const cotizar = async function(symbol){
    symbol =  symbol.toUpperCase();
    // Check if the symbol is already in the database of symbols
    let company;
    try {
        company = await Company.findOne({"symbol":symbol}).exec()    
    } catch (error) {
        console.log("No fue posible buscar la compañía en la base de datos");
    }
    
    // console.log(company);

    if(company === null || company === undefined)// si no se encontró la compañía en la base de datos
    {
        try{
            quote = await cotizarFull(symbol);// Se debe usar una cotización que incluya el nombre de la compañía
        } catch (error) {
            console.log("Error en cotizarFull", error);
            return undefined
        }
        if(quote === undefined || quote.name === undefined)// si no se pudo obtener la cotización de IEX, o está incompleta
        {
            return quote;
        }
        // Si se llegó a este punto quiere decir que la IEX dió una respuesta
        // add the company to the database
        let newCompany = new Company();
        newCompany.symbol = symbol;
        newCompany.companyName = quote.name
        try {
            await newCompany.save()
        } catch (error) {
            console.log("No fue posible añadir la nueva compañía a la base de datos", error);
        }
        // Devolver la cotización a la aplicación principal sin importar si se logró o no guardar la nueva compañía en la base de datos
        // console.log("Justo antes de responder, después de tratar de añadir la nueva compañía", quote);
        return quote;
    }
    else
    {   
        // Si la compañía ya está en la base de datos de la aplicación
        try {
            quote = await cotizarFree(symbol);// Price and symbol from the IEX api for free    
        } catch (error) {
            console.log("Error en cotizarFree", error);
            return undefined
        }
        
        if(quote === undefined)// si no se pudo obtener la cotización de IEX
        {
            return quote
        }

        // Si se llegó a este punto quiere decir que la IEX dió una respuesta
        quote.name = company.companyName;// Company name from the applicacion database
        // console.log("Justo antes de responder, después de NO tratar de añadir la nueva compañía", quote);
        return quote;
    } 
    
}
module.exports = cotizar;


