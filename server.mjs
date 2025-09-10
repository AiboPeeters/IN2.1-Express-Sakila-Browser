import express from "express";
import winston from "winston";

const app = express()
const port = 3000

const logger = winston.createLogger({
    level: "debug",
    transports: [new winston.transports.Console(),]
});

app.get("/hello", (req, res) => {
    logger.debug('get request op /hello')
    res.send("<p>Hello World!</p>")
});

app.get("/", (req, res) => {
    logger.debug('get request op /')
    res.send("<h1>Welkom op mijn website!</h1>")
});

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
});
