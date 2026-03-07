import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
// import 'vuetify/styles'
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

const app = createApp(App)
const pinia = createPinia()

app.use(router)

app.component('v-chart', VueECharts)

app.mount('#app')

const vuetify = createVuetify({
    components,
    directives,
    themes: {
      light: {

      },
    },
  },
)

createApp(App)
.use(router)
.use(vuetify)
.use(pinia)
.mount('#app')

