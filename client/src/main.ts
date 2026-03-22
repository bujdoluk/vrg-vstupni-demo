import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import i18n from '../src/plugins/i18n';

import SimulationStatePanel from './components/panels/SimulationStatePanel.vue';
import LogPanel from './components/panels/LogPanel.vue';
import UnitInfoPanel from './components/panels/UnitInfoPanel.vue';
import MapPanel from './components/panels/MapPanel.vue';

import SimulationStateTab from './components/tabs/SimulationStateTab.vue';
import LogTab from './components/tabs/LogTab.vue';
import UnitInfoTab from './components/tabs/UnitInfoTab.vue';
import MapTab from './components/tabs/MapTab.vue';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  }
})

const app = createApp(App)
app.component("simulationStatePanel", SimulationStatePanel)
app.component("logPanel", LogPanel)
app.component("unitInfoPanel", UnitInfoPanel)
app.component("mapPanel", MapPanel)

app.component("simulationStateTab", SimulationStateTab)
app.component("logInfoTab", LogTab)
app.component("unitInfoTab", UnitInfoTab)
app.component("mapTab", MapTab) 

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
