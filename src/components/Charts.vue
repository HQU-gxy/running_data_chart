<script setup>
import {onMounted, reactive, ref, toRaw} from 'vue'
import * as mqtt from "mqtt";
import Chart from "./LineChart.vue"; // import everything inside the mqtt module and give it the namespace "mqtt"

defineProps({
  msg: String,
})

let chartData = ref({})
let dataReady = ref(false)

onMounted(() => {
  initMqtt()
  initData('aaa')
  dataReady.value = true
})

function initMqtt() {
  let client = mqtt.connect("mqtt://weihua-iot.cn:9001"); // mqtt websocket port
  client.on("connect", () => {
    client.subscribe("/wit/+/test", (err) => {
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

    if (!chartData[topic.toString()]) {
      initData(topic.toString())
    }
    const devId = getId(topic)
    chartData.value[devId].accel.push(data.accel)
    chartData.value[devId]['angle-vel'].push(data['angle-vel'])
    chartData.value[devId].angle.push(data.angle)
    // console.log(data)
    // console.log(chartData)
  });
}

function getId(topic) {
  const pattern = /\/wit\/(?<dev_id>[^/]+)\/test/;
  const match = topic.match(pattern);

  if (match) {
    const dev_id = match.groups.dev_id;
    console.log(dev_id);
    return dev_id
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

    <div v-if="dataReady">
      <Chart title="accel" :data="chartData['aaa'].accel"/>
      <Chart title="angle-vel" :data="chartData['aaa']['angle-vel']"/>
      <Chart title="angle" :data="chartData['aaa'].angle"/>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
