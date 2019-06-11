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

# 2
注册 mlab.com, 选择区域, Sandbox, 

点击Users , 创建 test/123456
