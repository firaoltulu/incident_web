const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');


const { Spot, WebsocketStream } = require('@binance/connector');


const binance_apiKey = process.env.BINANCE_API_KEY;
const binance_apiSecret = process.env.BINANCE_SECRET_KEY;
const START_DATE = process.env.START_DATE;


const client = new Spot(binance_apiKey, binance_apiSecret);

const Get_klines_timeseries = async (SymbolID = "", interval = "1h") => {

    try {

        const symbol = SymbolID;
        const response = await client.klines(symbol, interval);

        const newarr = response.data.map((row, index) => {

            const newobj = Object.assign({}, {
                date: row[0],
                open: parseFloat(row[1]),
                high: parseFloat(row[2]),
                low: parseFloat(row[3]),
                close: parseFloat(row[4]),
                Volume: parseFloat(row[5]),
                period_end: row[6],
                Quote_asset_volume: parseFloat(row[7]),
                Number_of_trades: row[8],
                Taker_buy_base_asset_volume: parseFloat(row[9]),
                Taker_buy_quote_asset_volume: parseFloat(row[10]),
                ignore: row[11],
            });

            return newobj;

        });

        const data = Object.assign({}, {
            data: newarr,
            // symbol: exist,
            interval: interval,
        });

        return { done: true, data: data };


    } catch (err) {
        return { done: false, data: null };
    }

};

const Get_order_book = async (SymbolID = "", interval = "1h") => {

    try {

        const symbol = SymbolID;
        console.log({ symbol });

        const response = await client.historicalTrades(symbol, { limit: 500 });

        let writer = fs.createWriteStream('test_gfg.txt');


        // console.log({ response });

        const newarr = response.data.map((row, index) => {


            const newobj = Object.assign({}, {
                id: row.id,
                price: row.price,
                qty: row.qty,
                quoteQty: row.quoteQty,
                time: row.time,
                isBuyerMaker: row.isBuyerMaker,
                isBestMatch: row.isBestMatch,

            });

            console.log({ newobj });
            writer.write(` `);
            writer.write(`{`);
            writer.write(` id:${row.id}`);
            writer.write(` price:${row.price}`);
            writer.write(` qty:${row.qty}`);
            writer.write(` quoteQty:${row.quoteQty}`);
            writer.write(` time:${row.time}`);
            writer.write(` isBuyerMaker:${row.isBuyerMaker}`);
            writer.write(` isBestMatch:${row.isBestMatch}`);

            writer.write(` }`);
            writer.write(`..........................................`);
            writer.write(` `);
            return row;


            // return newobj;

        });




        // const data = Object.assign({}, {
        //     data: newarr,
        //     // symbol: exist,
        //     interval: interval,
        // });

        return { done: true, data: newarr };


    } catch (err) {
        return { done: false, data: null };
    }

};

const Get_stream = async (SymbolID, callbacks = null) => {

    try {


        const websocketStreamClient = new WebsocketStream({ callbacks });
        websocketStreamClient.bookTicker(SymbolID);


    } catch (err) {
        callbacks.error();
    }

};

let writer = fs.createWriteStream('test_gfg.txt');

var B = 0;
var A = 0;
var C = [];
var D = "1m";

const callbacks = {
    open: () => {
        const message = JSON.stringify({ message: 'Open Connection' });
        console.log({ message });
    },
    close: () => {
        const message = JSON.stringify({ message: 'Connection Closed' });
        console.log({ B });
        console.log({ A });
    },
    message: (data) => {
        const par_data = JSON.parse(data);

        B = parseFloat(B) + parseFloat(par_data.B);
        A = parseFloat(A) + parseFloat(par_data.A);

        if (C.length > 0) {

        }
        else {
            const newobj = Object.assign({}, {
                starttime: "",
                endtime: "",
                price_gap: "",

            });

            C.push(newobj);
        }



        // writer.write(` `);
        // writer.write(`{`);
        // writer.write(` u : ${par_data.u}`);
        // writer.write(` symbol : ${par_data.s}`);
        // writer.write(` b :${par_data.b}`);
        // writer.write(` B :${par_data.B}`);
        // writer.write(` a :${par_data.a}`);
        // writer.write(` A :${par_data.A}`);
        // writer.write(`}`);
        // writer.write(`................................`);
        // console.log({ par_data });


        // const newobj = Object.assign({}, {
        //     "e": par_data["e"],
        //     "E": par_data["E"],
        //     "s": par_data["s"],
        //     "p": parseFloat(par_data["p"]),
        //     "P": parseFloat(par_data["P"]),
        //     "w": parseFloat(par_data["w"]),
        //     "x": parseFloat(par_data["x"]),
        //     "c": parseFloat(par_data["c"]),
        //     "Q": parseFloat(par_data["Q"]),
        //     "b": parseFloat(par_data["b"]),
        //     "B": parseFloat(par_data["B"]),
        //     "a": parseFloat(par_data["a"]),
        //     "A": parseFloat(par_data["A"]),
        //     "o": parseFloat(par_data["o"]),
        //     "h": parseFloat(par_data["h"]),
        //     "l": parseFloat(par_data["l"]),
        //     "v": parseFloat(par_data["v"]),
        //     "q": parseFloat(par_data["q"]),
        //     "O": par_data["O"],
        //     "C": par_data["C"],
        //     "F": par_data["F"],
        //     "L": par_data["L"],
        //     "n": par_data["n"]
        // });

        // ws.send(JSON.stringify(newobj));
    },
    error: () => {
        const message = JSON.stringify({ message: 'Connection error' });
        console.log({ message });

        // ws.send(message);
        // ws.close();
    }
};

Get_stream("BTCUSDT", callbacks);

var is = true;

function cccccc() {
    if (is) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(`What's your name?`, name => {
            console.log(`Hi ${name}!`);
            const millis = Date.now();

            console.log({ B });
            console.log({ A });
            console.log({ millis });
            rl.close();
            is = true;
        });
        is = false;
    }
}

setInterval(cccccc, 1000);


// Get_order_book("BTCUSDT",).then((res) => {
//     // console.log({ res });
// })

