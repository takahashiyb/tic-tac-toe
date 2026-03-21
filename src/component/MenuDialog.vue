<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { useRoute, useRouter } from 'vue-router'

const game = useGameStore()

const router = useRouter()

const route = useRoute()

function goToStartPage(path: 'multiplayer' | 'cpu') {
  const saveStates = { multiplayer: 'savedMulti', cpu: 'savedCpu' }

  const saveState: string = saveStates[path]

  localStorage.removeItem(saveState)

  game.reset()

  router.push({ name: 'start' })
}
</script>
<template>
  <dialog :open="game.menuRestart === true">
    <div class="dialog__container">
      <span class="dialog__header">RESTART GAME?</span>
      <span
        class="dialog__resume dialog__buttons slate-bg tabbable"
        @click="game.menuRestart = false"
        >NO, CANCEL</span
      >
      <span
        class="dialog__setup dialog__buttons amber-bg tabbable"
        @click="
          goToStartPage(
            route.name === 'multiplayer' || route.name === 'cpu' ? route.name : 'multiplayer',
          )
        "
        >YES, RESTART</span
      >
    </div>
  </dialog>
</template>
