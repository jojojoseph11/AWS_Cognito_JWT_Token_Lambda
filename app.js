const express = require("express");
const app = express();
const routes = require("./src/routes/userRoute");
const port = 3000;

require('dotenv').config()
console.log(process.env)

app.use('/', routes);
app.listen(port, (error) => {
    if (error) {
        console.log("Server Error")
    }
    console.log("server is listening on port 3000");
});