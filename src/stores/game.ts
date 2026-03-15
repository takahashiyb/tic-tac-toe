import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const winners = [123, 159, 147, 258, 357, 369, 456, 789]

  const gameState = ref<'start' | 'midgame' | 'end'>('start')

  const turnNumber = ref<number>(0)

  const turn = computed(() => {
    return turnNumber.value % 2
  })

  const boardState = ref<{ sign: 'x' | 'o'; id: string; player: string; state: number[] }[]>([
    { sign: 'x', id: 'P1', player: 'Player 1', state: [] },
    { sign: 'o', id: 'P2', player: 'Player 2', state: [] },
  ])

  const scores = ref<{
    left: { id: 'P1'; name: 'Player 1' | 'YOU'; score: number }
    tie: { id: 'tie'; name: 'tie'; score: number }
    right: { id: 'P2'; name: 'Player 2' | 'CPU'; score: number }
  }>({
    left: { id: 'P1', name: 'Player 1', score: 0 },
    tie: { id: 'tie', name: 'tie', score: 0 },
    right: { id: 'P2', name: 'Player 2', score: 0 },
  })

  function changeBoardStatus(position: number) {
    if (gameState.value === 'end') {
      return
    }

    const playerStats = boardState.value[turn.value]
    if (playerStats) {
      playerStats.state.push(position)
    }

    checkResult()
  }

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

      console.log('win ' + playerStats.player + playerStats.sign)
      return
    }

    turnNumber.value++

    if (turnNumber.value === 9) {
      gameState.value = 'end'
      return
    }

    gameState.value = 'midgame'
    return
  }

  return { gameState, boardState, turn, scores, changeBoardStatus, checkResult }
})
