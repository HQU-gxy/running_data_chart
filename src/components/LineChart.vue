<template>
  <div ref="chart" style="width: 800px; height: 300px;"></div>
</template>

<script>
import * as echarts from 'echarts'
import VueECharts from 'vue-echarts'
import {toRaw} from "vue";

let chart = {}
export default {
  name: 'Chart',
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
    }
  },
  data() {
    return {
      // chart: {},
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
      chart.setOption({
        dataset: this.option.dataset
      })
    },
    renderChart() {
      chart = echarts.init(this.$refs.chart)

      this.option = {
        title: {
          text:this.title
        },
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
          dimensions: ['time', '2015', '2016', '2017'],
          // source: [
          //   {time: new Date(2022, 0, 1), '2015': 43.3, '2016': 85.8, '2017': 93.7},
          //   {time: new Date(2022, 0, 2), '2015': 83.1, '2016': 73.4, '2017': 55.1},
          //   {time: new Date(2022, 0, 3), '2015': 86.4, '2016': 65.2, '2017': 82.5},
          //   {time: new Date(2022, 0, 4), '2015': 72.4, '2016': 53.9, '2017': 39.1}
          // ],
          // source: [
          //   [new Date(2022, 0, 1), 43.3, 85.8, 93.7],
          //   [new Date(2022, 0, 2), 83.1, 73.4, 55.1],
          //   [new Date(2022, 0, 3), 86.4, 65.2, 82.5],
          //   [new Date(2022, 0, 4), 72.4, 53.9, 39.1]
          // ]
          source: toRaw(this.data)
        },
        series: [
          {
            type: 'line',
            name: 'array0',
            encode: {
              x: 'time',
              y: '2015'
            }
          },
          {
            type: 'line',
            name: 'array1',
            encode: {
              x: 'time',
              y: '2016'
            }
          },
          {
            type: 'line',
            name: 'array2',
            encode: {
              x: 'time',
              y: '2017'
            }
          },
        ],
      }

      chart.setOption(this.option)
    },
  },
}
</script>
