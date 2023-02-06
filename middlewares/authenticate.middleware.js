const jwt=require("jsonwebtoken");
const fs = require("fs");

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.send("Login again");
    }
    const b_data = JSON.parse(fs.readFileSync("./blacklist.json"))

    if (b_data.includes(token)) {
        res.send("session expired login again to continue");
    } else {
        jwt.verify(token, "masai", (err, decoded) => {
            if (err) {
                res.send("Please login again");
            } else {
                next();
            }
        })
    }
}

module.exports={authenticate};