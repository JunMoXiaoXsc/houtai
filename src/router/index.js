import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import UserInfo from '@/components/UserInfo'
import Welcome from '@/components/Welcome'
import Product from '@/components/Product'
import Role from '@/components/Role'
import Ptype from '@/components/Ptype'
import FuserInfo from '@/components/FuserInfo'
import Orders from '@/components/Orders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      children:[
        {
          path: '/',
          name: 'Welcome',
          component: Welcome
        }
        ,
        {
          path: '/UserInfo',
          name: 'UserInfo',
          component: UserInfo
        },
        {
          path: '/Product',
          name: 'Product',
          component: Product
        },
        {
          path: '/Role',
          name: 'Role',
          component: Role
        },
        {
          path: '/Ptype',
          name: 'Ptype',
          component: Ptype
        },
        {
          path: '/FuserInfo',
          name: 'FuserInfo',
          component: FuserInfo
        },
        {
          path: '/SendPro',
          name: 'Orders',
          component: Orders
        },
      ]
    },
  ]
})
