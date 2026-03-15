import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const winners = [123, 159, 147, 258, 357, 369, 456, 789]

  const gameState = ref<'start' | 'midgame' | 'end'>('start')

  const turnNumber = ref<number>(0)

  const turn = computed(() => {
    return turnNumber.value % 2
  })

  const boardState = ref<{ sign: 'x' | 'o'; player: string; state: number[] }[]>([
    { sign: 'x', player: 'P1', state: [] },
    { sign: 'o', player: 'P2', state: [] },
  ])

  const scores = ref<{
    player1: { name: 'Player 1'; score: number }
    tie: { name: 'tie'; score: number }
    player2: { name: 'Player 2' | 'CPU'; score: number }
  }>({
    player1: { name: 'Player 1', score: 0 },
    tie: { name: 'tie', score: 0 },
    player2: { name: 'Player 2', score: 0 },
  })

  function checkResult() {
    const playerStats = boardState.value[turn.value]

    // Skips the check since a winner could not be decided before a player takes less than 3 turns
    if (playerStats && playerStats.state.length < 3) {
      turnNumber.value++
      gameState.value = 'midgame'
      return
    }

    // Checks for a winning combination
    if (
      playerStats &&
      winners
        .filter((i) => {
          return playerStats.state.includes(Number(i.toString()[0]), 0)
        })
        .filter((i) => {
          return playerStats.state.includes(Number(i.toString()[1]), 0)
        })
        .filter((i) => {
          return playerStats.state.includes(Number(i.toString()[2]), 0)
        }).length > 0
    ) {
      gameState.value = 'end'
      return
    }

    turnNumber.value++
    gameState.value = 'midgame'
    return
  }

  return { gameState, turn, scores, checkResult }
})
