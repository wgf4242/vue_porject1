const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const app = express();
const passport = require('passport');

// 引用 users.js
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles.js");

// DB config
// const db = require("./config/keys").mongoURI;
const db = require("./config/keys").mongoURI;

// 使用body-parse中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Connect to mongodb
mongoose.connect(db)
    .then(() => console.log("MongoDb Connected"))
    .catch(err => console.log(err))
    
// passport 初始化
app.use(passport.initialize());

require('./config/passport')(passport);


// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

const port = process.env.PORT || 5000;

// 使用 routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})