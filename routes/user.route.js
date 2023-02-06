const express = require("express");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const tokenList = {};

const userRoute = express.Router();
userRoute.use(express.json())

userRoute.get("/", (req, res) => {
    res.send("Users Page....")
})

userRoute.post("/signup", (req, res) => {
    const { name, email, password, age, role } = req.body;
    try {
        if (name && email && password && age) {
            bcrypt.hash(password, 5, async (err, sec_pass) => {
                if (err) {
                    console.log(err);
                    res.send(err.message);
                }
                const user = new UserModel({ name, password: sec_pass, email, age, role });
                await user.save()
                res.send("User created successfully");
            })
        } else {
            res.send("fill all the details");
        }
    } catch (error) {
        console.log(error);
        res.send({ "msg": "error in signup", "error": error.message })
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const user = await UserModel.findOne({ email });
            const hash_pass = user.password;

            bcrypt.compare(password, hash_pass, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id, role: user.role }, "masai", { expiresIn: 60 });
                    const refresh_token = jwt.sign({ userID: user._id, role: user.role }, "masai_refresh", { expiresIn: 300 })
                    const response = {
                        "status": "Logged in",
                        token,
                        refresh_token
                    }
                    tokenList[refresh_token] = response;
                    //console.log(tokenList);
                    res.status(200).json(response);
                } else {
                    res.send("Wrong credentials");
                }
            })
        } else {
            res.send("fill all the details");
        }
    } catch (error) {
        console.log(error);
        res.send({ "msg": "error in login", "error": error.message })
    }
})

userRoute.get("/logout", (req, res) => {
    try {
        const token = req.headers?.authorization.split(" ")[1];
        const blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
        blacklist.push(token);
        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist), "utf-8")
        res.send("user logged out successfully");
    } catch (error) {
        res.send(error);
    }

})


module.exports = { userRoute };