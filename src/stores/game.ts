import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const winners = [123, 159, 147, 258, 357, 369, 456, 789]

export const useGameStore = defineStore('game', () => {
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
      left: { id: 'P1', player: 'Player 1', score: 0, sign: 'x' },
      tie: { id: 'tie', player: 'TIES', score: 0 },
      right: { id: 'P2', player: 'Player 2', score: 0, sign: 'o' },
    }
  }

  function saveLocalStorage(path: 'multiplayer' | 'cpu') {
    const saveStates = { multiplayer: 'savedMulti', cpu: 'savedCpu' }

    const saveState: string = saveStates[path]

    const states = {
      gameState: gameState.value,
      turnNumber: turnNumber.value,
      boardState: boardState.value,
      scores: scores.value,
    }

    localStorage.setItem(saveState, JSON.stringify(states))
  }

  function restoreState(path: 'multiplayer' | 'cpu') {
    const saveStates = { multiplayer: 'savedMulti', cpu: 'savedCpu' }

    const saveState: string = saveStates[path]

    const savedData = localStorage.getItem(saveState)

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

    const leftSign = boardState.value.find((i) => {
      return i.id === 'P1' || i.id === 'YOU'
    })

    const rightSign = boardState.value.find((i) => {
      return i.id === 'P2' || i.id === 'CPU'
    })

    if (leftSign && rightSign) {
      Object.assign(scores.value.left as object, {
        sign: leftSign.sign,
      })

      Object.assign(scores.value.right as object, {
        sign: rightSign.sign,
      })
    }
  }

  function switchPlayer2Type(type: 'p2' | 'cpu') {
    const object = {
      p2: { player: 'Player 2', id: 'P2', p1: { player: 'Player 1', id: 'P1' } },
      cpu: { player: 'CPU', id: 'CPU', p1: { player: 'YOU', id: 'YOU' } },
    }

    const boardOne = boardState.value.find((i) => {
      return i.id === 'P1' || i.id === 'YOU'
    })

    const boardTwo = boardState.value.find((i) => {
      return i.id === 'P2' || i.id === 'CPU'
    })

    Object.assign(boardOne as object, { id: object[type].p1.id, player: object[type].p1.player })

    Object.assign(boardTwo as object, { id: object[type].id, player: object[type].player })

    Object.assign(scores.value.left as object, {
      id: object[type].p1.id,
      player: object[type].p1.player,
    })

    Object.assign(scores.value.right as object, {
      id: object[type].id,
      player: object[type].player,
    })
  }

  function newGame() {
    switchPlayers()

    gameState.value = 'start'
    turnNumber.value = 0
    winner.value = null
  }

  const gameState = ref<'start' | 'midgame' | 'end'>('start')

  const turnNumber = ref<number>(0)

  const turn = computed(() => {
    return turnNumber.value % 2
  })

  const winner = ref<{ sign: 'x' | 'o'; id: string; player: string; state: number[] } | null>(null)

  const boardState = ref<{ sign: 'x' | 'o'; id: string; player: string; state: number[] }[]>([
    { sign: 'x', id: 'P1', player: 'Player 1', state: [] },
    { sign: 'o', id: 'P2', player: 'Player 2', state: [] },
  ])

  const scores = ref<{
    left: { id: 'P1' | 'YOU'; player: 'Player 1' | 'YOU'; score: number; sign: 'x' | 'o' }
    tie: { id: 'tie'; player: 'TIES'; score: number }
    right: { id: 'P2' | 'CPU'; player: 'Player 2' | 'CPU'; score: number; sign: 'x' | 'o' }
  }>({
    left: { id: 'P1', player: 'Player 1', score: 0, sign: 'x' },
    tie: { id: 'tie', player: 'TIES', score: 0 },
    right: { id: 'P2', player: 'Player 2', score: 0, sign: 'o' },
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
      setTimeout(() => {
        gameState.value = 'end'
      }, 1000)

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
    turnNumber,
    scores,
    getSign,
    changeBoardStatus,
    checkResult,
    saveLocalStorage,
    restoreState,
    switchPlayer2Type,
  }
})

export const useCpuStore = defineStore('cpu', () => {
  const game = useGameStore()

  function play(moves: number[]) {
    let final: number[] = []

    for (let i = 0; i < moves.length; i++) {
      if (
        ![
          ...(you.value?.state as Array<number>),
          ...(cpuPlayer.value?.state as Array<number>),
        ].includes(moves[i] as number, 0)
      ) {
        final.push(moves[i] as number)
      }
    }

    game.changeBoardStatus(final[0] as number)
  }

  const you = computed(() => {
    return game.boardState.find((i) => {
      return i.id === 'YOU'
    })
  })

  const cpuPlayer = computed(() => {
    return game.boardState.find((i) => {
      return i.id === 'CPU'
    })
  })

  function turnOne() {
    // console.log('1 :' + (game.turnNumber === 0 ? 'correct turn' : 'not turn'))
    // console.log('1 :' + cpuPlayer.value.sign)
    // console.log('1 :' + (cpuPlayer.value.sign === 'x' ? 'correct sign' : 'wrong sign'))

    // Always pick center
    if (game.turnNumber === 0 && cpuPlayer.value && cpuPlayer.value.sign === 'x') {
      play([5])
    }
  }
  
  function turnTwo() {
    // console.log('2 :' + (game.turnNumber === 1 ? 'correct turn' : 'not turn'))
    // console.log('2 :' + cpuPlayer.value.sign)
    // console.log('2 :' + (cpuPlayer.value.sign === 'o' ? 'correct sign' : 'wrong sign'))
    if (game.turnNumber === 1 && cpuPlayer.value && cpuPlayer.value.sign === 'o') {
      const move = you.value!.state[0]

      // upper left is a throwaway move for when center is not available
      if (move && move === 5) {
        play([1])
      } else {
        // Pick center if available
        play([5])
      }
    }
  }

  function turnThree() {
    // console.log('3 :' + (game.turnNumber === 2 ? 'correct turn' : 'not turn'))
    // console.log('3 :' + cpuPlayer.value.sign)
    // console.log('3 :' + (cpuPlayer.value.sign === 'x' ? 'correct sign' : 'wrong sign'))

    if (game.turnNumber === 2 && cpuPlayer.value && cpuPlayer.value.sign === 'x') {
      const move = you.value!.state[0] as number

      // Always pick across the player's move
      play([10 - move])
    }
  }

  function filterInclude(winners: number[], moves: number[]) {
    let combinations = winners

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]

      combinations = combinations.filter((i) => {
        return i.toString().includes(move!.toString(), 0)
      })
    }

    return combinations
  }

  function filterExclude(winners: number[], moves: number[]) {
    let combinations = winners

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]

      combinations = combinations.filter((item) => {
        return !item.toString().includes(move!.toString(), 0)
      })
    }

    return combinations
  }

  function replaceMultiple(toEdit: number, moves: number[]) {
    let result = toEdit

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i] as number

      result = Number(result.toString().replaceAll(move.toString(), ''))
    }

    return Number(result)
  }

  function turnFour() {
    // console.log('4 :' + (game.turnNumber === 3 ? 'correct turn' : 'not turn'))
    // console.log('4 :' + cpuPlayer.value.sign)
    // console.log('4 :' + (cpuPlayer.value.sign === 'o' ? 'correct sign' : 'wrong sign'))
    if (game.turnNumber === 3 && cpuPlayer.value && cpuPlayer.value.sign === 'o') {
      const winningNumber = filterExclude(
        filterInclude(winners, you.value!.state),
        cpuPlayer.value.state,
      )

      // If player is winning, block the winning move
      if (winningNumber.length > 0) {
        play([replaceMultiple(Number(winningNumber.join('')), you.value!.state)])
      } else if (
        // player did not play center and play diagonal corners,
        // will always move to bottom or left
        you.value!.state.reduce((a, b) => a + b) === 10 &&
        (you.value!.state[0] as number) % 2 === 0
      ) {
        play([Math.abs(you.value!.state.reduce((a, b) => a - b) as number)])
      } else if (
        // player played horizontal sides
        // always play 2
        you.value!.state.reduce((a, b) => a + b) === 10 &&
        (you.value!.state[0] as number) % 2 === 1
      ) {
        play([2])
      } else if (you.value!.state.reduce((a, b) => a + b) % 2 === 1) {
        // player played vertical sides
        play([10 - (you.value!.state.find((i) => i % 2 === 1) as number)])
      } else if (you.value!.state.includes(9, 0) && you.value!.state.includes(5, 0)) {
        play([3])
      } else if (you.value!.state.reduce((a, b) => a + b) % 2 === 0) {
        // player played two adjacent sides
        const hasFour = you.value!.state.find((i) => i === 4) ? -1 : 1
        const hasTwo = you.value!.state.find((i) => i === 2 || i === 8)
        play([hasTwo! + hasFour])
      }
    }
  }

  function turnFive() {
    // console.log('5 :' + (game.turnNumber === 4 ? 'correct turn' : 'not turn'))
    // console.log('5 :' + cpuPlayer.value.sign)
    // console.log('5 :' + (cpuPlayer.value.sign === 'x' ? 'correct sign' : 'wrong sign'))
    if (game.turnNumber === 4 && cpuPlayer.value && cpuPlayer.value.sign === 'x') {
      const winningNumber = filterExclude(
        filterInclude(winners, you.value!.state),
        cpuPlayer.value.state,
      )

      const notFive = cpuPlayer.value!.state.find((i) => i !== 5)
      const playerMove = you.value?.state.find((i) => i % 2 === 0)
      const playerMoveOdd = you.value?.state.find((i) => i % 2 === 1)

      // find any player winning move and block it
      if (winningNumber.length > 0) {
        play([replaceMultiple(Number(winningNumber.join('')), you.value!.state)])
      } else if ((notFive as number) % 2 === 1) {
        // if second move is in the corner,
        // find the double
        play([5 + notFive! - playerMove!])
      } else if (
        ((playerMoveOdd as number) % 2 === 0 || !playerMoveOdd) &&
        (notFive as number) % 2 === 0
      ) {
        // the player is also has the side and  cpu is on the side
        // choose the far corner
        play([notFive! % 3 === 2 ? notFive! - 1 : notFive! - 3])
      } else {
        if (playerMoveOdd) {
          // the player is also has the side and  cpu is on the side diagonal
          // pick the diagonal opposite

          play([10 - playerMoveOdd])
        }
      }
    }
  }

  function allPossible(moves: number[]) {
    let combinations: number[] = []
    for (let i = 0; i < moves.length; i++) {
      const filter = winners.filter((item) => {
        return item.toString().includes(moves[i]!.toString(), 0)
      })
      filter.forEach((i) => {
        combinations.push(i)
      })
    }

    combinations = combinations.filter((combination, index) => {
      return combinations.indexOf(combination) === index
    })

    return combinations
  }

  function winningMove(possible: number[], moves: number[]) {
    return possible.filter((combination) => {
      let connected = 0

      for (let i = 0; i < moves.length; i++) {
        if (combination.toString().includes(moves[i]!.toString(), 0)) {
          connected++
        }
      }

      return connected == 2
    })
  }

  function turnSixBeyond() {
    // console.log('6 :' + (game.turnNumber === 5 ? 'correct turn' : 'not turn'))
    // console.log('6 :' + cpuPlayer.value.sign)
    // console.log('6 :' + (cpuPlayer.value.sign === 'o' ? 'correct sign' : 'wrong sign'))

    if (game.turnNumber >= 5 && game.turnNumber < 9 && game.boardState[game.turn]?.id === 'CPU') {
      const viableNumbers = allPossible(cpuPlayer.value!.state)

      const winner = winningMove(viableNumbers, cpuPlayer.value.state)

      const loser = winningMove(allPossible(you.value!.state), you.value!.state)

      const needBlocking = filterExclude(loser, cpuPlayer.value.state)

      let winningNumber = winner
        .map((item) => {
          const number = replaceMultiple(item, cpuPlayer.value.state)

          if (you.value?.state.includes(number, 0)) {
            return
          } else {
            return number
          }
        })
        .filter((i) => i)

      if (winningNumber.length !== 0) {
        play(winningNumber)
      } else if (needBlocking.length > 0) {
        play([replaceMultiple(needBlocking[0] as number, you.value!.state)])
      } else {
        let unplayed = []

        for (let i = 1; i <= 9; i++) {
          if (
            ![
              ...(cpuPlayer.value?.state as Array<number>),
              ...(you.value?.state as Array<number>),
            ].includes(i, 0)
          ) {
            unplayed.push(i)
          }
        }
        play(unplayed)
      }
    }
  }

  function move() {
    turnOne()
    turnTwo()
    turnThree()
    turnFour()
    turnFive()
    turnSixBeyond()
  }

  return { move }
})
