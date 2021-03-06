import store from '@/store'
import http from '@/api/http'

/**
 * @name 启动qiankun应用间通信机制
 * @param {Function} initGlobalState 官方通信函数
 * @description 注意：主应用是从qiankun中导出的initGlobalState方法，
 * @description 注意：子应用是附加在props上的onGlobalStateChange, setGlobalState方法（只用主应用注册了通信才会有）
 */
export default (initGlobalState) => {
  /**
   * @name 初始化数据内容
   */
  const { onGlobalStateChange, setGlobalState } = initGlobalState({
    appsRefresh: false
  })

  /**
   * @name 监听数据变动
   * @param {Function} 监听到数据发生改变后的回调函数
   * @des 将监听到的数据存入vuex
   */
  onGlobalStateChange((value, prev) => {
    console.log('[onGlobalStateChange - master]:', value, prev)
    'msg' in value && store.dispatch('appstore/setMsg', value.msg)
  })

  /**
   * @name 改变数据并向所有应用广播
   */
  setGlobalState({
    ignore: 'main',
    methods: {
      request: http
    },
    mainConfing: {
      token: store.getters.token,
      user_info: store.getters.user_info
    }
  })
}
