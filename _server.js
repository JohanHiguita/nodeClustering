/* Server with no clustering */
const express = require("express");
const fabObj = require("./math-logic/fibonacci-series");

const app = express();

app.use(function (req, res, next) {
    
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    console.log('req Date:', today.toISOString(), `query string: ${req.query.number}`)
    next()
})

app.get("/", (req, res) => {
    // Blocking code for large numbers
    const incNum = Number.parseInt(req.query.number); 
    let number = fabObj.calculateFibonacciValue(incNum);
    res.send(`<h1>${number}</h1>`);
});

app.listen(3000, () => console.log("Express App is running on PORT : 3000"));