import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from 'qiankun'
import { Loading } from 'element-ui'
import store from '../store'

/**
 * @name 导入想传递给子应用的方法，其他类型的数据皆可按此方式传递
 * @description emit建议主要为提供子应用调用主应用方法的途径
 */
// import emits from "../utils/emit"
/**
 * @name 导入qiankun应用间通信机制appStore
 */
import appStore from '../utils/app-store'
/**
 * @name 导入全局常量给子应用
 */
import GLOBAL from '../global'
/**
 * @name 声明子应用挂载dom，如果不需要做keep-alive，则只需要一个dom即可；
 */
const appContainer = '#subapp-viewport'

/**
 * @name 声明要传递给子应用的信息
 * @param data 主应要传递给子应用的数据类信息
 * @param emits 主应要传递给子应用的方法类信息
 * @param GLOBAL 主应要传递给子应用的全局常量
 * @param utils 主应要传递给子应用的工具类信息（只是一种方案）
 * @param components 主应要传递给子应用的组件类信息（只是一种方案）
 */
const props = {
  data: store.getters,
  // emits,
  GLOBAL
}

/**
 * @name 启用qiankun微前端应用
 * @param {Array} list 应用注册表信息
 */
const qianKunStart = (list) => {
  /**
   * @name 处理子应用注册表数据
   */
  const apps = [] // 子应用数组盒子
  let defaultApp = null // 默认注册应用路由前缀
  list.forEach(i => {
    apps.push({
      name: i.name,
      entry: i.entry,
      container: appContainer,
      activeRule: i.routerBase,
      props: { ...props, routes: i.data, routerBase: i.routerBase },
      loader: (is_loading) => {
        if (is_loading) {
          store.dispatch('app/setAppGlobalLoading', { show: true })
        } else {
          store.dispatch('app/setAppGlobalLoading', { show: false })
        }
      }
    })
    if (i.defaultRegister) defaultApp = i.routerBase
  })

  /**
  * @name 注册子应用
  * @param {Array} list subApps
  */
  registerMicroApps(
    apps,
    {
      beforeLoad: [
        app => {
          console.log('[LifeCycle] before load %c%s', 'color: green;', app.name)
        }
      ],
      beforeMount: [
        app => {
          console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
        }
      ],
      afterUnmount: [
        app => {
          console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
        }
      ]
    }
  )

  /**
   * @name 设置默认进入的子应用
   * @param {String} 需要进入的子应用路由前缀
   */
  setDefaultMountApp(defaultApp + '/')

  /**
   * @name 启动微前端
   */
  start({
    sandbox: {
      // strictStyleIsolation: true,
      // experimentalStyleIsolation: true
    },
    singular: false
  })

  /**
   * @name 微前端启动进入第一个子应用后回调函数
   */
  runAfterFirstMounted(() => { })

  /**
 * @name 启动qiankun应用间通信机制
 */
  appStore(initGlobalState)
}

export default qianKunStart
