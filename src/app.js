require("dotenv").config();
express = require("express");
const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use((err, req, res, next) => {
    console.error(err);\
    res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT, () => {
    console.log(`Wardrobe-Log - listening on port ${PORT}!`);
});
