<template>
    <Pie :data="chartData" :options="chartOptions" />
  </template>
  
  <script setup>
  import { Pie } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js'
  
  ChartJS.register(ArcElement, Tooltip, Legend)
  
  const props = defineProps(['labels', 'values'])
  
  const chartData = {
    labels: props.labels,
    datasets: [
      {
        label: 'Categorías',
        backgroundColor: ['#4F46E5', '#FACC15', '#34D399', '#F87171', '#60A5FA', '#A78BFA'],
        data: props.values
      }
    ]
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  }
  </script>
  
  