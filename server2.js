/* 
 * Server with clustering
 * Important!
 * Execute this in a Linux environment (WSL)
 * loadtest -n 10 --rps 10 http://localhost:3000/?number=40    
*/

const express = require("express");
const cluster = require("cluster");
const totalCPUs = require('os').cpus().length;

console.log("Launched!");
const fabObj = require("./math-logic/fibonacci-series");
if (cluster.isMaster) {
    
    console.log(`Total Number of CPU Counts is ${totalCPUs}`);

    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
        console.log(`iteration ${i}`);
    }
    //After forking a new worker, the worker should respond with an online message: 
    cluster.on("online", worker => {
        // the worker responded after it was forked
        console.log(`Worker Id is ${worker.id} and PID is ${worker.process.pid}`);
    });
    cluster.on("exit", worker => {
        console.log(`Worker Id ${worker.id} and PID is ${worker.process.pid} is offline`);
        console.log("Let's fork new worker!");
        cluster.fork();
    });
}
else {
    runServer();
}


function runServer(){
    const app = express();

    app.use(function (req, res, next) {
    
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
    
        console.log('req Date:', today.toISOString(), `/ qs: ${req.query.number} / PID: ${process.pid}`)
        next()
    })
    
    app.get("/", (req, res) => {
        // Blocking code for large numbers
        const incNum = Number.parseInt(req.query.number); 
        let number = fabObj.calculateFibonacciValue(incNum);
        res.send(`<h1>${number}</h1>`);
    });
    
    app.listen(3000, () => console.log("Express App is running on PORT : 3000"));
}