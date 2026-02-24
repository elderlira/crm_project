import { createApp } from 'vue'
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

app.use(router)

app.component('v-chart', VueECharts)

app.mount('#app')

const vuetify = createVuetify({
    components,
    directives,
    themes: {
      light: {
        colors: {
          blue: '#2563eb',
          green: '#16a34a',
          red: '#dc2626',
          orange: '#f59e0b',
          cyan: '#0ea5e9',
          indigo: '#4f46e5',
          teal: '#14b8a6',
          purple: '#8b5cf6',
          yellow: '#eab308',
          pink: '#ec4899',
        },
      },
    },
  },
)

createApp(App)
.use(router)
.use(vuetify)
.mount('#app')

