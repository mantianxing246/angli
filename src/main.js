import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import elDragDialog from '@/components/directive/el-dragDialog' // 控制弹窗可拖拽
import VueQuillEditor from 'vue-quill-editor' // 富文本编辑框

// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import '@/styles/index.scss' // global css
import '@/styles/recLiveCourse/recLiveCourse.scss' // global record/live-course-add/edit dialog css
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { tableConfig } from '@/GlobalStaticField/tableConfig.js' // tableConfig表格宽度配置
import { selectConfig } from '@/GlobalStaticField/selectConfig.js' // selectConfig选择框宽度配置
import 'babel-polyfill' // 将es6方法转化成es5
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
// const BigNumber = require('bignumber.js')
const requireComponent = require.context(
  // 其组件目录的相对路径
  './BaseComponents',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /.vue$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
// 定义全局方法
const format = function(time) {
  if (!time) {
    return ''
  }
  var y = new Date(time).getFullYear()
  var m = new Date(time).getMonth() + 1
  var d = new Date(time).getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}
// 全局混入
Vue.mixin({
  filters: {
    price(val) {
      if (typeof val === 'number') {
        return val.toLocaleString()
      } else {
        return ''
      }
    },
    mobiles(val) {
      if (typeof val === 'string') {
        return val.substr(0, 3) + '****' + val.substr(7)
      } else {
        return ''
      }
    },
    schoolName(val) {
      if (val && val.length > 15) {
        return val.substr(0, 15) + '...'
      } else {
        return val
      }
    },
    isContinuous(val) {
      if (typeof val === 'number') {
        return val === 1 ? '是' : '否'
      } else {
        return val
      }
    }
  }
})
// 提示信息
const tipsMessage = function(title, type) {
  this.$message({
    message: title,
    type: type
  })
}
// 过滤时间
Vue.prototype.$format = format
Vue.prototype.$tipsMessage = tipsMessage
// 表格宽度
Vue.prototype.$tableConfig = tableConfig
// select宽度
Vue.prototype.$selectConfig = selectConfig
Vue.use(ElementUI, { zIndex: 3000, locale, size: 'mini' })
Vue.use(VueQuillEditor)
Vue.use(elDragDialog)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
