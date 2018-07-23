import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Service from '@/components/Service'
import ServGetDetails from '@/components/ServGetDetails'
import ConfirmAnAppointment from '@/components/ConfirmAnAppointment'
import SubmitSuccess from '@/components/SubmitSuccess'
import Appraise from '@/components/Appraise'
import OrderInfo from '@/components/OrderInfo'
import My from '@/components/My'
// import Index from '@/components/Index'
import Record from '@/components/Record'
import Wait from '@/components/Wait'
import AllService from '@/components/AllService'
import EvaluateSuccess from '@/components/EvaluateSuccess'

import MyInfo from '@/components/MyInfo'
import MyCollect from '@/components/MyCollect'
import Illness from '@/components/Illness'

import Chat from '@/components/chat/Chat'



Vue.use(Router)

const router  = new Router({
  routes: [
    {
      path: '/service',
      name: 'Service',
      component: Service,
      meta: {
       title: '服务'
      },
    },
    // {
    //   path: '/index',
    //   name: 'Index',
    //   meta: {
    //    title: 'index'
    //   },
    //   component: Index
    // },
    {
      path: '/servgetdetails',
      name: 'ServGetDetails',
      meta: {
       title: '服务详情'
      },
      component: ServGetDetails
    },
    {
      path: '/chat',
      name: 'Chat',
      meta: {
       title: '在线咨询'
      },
      component: Chat
    },
    {
      path: '/confirmanappointment',
      name: 'ConfirmAnAppointment',
      meta: {
       title: '确认预约'
      },
      component: ConfirmAnAppointment
    },
    {
      path: '/submitsuccess',
      name: 'SubmitSuccess',
      meta: {
       title: '提交成功'
      },
      component: SubmitSuccess
    },
    {
      path: '/orderinfo',
      name: 'OrderInfo',
      meta: {
       title: '订单信息'
      },
      component: OrderInfo
    },
    {
      path: '/appraise',
      name: 'Appraise',
      meta: {
       title: '评价'
      },
      component: Appraise
    },
    {
      path: '/evaluateSuccess',
      name: 'EvaluateSuccess',
      meta: {
       title: '评价成功'
      },
      component: EvaluateSuccess
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
       title: '登录'
      },
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      meta: {
       title: '填写资料'
      },
      component: Register
    },
    {
      path: '/my',
      name: 'My',
      meta: {
       title: '我的'
      },
      component: My
    },
    {
      path: '/record',
      name: 'Record',
      meta: {
        title: '服务记录'
      },
      component: Record,
      children:[
        { path: 'wait',
          component: Wait,
          meta: {
            title: '待服务'
          },
        },
        { path: 'allservice',
          component: AllService,
          meta: {
            title: '全部预约'
          },
        }
      ],redirect:'/record/wait' // 默认加载项
    },
    {
      path: '/myinfo',
      name: 'MyInfo',
      meta: {
       title: '个人资料'
      },
      component: MyInfo
    },
    {
      path: '/mycollect',
      name: 'MyCollect',
      meta: {
       title: '我的收藏'
      },
      component: MyCollect
    },
    {
      path: '/illness',
      name: 'Illness',
      meta: {
       title: '已患疾病'
      },
      component: Illness
    },
    {path:'*',redirect:'/service'}
  ]
})


// 全局路由守卫
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // console.log("to")
  // console.log(to)
  // console.log("from")
  // console.log(from)

  //处理网易云信退出操作
  if(to.name == 'ServGetDetails' && from.name== 'Chat' || to.name == 'OrderInfo' && from.name== 'Chat' ){
    nim.disconnect();
  } 

  // 用作登录成功后跳回之前的页面
  if(to.name == 'Login'){
    sessionStorage.setItem('back', JSON.stringify(from.path));
  }

  const nextRoute = ['/my', '/mycollect','/myinfo','/confirmanappointment','/orderinfo','/record/wait','/record/allservice','/chat'];
  let data = JSON.parse(localStorage.getItem('userInfo'));
  // let isLogin = global.isLogin;  // 是否登录
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.path) >= 0) {
    if (!data) {
      router.push({ path: '/login', name: 'Login' })
    }
  }
  // 已登录状态；当路由到login时，跳转至主页
  // if (to.name === 'Login') {
  //   if (!!data) {
  //     router.replace({ path: '/', name: 'Service' });
  //   }
  // }
  const nextRoute2 = ['ServGetDetails'];
  let data1 = JSON.parse(sessionStorage.getItem('serviceId'));
  if (nextRoute2.indexOf(to.name) >= 0) {
    if (!data1) {
      router.replace({ path: '/login', name: 'Login' })
    }
  }

  // const nextRoute3 = ['My','Register'];
  // if (!(nextRoute3.indexOf(to.name) >= 0 && from.name!='Login')) {
  //     router.replace({ path: '/service', name: 'Service' })
  // }
  // 订单页返回首页
  const nextRoute1 = ['SubmitSuccess','EvaluateSuccess'];
  const current = ['OrderInfo'];
  if(nextRoute1.indexOf(to.name)>=0 && current.indexOf(from.name)>=0){
     router.replace({ path: '/', name: 'Service' });
  }
  next();
});

export default router;
