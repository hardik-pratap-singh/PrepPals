const express = require("express")
const router = express.Router()  ; 
const usermodel = require("../models/User")

const getUser = async (req  , res) => {
    const data = await usermodel.find() ; 
    res.json(data); 
}

const addUser = async (req  , res) => {
    console.log(req.body);
    const data = await usermodel.create(req.body);
    await data.save() ; 
    res.json(data);
}

const updateUser = async (req  , res) => {
    console.log(req.params);
    const id = req.params.id ;

    const data = await usermodel.findOneAndUpdate({_id :id} , req.body , { upsert : true , new : true})

    res.send(data);
}

const deleteUser = async (req  , res) => {
    const name = req.body.name ;
    const data = await usermodel.deleteMany({name})

    res.json(data);
}



module.exports = {getUser , addUser , updateUser , deleteUser} ; 