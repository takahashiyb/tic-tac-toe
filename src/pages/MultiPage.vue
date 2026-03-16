<script lang="ts" setup>
import GameButtons from '@/component/GameButtons.vue'
import ScoreTable from '@/component/ScoreTable.vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()
</script>
<template>
  <dialog :open="game.gameState === 'end'">
    <div class="dialog__container">
      <span class="dialog__pretext">{{
        game.winner && game.winner.player.toUpperCase() + ' WINS!'
      }}</span>
      <div class="dialog__header">
        <img src="@/assets/icons/icon-x.svg" alt="x icon" v-if="game.winner && game.turn === 0" />
        <img src="@/assets/icons/icon-o.svg" alt="o icon" v-if="game.winner && game.turn === 1" />
        <span
          :class="{ teal: game.winner && game.turn === 0, amber: game.winner && game.turn === 1 }"
          >{{ game.winner ? 'TAKES THE ROUND' : 'ROUND TIED' }}</span
        >
      </div>
      <span class="dialog__quit">QUIT</span>
      <span class="dialog__next" @click="game.newGame">NEXT ROUND</span>
    </div>
  </dialog>
  <header>
    <img src="@/assets/icons/logo.svg" alt="icon of logo" />
    <div class="turn-container">
      <img class="x-mark" src="@/assets/icons/icon-x.svg" alt="x icon" v-if="game.turn === 0" />
      <img class="o-mark" src="@/assets/icons/icon-o.svg" alt="o icon" v-if="game.turn === 1" />
      <span class="turn-indicator">TURN</span>
    </div>
    <div class="button__restart">
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

header {
  min-width: 100%;

  padding: v.$spacing-300;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
}

main {
  height: 100%;

  display: grid;
  align-content: center;
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

.button__restart {
  background-color: v.$slate-300;
  height: 40px;

  padding: v.$spacing-150;

  border-radius: v.$radius-06;

  box-shadow: 0 4px rgba(v.$slate-300, 40%);

  justify-self: flex-end;
}

dialog {
  min-width: 100%;
  min-height: 100%;

  background-color: rgba(v.$neutral-950, 50%);

  border: none;

  z-index: 99;

  align-items: center;
}

dialog[open] {
  display: grid;
}

.dialog__container {
  min-width: 100%;

  background-color: rgba(v.$slate-800, 100%);

  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  column-gap: v.$spacing-200;

  padding: v.$spacing-500;
}

.dialog__pretext {
  flex: 1;
  min-width: 100%;
  text-align: center;

  padding-bottom: v.$spacing-200;
}

.dialog__header {
  font-size: 40px;
  flex: 1;
  min-width: 100%;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: v.$spacing-100;

  padding-bottom: v.$spacing-300;
}

.teal {
  color: rgba(v.$teal-400, 100%);
}

.amber {
  color: rgba(v.$amber-400, 100%);
}

.dialog__quit {
  color: rgba(v.$slate-900, 100%);
  background-color: rgba(v.$slate-300, 100%);
  text-align: center;

  padding: v.$spacing-200;

  border-radius: v.$radius-10;

  box-shadow: 0 4px rgba(v.$neutral-950, 20%);
}

.dialog__next {
  color: rgba(v.$slate-900, 100%);
  background-color: rgba(v.$amber-400, 100%);
  text-align: center;

  padding: v.$spacing-200;

  border-radius: v.$radius-10;

  box-shadow: 0 4px rgba(v.$amber-400, 40%);

  cursor: pointer;
}
</style>
