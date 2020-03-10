# FINANZAS VOLTA
Implemente un sitio web en el que los usuarios puedan "comprar" y "vender" acciones, como se muestra a continuación.
## INTRODUCCIÓN
Si no está del todo seguro sobre lo que quiere decir comprar y vender acciones, haga click [aquí](http://www.investopedia.com/university/stocks/ )

Está por implementar Finanzas Volta, una aplicaicón web por medio de la cual puede manejar portafolios de acciones. Esta herramienta no sólo le permitirá revisar el precio actual de acciones, también le permitirá comprar ("comprar") y vender ("vender") acciones consultando [IEX](https://iextrading.com/developer/).

De hecho, IEX le permite descargar información de acciones a través de su API (applicacion programming interface) usando URLs como `https://cloud-sse.iexapis.com/stable/stock/nflx/quote?token=API_KEY`. Note que el símbolo de Netflix (NFLX) está embebido en esta URL; esa es la manera en la que IEX sabe qué datos devolver. Este link en particular no devuelve ningún dato porque IEX solicita que usted use una clave API (más sobre esto dentro de poco), pero si lo hiciera, veria una respuesta en formato JSON (JavaScript Object Notation) como esta:
```javascript
{  
   "symbol": "NFLX",
   "companyName": "Netflix, Inc.",
   "primaryExchange": "NASDAQ",
   "calculationPrice": "close",
   "open": 317.49,
   "openTime": 1564752600327,
   "close": 318.83,
   "closeTime": 1564776000616,
   "high": 319.41,
   "low": 311.8,
   "latestPrice": 318.83,
   "latestSource": "Close",
   "latestTime": "August 2, 2019",
   "latestUpdate": 1564776000616,
   "latestVolume": 6232279,
   "iexRealtimePrice": null,
   "iexRealtimeSize": null,
   "iexLastUpdated": null,
   "delayedPrice": 318.83,
   "delayedPriceTime": 1564776000616,
   "extendedPrice": 319.37,
   "extendedChange": 0.54,
   "extendedChangePercent": 0.00169,
   "extendedPriceTime": 1564876784244,
   "previousClose": 319.5,
   "previousVolume": 6563156,
   "change": -0.67,
   "changePercent": -0.0021,
   "volume": 6232279,
   "iexMarketPercent": null,
   "iexVolume": null,
   "avgTotalVolume": 7998833,
   "iexBidPrice": null,
   "iexBidSize": null,
   "iexAskPrice": null,
   "iexAskSize": null,
   "marketCap": 139594933050,
   "peRatio": 120.77,
   "week52High": 386.79,
   "week52Low": 231.23,
   "ytdChange": 0.18907500000000002,
   "lastTradeTime": 1564776000616
}
```
Note que esto es como un objeto de javascript, con parejas de propiedades y valores separadas por comas.
## Código base
### Descargando
ACÁ FALTA PONER MÁS INFORMACIÓN
### Configurando
Antes de comenzar con la tarea, necesitaremos registrarnos para obtener una clave API para poder consultar datos en IEX. Para hacerlo siga estos pasos:
* Visite (iexcloud.io/cloud-login#/register/).
* Ingrese su correo (no use el correo del colegio) y su contraseña, y haga click en "Create account".
* Una vez que haya confirmado su cuenta a través del email de confirmación, inicie sesión en Once you’ve confirmed your account via a confirmation email, sign in to iexcloud.io.
* Click API Tokens.
* Copy the key that appears under the Token column (it should begin with pk_).
* In a terminal window within CS50 IDE, execute: