<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { onMounted } from 'vue'

const game = useGameStore()

onMounted(() => {
  game.reset()
})
</script>
<template></template>
