<template>
  <div ref="chart" style="width: 1000px; height: 300px;"></div>
</template>

<script>
import * as echarts from 'echarts'
import VueECharts from 'vue-echarts'
import {markRaw, toRaw} from "vue";

export default {
  name: 'LineChart',
  components: {
    VueECharts,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    arrayNames:{
      type: Array,
      default: () => ['x', 'y', 'z']
    }
  },
  data() {
    return {
      chart: {},
      option: {}
    }
  },
  mounted() {
    console.log(this.data)
    this.renderChart()
  },

  watch: {
    data: {
      deep: true,
      handler(val) {
        console.log(val)
        this.setOptions(val)
      }
    }
  },
  methods: {

    setOptions() {
      this.option.dataset.source = toRaw(this.data)
      this.chart.setOption({
        dataset: this.option.dataset
      })
    },
    renderChart() {
      this.chart = markRaw(echarts.init(this.$refs.chart))

      this.option = {
        title: {
          text:this.title
        },
        animation: false,
        xAxis: {
          type: 'time',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
        },
        legend: {},
        yAxis: {},
        dataset: {
          dimensions: ['time', 'array0', 'array1', 'array2'],
          source: toRaw(this.data)
        },
        series: [
          {
            type: 'line',
            name: this.arrayNames[0],
            encode: {
              x: 'time',
              y: 'array0'
            }
          },
          {
            type: 'line',
            name: this.arrayNames[1],
            encode: {
              x: 'time',
              y: 'array1'
            }
          },
          {
            type: 'line',
            name: this.arrayNames[2],
            encode: {
              x: 'time',
              y: 'array2'
            }
          },
        ],
      }

      this.chart.setOption(this.option)
    },
  },
}
</script>
