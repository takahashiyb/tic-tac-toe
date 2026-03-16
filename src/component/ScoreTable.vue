<script lang="ts" setup>
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const scores = game.scores
</script>
<template>
  <section>
    <div class="score-card" :class="game.getSign(scores.left.id) + '-card'">
      <p class="score-card__header">
        {{ game.boardState.find((i) => i.id === scores.left.id)!.sign.toUpperCase() }} ({{
          scores.left.id
        }})
      </p>
      <p class="score-card__score">{{ scores.left.score }}</p>
    </div>
    <div class="score-card">
      <p class="score-card__header">{{ scores.tie.name }}</p>
      <p class="score-card__score">{{ scores.tie.score }}</p>
    </div>
    <div class="score-card" :class="game.getSign(scores.right.id) + '-card'">
      <p class="score-card__header">
        {{ game.boardState.find((i) => i.id === scores.right.id)!.sign.toUpperCase() }} ({{
          scores.right.id
        }})
      </p>
      <p class="score-card__score">{{ scores.right.score }}</p>
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

.score-card {
  text-align: center;

  display: grid;
  place-items: center;

  background-color: rgba(v.$slate-300, 100%);

  padding-top: v.$spacing-150;
  padding-bottom: v.$spacing-150;
  padding-inline: v.$spacing-300;

  border-radius: v.$radius-10;
}

.score-card p {
  color: rgba(v.$neutral-950, 100%);
}

.x-card {
  background-color: rgba(v.$teal-400, 100%);
}

.o-card {
  background-color: rgba(v.$amber-400, 100%);
}
</style>
