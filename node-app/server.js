const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const app = express();

// 引用 users.js
const users = require("./routes/api/users");

// DB config
// const db = require("./config/keys").mongoURI;
const db = require("./config/keys").mongoURI2;

// 使用body-parse中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Connect to mongodb
mongoose.connect(db)
    .then(() => console.log("MongoDb Connected"))
    .catch(err => console.log(err))
    
app.get("/", (req, res) => {
    res.send("Hello World");
})

const port = process.env.PORT || 5000;

// 使用 routes
app.use("/api/users", users);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})