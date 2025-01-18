let express = require("express");
import { NextFunction, Request, Response } from "express";

require("dotenv").config();
express = require("express");
const PORT = 3000;
const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT, () => {
    console.log(`Hack U of T - listening on port ${PORT}!`);
});
