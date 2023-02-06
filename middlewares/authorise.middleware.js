const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorise = (role) => {
    return (req, res, next) => {
        console.log(req.body);
        const user_role=req.body.user_role;
        if(role.includes(user_role)){
            next();
        }else{
            res.send("not authorised")
        }

    }
}


module.exports = { authorise }