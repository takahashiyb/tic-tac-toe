<script lang="ts" setup>
import GameButtons from '@/component/GameButtons.vue'
import ScoreTable from '@/component/ScoreTable.vue'

import { useGameStore } from '@/stores/game'
import MenuDialog from '@/component/MenuDialog.vue'
import { onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'

const game = useGameStore()

const router = useRouter()

game.switchPlayer2Type('cpu')

onBeforeMount(() => {
  if (localStorage) {
    game.restoreState('cpu')
  }
})

watch(
  () => {
    return game.turnNumber
  },
  () => {
    game.saveLocalStorage('cpu')
  },
)

function goToStartPage() {
  router.push({ name: 'start' })
}
</script>
<template>
  <dialog :open="game.gameState === 'end'">
    <div class="dialog__container">
      <span class="dialog__pretext">{{
        game.winner && game.winner.player === 'YOU'
          ? 'YOU WON!'
          : game.winner && game.winner.player === 'CPU'
            ? 'OH NO, YOU LOST...'
            : ''
      }}</span>
      <div class="dialog__header">
        <img src="@/assets/icons/icon-x.svg" alt="x icon" v-if="game.winner && game.turn === 0" />
        <img src="@/assets/icons/icon-o.svg" alt="o icon" v-if="game.winner && game.turn === 1" />
        <span
          :class="{ teal: game.winner && game.turn === 0, amber: game.winner && game.turn === 1 }"
          >{{ game.winner ? 'TAKES THE ROUND' : 'ROUND TIED' }}</span
        >
      </div>
      <span class="dialog__quit dialog__buttons slate-bg tabbable" @click="goToStartPage()"
        >QUIT</span
      >
      <span class="dialog__next dialog__buttons amber-bg tabbable" @click="game.newGame"
        >NEXT ROUND</span
      >
    </div>
  </dialog>
  <MenuDialog></MenuDialog>
  <header>
    <img src="@/assets/icons/logo.svg" alt="icon of logo" />
    <div class="turn-container">
      <img class="x-mark" src="@/assets/icons/icon-x.svg" alt="x icon" v-if="game.turn === 0" />
      <img class="o-mark" src="@/assets/icons/icon-o.svg" alt="o icon" v-if="game.turn === 1" />
      <span class="turn-indicator">TURN</span>
    </div>
    <div class="button__restart" @click="game.menuRestart = true">
      <span class="sr-only">redirects to game set up page</span>
      <img src="@/assets/icons/icon-restart.svg" alt="" />
    </div>
  </header>
  <main>
    <GameButtons></GameButtons>
    <ScoreTable></ScoreTable>
  </main>
</template>
<style lang="scss" scoped>
@use '/src/assets/styles/main.scss' as v;
@use '/src/assets/styles/functions.scss' as f;

header {
  width: 100%;
  max-width: 424px;

  padding: v.$spacing-300;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: stretch;
  align-items: stretch;
}

main {
  height: 100%;

  display: grid;
  align-content: center;
}

@media (min-width: f.em(700)) {
  main {
    height: auto;
  }
}

.turn-container {
  height: 40px;
  width: 96px;
  background-color: v.$slate-800;

  padding: v.$spacing-150;

  border-radius: v.$radius-06;

  box-shadow: 0 4px rgba(v.$neutral-950, 20%);

  display: flex;
  align-items: center;
  gap: v.$spacing-100;

  justify-self: center;
}

.x-mark,
.o-mark {
  height: 100%;
}

.x-mark {
  filter: invert(1) saturate(0.1) hue-rotate(180deg) brightness(2.3);
}

.o-mark {
  filter: invert(1) saturate(0.05) hue-rotate(300deg) brightness(2.7);
}
</style>
