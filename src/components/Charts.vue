<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import * as mqtt from "mqtt"
import LineChart from "./LineChart.vue"

defineProps({
  msg: String,
})

interface ChartData {
  // dimension 1 is each item (recording)
  // dimension 2 is [time, x, y, z]
  // Why not use [Date, number, number, number]?
  accel: number[][],
  angle_vel: number[][],
  angle: number[][],
}

interface ItemData {
  accel: number[],
  angle_vel: number[],
  angle: number[]
}

let chartData: Ref<Record<string, ChartData>> = ref({})
let curDev = ref('')

onMounted(() => {
  initMqtt()
})

const MAX_LEN = 100

function pushWithSize(arr: number[][], item: number[], maxLen: number) {
  arr.push(item)
  if (arr.length > maxLen) {
    arr.shift()
  }
}

function initMqtt() {
  let client = mqtt.connect("mqtt://weihua-iot.cn:9001") // mqtt websocket port
  client.on("connect", () => {
    client.subscribe("/wit/+/gyro", (err) => {
      if (!err) {
        console.log('subscribe succeed')
      }
    })
  })

  client.on("message", (topic, message) => {
    const curTime = new Date().getTime()
    let data = JSON.parse(message.toString()) as ItemData
    data.accel.unshift(curTime)
    data.angle_vel.unshift(curTime)
    data.angle.unshift(curTime)

    const devId = getId(topic)
    if (!chartData.value[devId]) {
      initData(devId)
    }

    pushWithSize(chartData.value[devId].accel, data.accel, MAX_LEN)
    pushWithSize(chartData.value[devId].angle_vel, data.angle_vel, MAX_LEN)
    pushWithSize(chartData.value[devId].angle, data.angle, MAX_LEN)
  })
}

function getId(topic: string) {
  const pattern = /\/wit\/(?<dev_id>[^/]+)\/gyro/
  const match = topic.match(pattern)

  if (match) {
    return match.groups?.dev_id!
  } else {
    throw new Error('invalid topic')
  }
}

function initData(id: string) {
  chartData.value[id] = {
    accel: [],
    angle_vel: [],
    angle: [],
  }
}
</script>

<template>
  <div class="card">
    <el-select v-model="curDev" placeholder="请选择">
      <el-option v-for="item in Object.keys(chartData) " :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
    <div>
      <LineChart title="accel" :data="chartData[curDev] ? chartData[curDev].accel : []" />
      <LineChart title="angle-vel" :data="chartData[curDev] ? chartData[curDev].angle_vel : []" />
      <LineChart title="angle" :arrayNames="['yaw', 'pitch', 'roll']" :data="chartData[curDev] ? chartData[curDev].angle : []" />
    </div>
    <div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
