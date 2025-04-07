import '@/styles/main.scss';
import {createApp} from 'vue';
import router from '@/router/router';
import App from '@/App.vue';
import {createPinia} from 'pinia';
import {piniaPersistPlugin} from '@/piniaPersist';

const pinia = createPinia();
pinia.use(piniaPersistPlugin);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
