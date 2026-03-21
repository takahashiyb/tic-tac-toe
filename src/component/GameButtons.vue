<script lang="ts" setup>
import { useCpuStore, useGameStore } from '@/stores/game.ts'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const game = useGameStore()

const cpu = useCpuStore()

const boardState = game.boardState

function canClick(value: number) {
  if (
    boardState[0] &&
    (boardState[0].state.includes(value, 0) ||
      (boardState[1] && boardState[1].state.includes(value, 0)))
  ) {
    return
  }
  game.changeBoardStatus(value)
}

watch(
  () => game.turn,
  (turn) => {
    if (route.name === 'cpu') {
      cpu.move()
    }
  },
  { immediate: true },
)
</script>
<template>
  <section>
    <div v-for="value in 9" @click="canClick(value)" class="button">
      <img
        class="hover-icon"
        v-if="
          game.boardState[0] &&
          !game.boardState[0].state.includes(value, 0) &&
          game.boardState[1] &&
          !game.boardState[1].state.includes(value, 0) &&
          game.turn === 1 &&
          game.gameState !== 'end'
        "
        src="/src/assets/icons/icon-o-outline.svg"
        alt="hovered o icon"
      />
      <img
        v-if="game.boardState[1] && game.boardState[1].state.includes(value, 0)"
        src="/src/assets/icons/icon-o.svg"
        alt="selected o icon"
      />
      <img
        class="hover-icon"
        v-if="
          game.boardState[0] &&
          !game.boardState[0].state.includes(value, 0) &&
          game.boardState[1] &&
          !game.boardState[1].state.includes(value, 0) &&
          game.turn === 0 &&
          game.gameState !== 'end'
        "
        src="/src/assets/icons/icon-x-outline.svg"
        alt="hovered x icon"
      />
      <img
        v-if="game.boardState[0] && game.boardState[0].state.includes(value, 0)"
        src="/src/assets/icons/icon-x.svg"
        alt="selected x icon"
      />
    </div>
  </section>
</template>
<style lang="scss" scoped>
@use '@/assets/styles/main.scss' as v;

section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: v.$spacing-250;

  padding: v.$spacing-300;
}

img {
  min-height: 100%;
  min-width: 100%;
  max-width: 64px;
}

.button {
  background-color: v.$slate-800;
  aspect-ratio: 1;

  padding: v.$spacing-300;

  border-radius: v.$radius-10;
  box-shadow: 0 8px rgba(v.$neutral-950, 20%);

  display: grid;
  place-items: center;

  cursor: pointer;
}

.button .hover-icon {
  opacity: 0;
}

.button:hover .hover-icon {
  opacity: 100%;
}
</style>
