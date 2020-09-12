import Vue from 'vue'
import Vuex from 'vuex'
import utils from '../services/utils.js'
import Domino from '../models/Domino'
import Player from '../models/Player'
import _ from 'lodash'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    start: true,
    dominoes: [],
    players: [],
    board: [],
    begin: [],
    left: [],
    top: [],
    right: [],
    bottom: [],
    player: {
      name: '',
      hand: [],
      wins: false,
      score: 0,
      rounds_won: 0,
      victories: 0
    },
  machine: {
      hand: [],
      wins: false,
      score: 0,
      rounds_won: 0,
      victories: 0
    },
  machineChoices: [],
  noChoice: false,
  lock: []
  },
  mutations: {
    INVERT_START(state){
      state.start = !state.start
      return state.start
    },
    // créer un jeu de 28 dominos et les disposer de manière aléatoire
    SET_STATE(state){
      let begin = 0
      let max = 7
      while ( begin < max ) {
        let end = begin
        while (end < max) {
          let domino = new Domino(begin, end)
          state.dominoes.push(domino)
          end ++
        }
        begin ++
      }
      state.dominoes = _.shuffle(state.dominoes)
      return state.dominoes
    },
    // ajouter un joueur non encore enregistré
    ADD_PLAYER(state, currentPlayer){
      state.player = Object.assign({}, currentPlayer)
      let newPlayer = state.players.find(p => p.name === currentPlayer.name)
      if (!newPlayer) {
        state.players.push(currentPlayer)
      }
    },
    // distribuer les dominos
    FULL_HAND(state){
      state.player.hand.push(state.dominoes[0])
      state.dominoes.shift()
      state.machine.hand.push(state.dominoes[0])
      state.dominoes.shift()
      console.log(state.machine.hand)
    },
    
    ADD_TO_BOARD(state, domino){
      console.log('STORE DOMINO ADD TO BOARD BEGINS', 'PIECE', domino, 'BOARD', state.board)
      if (!state.board.length) {
        //state.begin.push(domino)
        //state.board.push(domino)
        domino.left = true
      }
      else { 

          console.log('COMPARING for left True or False', 'domino', domino.value, 'board', state.board, 'head', state.board[0])
          if ( domino.value[0] === state.board[0].value[0] || domino.value[1] === state.board[0].value[0] ) domino.left = true
          else domino.left = false
  
          if (domino.left === true) {
            if (domino.value[1] !== state.board[0].value[0]) {
              console.log('DOMINO BEFORE SWAP L', domino.value)
                utils.swap(domino)
                console.log('SWAP LEFT!', domino.value)
            }

        }

      if (domino.left === false) {
          if (domino.value[0] !== state.board[state.board.length-1].value[1]){
            console.log('DOMINO BEFORE SWAP R', domino.value)  
            utils.swap(domino)
            console.log('SWAP RIGHT!', domino.value)
          }
          
      }
    }
      if (state.board.length > 9) {
        if (domino.left === true) {
          if (state.left.length < 3) {
            state.left.unshift(domino)
            state.board.unshift(domino)
          }
          else {
            state.top.push(domino)
            state.board.unshift(domino)
          }
        }
        else {
          if (state.right.length < 3) {
            state.right.push(domino)
            state.board.push(domino)
          }
          else {
            state.bottom.push(domino)
            state.board.push(domino)
          }
        }
      }
        
      else {
        if (domino.left){
          state.begin.unshift(domino)
          state.board.unshift(domino)
        }
        else {
          state.begin.push(domino)
          state.board.push(domino)
        }
      }
        
      if (domino.player === true) {
          let domoP = state.player.hand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
          let indexP = state.player.hand.indexOf(domoP)
          console.log('DOMO PLAYER SPLICED FOM HAND', domoP, indexP)
          state.player.hand.splice(indexP, 1)
      }
      else {
          let domoM = state.machine.hand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
          let indexM = state.machine.hand.indexOf(domoM)
          console.log('DOMO MACHINE SPLICED FROM HAND', domoM, indexM)
          state.machine.hand.splice(indexM, 1)
        }
    },
    NO_MORE_CHOICE(state){
      state.noChoice = true
    },
  
    ACTUALIZE_MACHINE_CHOICES(state, choicesNum){
      state.machineChoices = choicesNum
    },
    // piocher
    DRAW_ONE(state, player) {
      if (player === 1) state.player.hand.push(state.dominoes[0])
      if (player === 0) state.machine.hand.push(state.dominoes[0])
      state.dominoes.shift()
      console.log('STORE DRAWED!')
    },
    ADD_TO_LOCK(state, newLock) {
      state.lock.push(...newLock)
      let newSetLock = new Set(state.lock)
      state.lock = [ ...newSetLock ]
    },
    // enregistrer la progression du joueur ou de la machine
    UPDATE_SCORE(state, score){
      if (score.player === true){
        state.playerScore += score.score
      }
      else state.machineScore += score.score
    },
    // noter les "trous" dans le jeu du joueur humain
    ADD_TO_LOCK(state, newLock) {
        state.lock.push(...newLock)
        let newSetLock = new Set(state.lock)
        state.lock = [ ...newSetLock ]
    },
    SET_WINNER(state, winner){
      if (winner === 0) state.playerWins = true
      if (winner === 1) state.machineWins = true
      if (winner === 2) state.neitherWins = true
    },
    // tout remettre à zéro pour une nouvelle partie
    CLEAR_ALL(state){
      state.board = []
      state.player.hand = []
      state.machine.hand = []
      state.dominoes = []
      state.lock = []
      state.noChoice = false
      state.machineChoices = []
      state.start = true
      state.board = []
      state.begin = []
      state.left= []
      state.top = []
      state.right = []
      state.bottom = []
    
    },
  
    // sauvegarder le résultat de la partie
    SET_SCORES(state, scores){
        state.game.playerScore = scores.machineFinalScore
        state.game.machineScore = scores.playerFinalScore
        state.game.winner = scores.winner
        //return mutations.SAVE_TO_DB(state)

    },

  },
  actions: {
    invertStart({ commit }, state) {
      commit('INVERT_START', state)
    },
    setState({ commit }, state){
        commit('SET_STATE', state)
    },
    addPlayer({ commit }, currentPlayer){
      commit('ADD_PLAYER', currentPlayer)
    },
    fullHand({ commit }){
      commit('FULL_HAND')
    },
    addToBoard({ commit }, domino){
      commit ('ADD_TO_BOARD', domino)
    },
    noMoreChoice({ commit }){
      commit('NO_MORE_CHOICE')
    },
    actualizeMachineChoices({ commit }, choicesNum){
      commit('ACTUALIZE_MACHINE_CHOICES', choicesNum)
    },
    drawOne({ commit }, player){
      commit('DRAW_ONE', player)
    },
    addToLock( { commit }, newLock){
      commit('ADD_TO_LOCK', newLock)
    },
    updateScore({ commit }, score){
      commit('UPDATE_SCORE', score)
    },
    clearAll({ commit }){
        commit('CLEAR_ALL')
    },
    setScores({ commit }, scores){
        commit('SET_SCORES', scores)
    },
    setWinner({ commit }, winner){
      commit('SET_WINNER', winner)
    }
  },
  modules: {
  }
})

export default store


/*
const actions = {
    addPlayer({ commit }, currentPlayer){
      commit('ADD_PLAYER', currentPlayer)
    },
    shufflePieces({ commit }){
        commit('SHUFFLE_PIECES')
    },
    fullHand({ commit }){
        commit('FULL_HAND')
    },
    drawOne({ commit }, player){
        commit('DRAW_ONE', player)
    },
    noMoreChoice({ commit }){
        commit('NO_MORE_CHOICE')
    },
    actualizeMachineChoices({ commit }, choicesNum){
        commit('ACTUALIZE_MACHINE_CHOICES', choicesNum)
    },
    addToBoard({ commit }, domino){
        commit ('ADD_TO_BOARD', domino)
    },
    saveBoard({ commit }, newBoard) {
        /*let pieces = []
        for (let piece of newBoard){
            pieces.push(piece)
        }
        let pieces = newBoard.map(p => pieces.push(p))
        commit("SAVE_BOARD", pieces)
    },
    addToLock( { commit }, newLock){
      commit('ADD_TO_LOCK', newLock)
    },
    updateScore({ commit }, score){
      commit('UPDATE_SCORE', score)
    },
    clearAll({ commit }){
        commit('CLEAR_ALL')
    },
    setScores({ commit }, scores){
        commit('SET_SCORES', scores)
    },
    setWinner({ commit }, winner){
      commit('SET_WINNER', winner)
    }
}

const mutations = {
    // ajouter un joueur non encore enregistré
    ADD_PLAYER(state, currentPlayer){
      state.players.push(currentPlayer)
    },
    //mélanger les dominos
    SHUFFLE_PIECES(state){
      state.shuffledPieces =  _.shuffle(state.sortedPieces)
    },
    // distribuer les dominos
    FULL_HAND(state){
        state.hand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        state.machineHand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log(state.machineHand)
    },
    // piocher
    DRAW_ONE(state, player) {
        if (player === 1) state.hand.push(state.shuffledPieces[0])
        if (player === 0) state.machineHand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log('STORE DRAWED!')
    },
    NO_MORE_CHOICE(state){
        state.noChoice = true
    },
    
    // jouer un domino
    ADD_TO_BOARD(state, domino){
        console.log('STORE DOMINO', domino)
        if (domino.place === 'left') {
            if (domino.value[1] !== domino.head) {
                utils.swap(domino.value)
                console.log('SWAP LEFT!')
            }
            state.side = 'left'
            state.board.unshift(domino)
        } if (domino.place === 'right') {
            if (domino.value[0] !== domino.tail){
                utils.swap(domino.value)
                console.log('SWAP RIGHT!')
            }
            state.side = 'right'
            state.board.push(domino)
        }
        if (domino.player === true) {
            let domo = state.hand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
            let index = state.hand.indexOf(domo)
            console.log('DOMO', domo, index)
            state.hand.splice(index, 1)
        }
        else {
            let domoM = state.machineHand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
            let indexM = state.machineHand.indexOf(domoM)
            console.log('DOMO MACHINE', domoM, indexM)
            state.machineHand.splice(indexM, 1)
        }
    },
    // enregistrer les ajouts au board faits par drag and drop
    SAVE_BOARD(state, pieces) {
        state.board = [ ...pieces ]
    },
    // enregistrer la progression du joueur ou de la machine
    UPDATE_SCORE(state, score){
      if (score.player === true){
        state.playerScore += score.score
      }
      else state.machineScore += score.score
    },
    // noter les "trous" dans le jeu du joueur humain
    ADD_TO_LOCK(state, newLock) {
        state.lock.push(...newLock)
        let newSetLock = new Set(state.lock)
        state.lock = [ ...newSetLock ]
    },
    SET_WINNER(state, winner){
      if (winner === 0) state.playerWins = true
      if (winner === 1) state.machineWins = true
      if (winner === 2) state.neitherWins = true
    },
    
    // sauvegarder le résultat de la partie
    SET_SCORES(state, scores){
        state.game.playerScore = scores.machineFinalScore
        state.game.machineScore = scores.playerFinalScore
        state.game.winner = scores.winner
        return mutations.SAVE_TO_DB(state)

    },

*/
