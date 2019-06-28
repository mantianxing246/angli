'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  BASE_API: '"http://47.100.175.219:8088"'
  /*  BASE_API: '"http://localhost:8080"'*/
  //   开发环境：
  // web:	 http://47.100.175.219:81  nginx服务
   // 后台：	http://47.100.175.219:8088

  // 测试环境
  // web:	http://47.100.175.219:8081
  // 后台：	http://47.100.175.219:8080
})
