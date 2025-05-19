<template>
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  
  <script setup>
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
  } from 'chart.js'
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)
  
  const props = defineProps(['labels', 'values'])
  
  const chartData = {
    labels: props.labels,
    datasets: [
      {
        label: 'Cantidad',
        backgroundColor: '#4F46E5',
        data: props.values
      }
    ]
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
  </script>
  
  