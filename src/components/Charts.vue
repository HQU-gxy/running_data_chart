<script setup>
import {onMounted, ref} from 'vue'
import * as mqtt from "mqtt";
import LineChart from "./LineChart.vue";

defineProps({
  msg: String,
})

let chartData = ref({})
let curDev = ref('')

onMounted(() => {
  initMqtt()
})

function initMqtt() {
  let client = mqtt.connect("mqtt://weihua-iot.cn:9001"); // mqtt websocket port
  client.on("connect", () => {
    client.subscribe("/wit/+/gyro", (err) => {
      if (!err) {
        console.log('subscribe succeed')
      }
    });
  });

  client.on("message", (topic, message) => {
    const curTime = new Date().getTime()
    let data = JSON.parse(message.toString());
    data.accel.unshift(curTime)
    data['angle-vel'].unshift(curTime)
    data.angle.unshift(curTime)

    const devId = getId(topic)
    if (!chartData.value[devId]) {
      initData(devId)
    }

    chartData.value[devId].accel.push(data.accel)
    chartData.value[devId]['angle-vel'].push(data['angle-vel'])
    chartData.value[devId].angle.push(data.angle)
  });
}

function getId(topic) {
  const pattern = /\/wit\/(?<dev_id>[^/]+)\/gyro/;
  const match = topic.match(pattern);

  if (match) {
    return match.groups.dev_id
  } else {
    console.log("No match found.");
  }

}

function initData(id) {
  chartData.value[id] = {
    accel: [],
    'angle-vel': [],
    angle: [],
  }
}
</script>

<template>

  <div class="card">
    <el-select v-model="curDev" placeholder="请选择">
      <el-option
          v-for="item in Object.keys(chartData) "
          :key="item"
          :label="item"
          :value="item">
      </el-option>
    </el-select>
    <div>
      <LineChart title="accel" :data="chartData[curDev] ? chartData[curDev].accel : []"/>
      <LineChart title="angle-vel" :data="chartData[curDev]?chartData[curDev]['angle-vel'] : []"/>
      <LineChart title="angle" :data="chartData[curDev]?chartData[curDev].angle : []"/>
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
