import calculations from './calculations'
import { store } from '../store'

export default {

    // inverse la gauche et la droite du domino
    swap: function(domino){
        console.log('UTILS SWAP!!!', domino)
        let t = domino.value[0]
        domino.value[0] = domino.value[1]
        domino.value[1] = t
        domino.swap = true
        console.log('UTILS SWAP', domino.value)
    },
    updateScores(array){
        return array.reduce((sum, a) => sum + a.value[0] + a.value[1], 0)
    },
    setScores(rest) {
        return rest.reduce((sum, a) => sum + a.value[0] + a.value[1], 0)
    },
    // pioche (illimitée, jusqu'à trouver le bon domino, ou à vider la réserve)
    drawAgain(player, stopDrawing, upto) {
      let endDrawing = stopDrawing
      // si lapioche est vide
      if (store.state.shuffledPieces.length === 0) {
          endDrawing = true
          let draw = false
          let upto = !upto
      }
      // si c'est le joueur humain qui pioche (bouton 'DRAW')
      if (player === 1) {
          let empty = true
          store.dispatch('drawOne', player)
          return store.state.hand
      }
      // si c'est la machine qui pioche
      if (player === 0) {
          if (endDrawing === true) {
              store.dispatch('noMoreChoice')
              return
          }
          if (endDrawing === false) {
              store.dispatch('drawOne', player)
              return store.state.machineHand
          }
      }
  },
  // empêche le choix par le joueur d'un domino inadéquat
  warningWrongDomino: function(domino, head, tail) {
    if(domino.value[0] !== head && domino.value[0] !== tail && domino.value[1] !== head && domino.value[1] !== tail) {
    console.log('WRONG DOMINO!')
    this.wrong = true
    if (store.state.shuffledPieces.length > 0) this.draw = true
    else this.stopDrawing = true
    }

},
    makeChoice(machineChoices, head, tail, empty){
      console.log('MACHINE CHOICES INSIDE MAKECHOICE', machineChoices, empty)
      // this.empty = quand le joueur ne dispose manifestement pas de certaines valeurs...
      // ne pas jouer sur ces valeurs est un moyen de bloquer le joueur
      if (this.empty === true){
          let lockChoices = calculations.lockPlayer(machineChoices, head, tail)
          console.log('LOCKCHOICES in MAKECHOICE', lockChoices)
          if (lockChoices.length < machineChoices.length) {
              for (let val of lockChoices){
                  for (let choice of machineChoices){
                      if (choice.value.includes(val)){
                          machineChoices.splice(machineChoices.indexOf(choice), 1)
                      }
                  }
              console.log('MACHINECHOICES AFTER LOCK FILTERING', machineChoices)
                  }
              }
          }
      // calcul du domino le plus élevé en points, dont il faut se débarrasser en premier
      let final = calculations.calculateBestChoice(machineChoices)

      let piece = store.state.machineHand.find(p => p.value[0] === final[0] && p.value[1] === final[1])
      console.log("PIECE TO PLAY", piece, head, tail)
      piece.player = false
      calculations.positionningTheChosenDomino(piece, head, tail)

      store.dispatch('addToBoard', piece)
      let machineScore = this.updateScores(store.state.machineHand)

  },
  // pioche (illimitée, jusqu'à trouver le bon domino, ou à vider la réserve)
  drawAgain(player, stopDrawing, upto) {
    // si lapioche est vide
    if (store.state.shuffledPieces.length === 0) {
        this.draw = false
        this.stopDrawing = true
        this.upto = !this.upto
    }
    // si c'est le joueur humain qui pioche (bouton 'DRAW')
    if (player === 1) {
        this.empty = true
        store.dispatch('drawOne', player)
        return store.state.hand
    }
    // si c'est la machine qui pioche
    if (player === 0) {
        if (stopDrawing === true) {
            store.dispatch('noMoreChoice')
            return
        }
        if (stopDrawing === false) {
            store.dispatch('drawOne', player)
            return store.state.machineHand
        }
    }
},

    //calculer le score final
    calculateScores(results){
        console.log('RESULTATS : QUI GAGNE ?', results)
        let playerTotal = this.setScores(results.player)
        let machineTotal = this.setScores(results.machine)
        console.log('PLAYER TOTAL', playerTotal, 'MACHINE TOTAL', machineTotal)
        if (results.neitherWins) {
            return playerTotal - machineTotal
        }
        if (results.playerWins) {
            return machineTotal
        }
        if (results.machineWins){
            return playerTotal
        }
    },
    saveResults(results, playerTotal, machineTotal){
        let winner = results.neitherWins ? 0 : results.playerWins ? 1 : 2
        let scores = Object.assign({}, { player: playerTotal, machine: machineTotal, winner: winner })
        console.log('RESULTS SAVED', scores)
    },
    // remettre le composant à zéro pour une nouvelle partie
    resetAll(){
      this.tour = 0
      this.start = true
      this.keepPlaying = true
      this.draw = false
      this.playerWins = false
      this.machineWins = false
      this.neitherWins = false
      this.empty = false
      this.newLock = []
      this.stopDrawing = false
      this.pass = false
      this.progression = false
  },
}
