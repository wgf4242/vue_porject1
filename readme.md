
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

* [VueCli3.0全栈项目-资金管理系统带权限 学习笔记](#vuecli30全栈项目-资金管理系统带权限-学习笔记)
	* [Chapter 1. 环境搭建](#chapter-1-环境搭建)
	* [Chapter 2 MongoDB配置](#chapter-2-mongodb配置)
		* [Mongo DB 使用](#mongo-db-使用)
		* [安装 MongoDB服务](#安装-mongodb服务)
		* [添加用户](#添加用户)
		* [Project](#project)
	* [Chpater 3 接口搭建和路由](#chpater-3-接口搭建和路由)
	* [Chapter 4 搭建注册接口存储数据](#chapter-4-搭建注册接口存储数据)
	* [Chapter 5 Node接口搭建-使用全球公认头像gravatar](#chapter-5-node接口搭建-使用全球公认头像gravatar)
	* [Chapter 7 Node接口搭建-登录接口](#chapter-7-node接口搭建-登录接口)
	* [Chapter 8 Node接口搭建-使用jwt实现token](#chapter-8-node接口搭建-使用jwt实现token)
	* [Chapter 9 Node接口搭建-使用passport-jwt验证token](#chapter-9-node接口搭建-使用passport-jwt验证token)
	* [Chapter 10 Node接口搭建-增加身份字段及接口调试](#chapter-10-node接口搭建-增加身份字段及接口调试)
	* [Chapter 13 Node接口搭建-更改数据库接口地址3](#chapter-13-node接口搭建-更改数据库接口地址3)

<!-- /code_chunk_output -->

# VueCli3.0全栈项目-资金管理系统带权限 学习笔记

## Chapter 1. 环境搭建

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

## Chapter 2 MongoDB配置

注册 mlab.com, 选择区域, Sandbox

点击Users , 创建 test/test321

### Mongo DB 使用

一、启动MongoDB的方式
首先，先安装好MongoDB，并且切换到MongoDB的bin目录下：

然后使用：net start MongoDB命令 启动MongoDB
最后使用：mongo --host ip地址:端口号（例如127.0.0.1：27017）
mongo --host 127.0.0.1:27017
或者使用mongo命令
这样就能进入MongoDB了。

### 安装 MongoDB服务

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

### Project

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

## Chpater 3 接口搭建和路由

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

## Chapter 4 搭建注册接口存储数据

安装 body-parser

    npm install body-parser

./server.js

    const bodyParser = require("body-parser");
    ...
    // 使用body-parse中间件
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

加密使用 [bcrypt](https://www.npmjs.com/package/bcrypt)

    npm install bcrypt

./routes/users.js 添加 register 接口

    router.post('/register', (req, res) => {
      // console.log(req.body);

      // 查询数据库中是否拥有邮箱
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.status(400).json({ email: '邮箱已被注册' });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
              if (err) throw err;

              newUser.password = hash;

              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
        }
      });
    });

## Chapter 5 Node接口搭建-使用全球公认头像gravatar

注册后会得到有邮箱的头像，未注册不会得到头像。。选择对应的格式 ,g pg

[gravater](http://cn.gravatar.com/)

      const gravatar = require('gravatar');

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

## Chapter 7 Node接口搭建-登录接口

routes/users.js

    router.post('/login', (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      // 查询数据库
      User.findOne({ email }).then(user => {
        if (!user) {
          return res.status(404).json({ email: '用户不存在' });
        }

        // 密码匹配
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            res.json({ msg: 'success' });
          } else {
            return res.status(400).json({ password: '密码错误' });
          }
        });
      });
    });

## Chapter 8 Node接口搭建-使用jwt实现token

使用 jsonwebtoken

    npm i jsonwebtoken

使用jwt sign函数来处理

    const jwt = require('jsonwebtoken');
    ...
    if (isMatch) {
      const rule = {id:user.id, name:user.name};
      // jwt.sign('规则', '加密名字', '过期时间','箭头函数')
      jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
        if(err) throw err;
        res.json({
          success:true,
          token:'mrwu' + token
        })
      })
      // res.json({ msg: 'success' });

## Chapter 9 Node接口搭建-使用passport-jwt验证token

npm i passport-jwt passport

server.js

    const passport = require('passport');
    ...
    app.use(passport.initialize());
    require('./config/passport')(passport);

./routes/api/user.js

    const passport = require('passport');
    ...
    router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
    })

./config/passport.js

    const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const mongoose = require('mongoose');
    const User = mongoose.model('users');
    const keys = require('../config/keys');


    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = keys.secretOrKey;

    module.exports = passport => {
        passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
            console.log(jwt_payload);
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false)
                })
                .catch(err => console.log(err))
        }));
    }

## Chapter 10 Node接口搭建-增加身份字段及接口调试

    // 密码匹配
    bcrypt.compare(password, user.password).then(isMatch => {
      ...
      identity:user.identity};

    router.get('/current'... {
      ...
      identity: req.user.identity});

## Chapter 13 Node接口搭建-更改数据库接口地址3

./routes/api/profiles.js

    const express = require('express');
    const router = express.Router();
    const passport = require('passport');

    const Profile = require('../../models/Profile');

    router.get('/test', (req, res) => {
      res.json({ msg: 'profile works' });
    });

    router.post( '/add', passport.authenticate('jwt', { session: false }), (req, res) => {
        const profileFields = {};
        if (req.body.type) profileFields.type = req.body.type;
        if (req.body.describe) profileFields.describe = req.body.describe;
        if (req.body.income) profileFields.income = req.body.income;
        if (req.body.expend) profileFields.expend = req.body.expend;
        if (req.body.cash) profileFields.cash = req.body.cash;
        if (req.body.remark) profileFields.remark = req.body.remark;

        new Profile(profileFields).save().then(profile => {
          res.json(profile);
        })
      }
    );
    module.exports = router;

./models/Profile.js

    const mongoose = require('mongoose');
    const Schesma = mongoose.Schema;
    const ProfileSchema = new Schesma({
      type: {
        type: String
      },
      income: {
        type: String,
        required: true
      },
      expend: {
        type: String,
        required: true
      },
      cash: {
        type: String
      },
      remark: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    });

    module.exports = Profile = mongoose.model('profile', ProfileSchema);
