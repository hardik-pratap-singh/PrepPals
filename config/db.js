const mongoose = require("mongoose");

const mongoDB = process.env.MONGO_URI ; 

async function main() {
    await mongoose.connect(`${mongoDB}`)
    .then(()=>{
        console.log("Connected")
    })
    .catch((err)=>{
        console.log("Error")
    })
}

module.exports = main ;  