# 1. 环境搭建
mkdir node-app
cd node-app
npm init

npm install express
npm install nodemon -g

package.json 配置

  "scripts": {
    "start": "node server.js",
    "server": "nodemon server.js"
  },


npm run start
npm run server

# 2 MongoDB配置
注册 mlab.com, 选择区域, Sandbox, 
点击Users , 创建 test/test321

## Mongo DB 使用

一、启动MongoDB的方式
首先，先安装好MongoDB，并且切换到MongoDB的bin目录下：

然后使用：net start MongoDB命令 启动MongoDB
最后使用：mongo --host ip地址:端口号（例如127.0.0.1：27017）
mongo --host 127.0.0.1:27017
或者使用mongo命令
这样就能进入MongoDB了。

<h3> 安装 MongoDB服务 </h3>

    C:\mongodb\bin\mongod.exe --config "C:\mongodb\mongod.cfg" --install

启动MongoDB服务 `net start MongoDB`

关闭MongoDB服务 `net stop MongoDB`

移除 MongoDB 服务 `C:\mongodb\bin\mongod.exe --remove`

### 添加用户

终端输入mongo，首先添加管理用户，

    show dbs // 显示所有的数据库
    use admin // 切换到admin
    db.createUser({user:'root',pwd:'root',roles:['userAdminAnyDatabase']})
    db.auth('root','root')

再切换数据库，添加用户，

    use test
    db.createUser({user:'root',pwd:'root',roles:['readWrite']})

我又添加了 test/test321

## Project

npm install mongoose

配置 ./config/keys.js

    module.exports ={mongoURI:"mongodb://test:test321@127.0.0.1:27017/test"}

server.js

    const express = require("express");
    const mongoose = require("mongoose")
    const app = express();

    // DB config
    const db = require("./config/keys").mongoURI;

    // Connect to mongodb
    mongoose.connect(db)
        .then(() => console.log("MongoDb Connected"))
        .catch(err => console.log(err))
        
    app.get("/", (req, res) => {
        res.send("Hello World");
    })

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })

提示 Mongodb connected

# 3 接口搭建和路由

./routes/api/users.js

    // @login & register
    const express = require("express");
    const router = express.Router();

    // $route GET api/users/test
    // @desc 返回的请求的json数据
    // @access public 
    router.get("/test", (req, res) => {
        res.json({ msg:"login works"} )
    })

    module.exports = router;

./models/User.js

    const mongoose = require("mongoose");
    const Schesma = mongoose.Schema;

    // Create Schema
    const UserSchema = new Schesma({
        name: {type:String, required:true },
        password: {type:String, required:true },
        avatar: {type:String, required:true },
        date: {type:Date, default:Date.now }
    })

    module.exports = User = mongoose.model("users", UserSchema);

./server.js

    
    // 引用 users.js
    const users = require("./routes/api/users");
    ...
    // 使用 routes
    app.use("/api/users", users);

