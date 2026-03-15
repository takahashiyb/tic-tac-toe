<script lang="ts" setup>
import { useGameStore } from '@/stores/game.ts'

const game = useGameStore()

function canClick(value: number) {
  const boardState = game.boardState
  if (
    boardState[0] &&
    (boardState[0].state.includes(value, 0) ||
      (boardState[1] && boardState[1].state.includes(value, 0)))
  ) {
    return
  }
  game.changeBoardStatus(value)
}
</script>
<template>
  <!-- <button type="button" v-for="value in 9" @click="canClick(value)">
    {{ game.boardState[0] && game.boardState[0].state.includes(value, 0) ? 'x' : '' }}
    {{ game.boardState[1] && game.boardState[1].state.includes(value, 0) ? 'o' : '' }}
  </button> -->
  <svg width="66" height="66" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33 1c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C15.327 65 1 50.673 1 33 1 15.327 15.327 1 33 1Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"
      stroke="#F2B137"
      stroke-width="2"
      fill="none"
    />
  </svg>
</template>
<style lang="scss">
div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

button {
  aspect-ratio: 1;
  font-size: 100px;
}

path {
}
</style>
