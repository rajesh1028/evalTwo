const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password:String,
    age: Number,
    role:{type:String, enum:["customer","manager"], default:"customer"}
})

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel }