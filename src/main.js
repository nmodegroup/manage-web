import Vue from 'vue';
import iView from 'iview';
import Routers from './router';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
Vue.use(iView);
Vue.prototype.$goto = function (name, query, params) {
    let last = arguments[arguments.length - 1]
    let delay = typeof last === 'number' ? last : 2
    setTimeout(() => {
        this.$router.push({
        name: name,
        query: query || {},
        params: params || {}
        })
    }, delay)
}
new Vue({
    el: '#app',
    router: Routers,
    components: { App },
    template: '<App/>'
});
