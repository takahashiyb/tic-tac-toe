<script lang="ts" setup>
import { useGameStore } from '@/stores/game'

const game = useGameStore()
</script>
<template>
  <dialog :open="game.menuRestart === true">
    <div class="dialog__container">
      <span class="dialog__header">RESTART GAME?</span>
      <span class="dialog__resume dialog__buttons" @click="game.menuRestart = false"
        >NO, CANCEL</span
      >
      <RouterLink :to="{ name: 'start' }" class="dialog__setup dialog__buttons"
        >YES, RESTART</RouterLink
      >
    </div>
  </dialog>
</template>
