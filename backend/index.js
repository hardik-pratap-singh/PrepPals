require("dotenv").config()  ; 
const express = require("express")
const app = express() ; 
const db = require("./db");
db() ; 

const cors = require("cors");
app.use(cors());

app.use(express.json());


app.get("/" , (req , res) => {
    res.send("Home Route");
})


app.listen(5000 , () => {
    console.log("server running on port 5000");
})
