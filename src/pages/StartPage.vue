<script lang="ts" setup>
import { useGameStore } from '@/stores/game'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const game = useGameStore()

const router = useRouter()

onMounted(() => {
  game.reset()
})

const markIsX = ref<boolean>(true)

const markSelectMoving = ref<boolean>(false)

function switchSelectedMark() {
  markSelectMoving.value = true
  setTimeout(() => {
    markIsX.value = !markIsX.value
    markSelectMoving.value = false
  }, 250)
}

function goToMultiplayer() {
  if (!markIsX.value && game.boardState[0] && game.boardState[0].id === 'P1') {
    game.switchPlayers()
  }

  router.push({ name: 'multiplayer' })
}
</script>
<template>
  <main>
    <img class="logo" src="@/assets/icons/logo.svg" alt="site logo" />
    <div class="container__mark-select">
      <span class="menu__button--label">PICK PLAYER 1’S MARK</span>
      <div class="button__mark-select" @click="switchSelectedMark()">
        <div
          :class="{ loading: markSelectMoving, 'selected-x': markIsX }"
          class="indicator__mark-select"
        ></div>
        <img
          class="mark-x"
          :class="{ dark: markIsX === true }"
          src="/src/assets/icons/icon-x.svg"
          alt=""
        />
        <img
          class="mark-o"
          :class="{ dark: markIsX === false }"
          src="/src/assets/icons/icon-o.svg"
          alt=""
        />
      </div>
      <span class="menu__note">REMEMBER : X GOES FIRST</span>
    </div>
    <span class="menu__button amber-bg">NEW GAME (VS CPU)</span>
    <span class="menu__button teal-bg" @click="goToMultiplayer()">NEW GAME (VS PLAYER)</span>
  </main>
</template>
<style lang="scss" scoped>
@use '@/assets/styles/main.scss' as v;
main {
  min-height: 100%;
  width: 100%;
  max-width: 460px;

  padding-inline: v.$spacing-300;

  display: grid;
  align-content: center;
}

.logo {
  margin-bottom: v.$spacing-375;

  justify-self: center;
}

.container__mark-select {
  background-color: v.$slate-800;
  text-align: center;

  padding-inline: v.$spacing-300;
  padding-top: v.$spacing-375;
  padding-bottom: v.$spacing-375;

  border-radius: v.$radius-16;

  box-shadow: 0 4px rgba(v.$neutral-950, 20%);

  margin-bottom: v.$spacing-500;

  display: grid;
  justify-content: stretch;
}

.menu__button--label {
  margin-bottom: v.$spacing-300;
}

.menu__button {
  height: 56px;
  text-align: center;

  padding-top: v.$spacing-200;
  padding-bottom: v.$spacing-250;

  border-radius: v.$radius-16;
}

.menu__button.teal-bg {
  box-shadow: 0 4px rgba(v.$neutral-950, 20%);
}

.menu__button.amber-bg {
  margin-bottom: v.$spacing-200;
  box-shadow: 0 4px rgba(v.$amber-400, 40%);
}

.button__mark-select {
  background-color: v.$slate-900;
  cursor: pointer;

  padding-top: v.$spacing-100;
  padding-bottom: v.$spacing-100;
  padding-inline: v.$spacing-200;

  border-radius: v.$radius-10;

  margin-bottom: v.$spacing-200;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
}

.mark-x {
  height: 80%;
  grid-column: 1;
  grid-row: 1;
  padding-top: v.$spacing-150;
  padding-bottom: v.$spacing-150;
  justify-self: center;

  filter: invert(1) saturate(0.07) hue-rotate(160deg) brightness(2);
}

.mark-x.dark {
  filter: invert(1) saturate(0.07) hue-rotate(160deg) brightness(0.4);
}

.mark-o {
  height: 80%;
  object-fit: contain;
  grid-column: 2;
  grid-row: 1;
  padding-top: v.$spacing-150;
  padding-bottom: v.$spacing-150;
  justify-self: center;

  filter: invert(1) saturate(0.05) hue-rotate(300deg) brightness(2.7);
}

.mark-o.dark {
  filter: invert(1) saturate(0.05) hue-rotate(300deg) brightness(0.45);
}

.indicator__mark-select {
  height: 80%;
  width: 50%;
  border-radius: v.$radius-10;

  grid-column: 1/3;
  grid-row: 1;
  background-color: v.$slate-300;

  justify-self: end;

  transition: 300ms width ease-in-out;
}

.indicator__mark-select.selected-x {
  justify-self: start;
}

.indicator__mark-select.loading {
  width: 100%;
}
</style>
