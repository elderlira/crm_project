import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { format } from 'date-fns'
import './style.css'
import App from './App.vue'
import router from './router'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

import * as echarts from 'echarts'
import VueECharts from 'vue-echarts'

import {
  PieChart,
  BarChart,
  LineChart
} from 'echarts/charts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'


echarts.use([
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
])


const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.config.globalProperties.$formatDate = (date: string | number | Date, fmt: string) => {
  return format(date, fmt);
};

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.component('v-chart', VueECharts)

app.mount('#app')