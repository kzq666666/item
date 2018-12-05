import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import history from '@/components/history'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'main',
      component:main,
      children:[
        
      ]
    },
    {
      path:'/historyStock/:abiid',
      name:'history',
      component:history
    }
  ]
})
