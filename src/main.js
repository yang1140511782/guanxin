// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Mint from 'mint-ui';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'mint-ui/lib/style.css'

// http://localhost:8080/?hospitalId=ff80830423423423423eede5000f
axios.defaults.baseURL ='http://10.2.2.2';
// axios.defaults.baseURL ='http://cluster.cardiochina.net';

Vue.use(ElementUI);
Vue.use(Mint);
Vue.prototype.$http= axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
