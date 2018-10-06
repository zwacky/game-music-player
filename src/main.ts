import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Ionic, IonicAPI } from '@modus/ionic-vue';
import toggleClass from '@/common/directives/toggleClass.directive';
import toSeconds from '@/common/pipes/toSeconds.pipe';

Vue.config.productionTip = false;

Ionic.init();
Vue.use(IonicAPI);

Vue.directive('toggleClass', toggleClass);
Vue.filter('toSeconds', toSeconds);

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('ion-app');
