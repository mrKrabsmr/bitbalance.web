<script setup lang="ts">
  import { Pie } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'
  import { computed, ref } from 'vue'

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

  const props = defineProps({
    chartVals: Object,
  })

  const colors = ref(["#7076b5", "#ccf576", "orange", "red", "gray"])
  const chartData = computed(() => ({
    labels: Object.keys(props.chartVals),
    datasets: [
      {
        label: "$",
        backgroundColor: colors.value.slice(0, props.chartVals.length),
        data: Object.values(props.chartVals),
      },
    ]
  }))

  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false
  })
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<style scoped lang="scss">
  Pie {
    pointer-events: none;
  }
</style>
