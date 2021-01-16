import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import {remote} from 'electron';

import {initDatabase} from './utils/db';

Vue.config.productionTip = false;

Vue.prototype.$basePath = remote.app.getPath('userData');

initDatabase().then(() => {
  console.log('success');
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
