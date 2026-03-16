import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const winners = [123, 159, 147, 258, 357, 369, 456, 789]

  const menuRestart = ref<boolean>(false)

  function reset() {
    menuRestart.value = false
    gameState.value = 'start'
    turnNumber.value = 0
    winner.value = null
    boardState.value = [
      { sign: 'x', id: 'P1', player: 'Player 1', state: [] },
      { sign: 'o', id: 'P2', player: 'Player 2', state: [] },
    ]
    scores.value = {
      left: { id: 'P1', name: 'Player 1', score: 0 },
      tie: { id: 'tie', name: 'TIES', score: 0 },
      right: { id: 'P2', name: 'Player 2', score: 0 },
    }
  }

  function saveLocalStorage() {
    const states = {
      gameState: gameState.value,
      turnNumber: turnNumber.value,
      boardState: boardState.value,
      scores: scores.value,
    }

    localStorage.setItem('saveData', JSON.stringify(states))
  }

  function restoreState() {
    const savedData = localStorage.getItem('saveData')

    if (savedData) {
      const parsed = JSON.parse(savedData)
      gameState.value = parsed.gameState
      turnNumber.value = parsed.turnNumber
      boardState.value = parsed.boardState
      scores.value = parsed.scores
    }
  }

  function switchPlayers() {
    const playerX = { ...boardState.value[0] }

    const playerO = { ...boardState.value[1] }

    Object.assign(boardState.value[0] as object, {
      id: playerO.id,
      player: playerO.player,
      state: [],
    })

    Object.assign(boardState.value[1] as object, {
      id: playerX.id,
      player: playerX.player,
      state: [],
    })
  }

  function newGame() {
    gameState.value = 'start'
    turnNumber.value = 0
    winner.value = null

    switchPlayers()
  }

  const gameState = ref<'start' | 'midgame' | 'end'>('start')

  const turnNumber = ref<number>(0)

  const turn = computed(() => {
    return turnNumber.value % 2
  })

  watch(
    () => {
      return turnNumber.value
    },
    () => {
      saveLocalStorage()
    },
  )

  const winner = ref<{ sign: 'x' | 'o'; id: string; player: string; state: number[] } | null>(null)

  const boardState = ref<{ sign: 'x' | 'o'; id: string; player: string; state: number[] }[]>([
    { sign: 'x', id: 'P1', player: 'Player 1', state: [] },
    { sign: 'o', id: 'P2', player: 'Player 2', state: [] },
  ])

  const scores = ref<{
    left: { id: 'P1'; name: 'Player 1' | 'YOU'; score: number }
    tie: { id: 'tie'; name: 'TIES'; score: number }
    right: { id: 'P2'; name: 'Player 2' | 'CPU'; score: number }
  }>({
    left: { id: 'P1', name: 'Player 1', score: 0 },
    tie: { id: 'tie', name: 'TIES', score: 0 },
    right: { id: 'P2', name: 'Player 2', score: 0 },
  })

  function getSign(id: string) {
    const sign = boardState.value.filter((i) => i.id === id)[0]
    return sign ? sign.sign : ''
  }

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

      winner.value = playerStats

      let winnerScore = Object.values(scores.value).find((i) => i.id === playerStats.id)

      if (winnerScore) {
        winnerScore.score++
      }

      return
    }

    turnNumber.value++

    if (turnNumber.value === 9) {
      gameState.value = 'end'

      scores.value.tie.score++
      return
    }

    gameState.value = 'midgame'
    return
  }

  return {
    reset,
    newGame,
    switchPlayers,
    menuRestart,
    gameState,
    boardState,
    winner,
    turn,
    scores,
    getSign,
    changeBoardStatus,
    checkResult,
    saveLocalStorage,
    restoreState,
  }
})
