const express = require("express")
const { connection } = require("./configs/db");
const { userRoute } = require("./routes/user.route");
const { authenticate } = require("./middlewares/authenticate.middleware");
const { authorise } = require("./middlewares/authorise.middleware");

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Home Page");
})

app.use("/users", userRoute);

app.use(authenticate);

app.get("/goldrate", (req, res) => {
    res.send("Goldrates Page");
})

app.get("/userstats", authorise(["manager"]), (req, res) => {
    res.send("Userstats Page");
})







app.listen(7500, async () => {
    try {
        await connection;
        console.log("connected to DB")
    } catch (error) {
        console.log(error);
    }
    console.log("listening on port 7500");
})