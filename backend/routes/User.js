const express = require("express")
const app = express() ; 

const router = express.Router() ; 
const {getUser , addUser , updateUser , deleteUser} = require("../controllers/User");


router.get("/", getUser);
router.post("/" , addUser);
router.put("/:id" , updateUser);
router.delete("/:id" , deleteUser)


module.exports = router ; 