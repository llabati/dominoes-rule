import store from '../store'
import utils from './utils'
import calculations from './calculations'
import _ from 'lodash'


export default {
  //distribue 6 dominos à chaque joueur (joueur et machine)
  startGame(){
    console.log(store.state)
    if (store.state.board.length > 0) {
      store.dispatch('clearAll')
      //utils.resetAll()
    }
    //store.dispatch('setState')
    let click = 0
    while (click < 6){
      store.dispatch('fullHand')
      click++
    }
    console.log('TWO HANDS REFUELED')
  //return store.state.player.hand
  return store.state.player.hand
  }, 

  // Qui commence ?
        // La règle est que celui qui a le double 6, ou le double 5, ou le double 4... commence la première partie.
        // Sans doubles, celui qui a le domino à la valeur la plus élevée.
        // Pour les parties suivantes, c'est le gagnant de la partie précédente qui commence.

  whoStarts(player, machine, tour){
    console.log('WHO ?', player, tour)
    let starter
    if (tour === 0) {
      console.log('MACHINE HAND', machine.hand)
        let machineMax = 0

  // y a t il des doubles => filtrer le tableau et prendre le double le plus haut
  //si pas de double, prendre le "total" le plus élevé


          for (let dom of machine.hand) {
              dom.total = dom.value[0] + dom.value[1]
              dom.double = dom.value[0] == dom.value[1] ? true : false
          }
          let doublesM = machine.hand.filter(d => d.double)
          doublesM.sort( (a,b) => b.total - a.total)
          let machineFirst = doublesM.length ? doublesM[0] : machine.hand.sort ( (a,b) => b.total - a.total)[0]
          machine.start = machineFirst
          console.log('TOP MACHINE', machineFirst)
          console.log('PLAYER HAND', player.hand)
          for (let dom of player.hand) {
              dom.total = dom.value[0] + dom.value[1]
              dom.double = dom.value[0] == dom.value[1] ? true : false
          }
          let doublesP = player.hand.filter(d => d.double)
          doublesP.sort( (a,b) => b.total - a.total)
          let playerFirst = doublesP.length ? doublesP[0] : player.hand.sort ( (a,b) => b.total - a.total)[0]
          console.log('TOP PLAYER', playerFirst)
          player.start = playerFirst
          if (doublesM.length && doublesP.length) {
              starter = machineFirst.value[0] + machineFirst.value[1] > playerFirst.value[0] + playerFirst.value[1] ? machine : player
              if (starter === machine) {
                machine.isStarting = true
              }
              else {
                player.isStarting = true
              }
              console.log('WHO STARTS', starter)
          }
          if (doublesM.length && !doublesP.length) {
              starter = machine
              machine.isStarting = true
              console.log('WHO STARTS', starter)
          }
          if (!doublesM.length && doublesP.length) {
              starter = player
              player.isStarting = true
              console.log('WHO STARTS', starter)
              }
          if (!doublesM.length && !doublesP.length) {
              starter = machineFirst.value[0] + machineFirst.value[1] > playerFirst.value[0] + playerFirst.value[1] ? machine : player
              if (starter === machine) {
                machine.isStarting = true
              }
              else {
                player.isStarting = true
              }
              console.log('WHO STARTS', starter)
          }
              } else {
              if (player.wins) {
                starter = player
              }
              else {
                starter = machine
              }
          }
          console.log('STARTER IS ', starter)
          return starter
      },

  playersTurn(domino, board, tour, wrong, upto){
    console.log('CHOSEN DOMINO AND SIDE', domino.value, board.head, board.tail)
      let stop = false
      let pickup = false

        domino.player = true
        // démarrage du jeu, premier domino posé
        if(tour === 1) {
            //let head = domino.value[0]
            //let tail = domino.value[1]
            //domino.place = side
            console.log('HEAD AND TAIL FIRST TOUR', board.head, board.tail)
        }
        // en cours de partie
        if (tour > 1) {
            //let head = calculations.calculateHead()
            //let tail = calculations.calculateTail()
            console.log('HEAD AND TAIL PLAYER', domino, board.head, board.tail)

            // c'est au tour du joueur : vérification qu'il a bien des dominos à jouer, sinon afficher le bouton PIOCHEZ ou le bouton PASSEZ
            let playerChoices = calculations.evaluatePlayerChoices(board)
            console.log('PLAYER CHOICES', playerChoices)

            if (playerChoices.length === 0) {
                  if (store.state.shuffledPieces.length === 0) {
                    stop = true
                      }
                  else {
                    pickup = true
                  }
                }
            else pickup = false


            // vérification que le domino choisi est bon
            utils.warningWrongDomino(domino, head, tail)
            if (wrong === true) return
            else {
                // lorsqu'on a un domino qui peut être placé à gauche ou à droite
                //if ((domino.prev === tail && domino.next === head) || (domino.prev === head && domino.next === tail)) {
                /*if ((domino.value[0] === tail && domino.value[1] === head) || (domino.value[0] === head && domino.value[1] === tail)) {
                    domino.place = side
                    if (domino.place === "left") {
                    domino.tail = undefined
                    domino.head = head
                    } else {
                    domino.head = undefined
                    domino.tail = tail
                    }
                }
                else {*/
                    calculations.positionningTheChosenDomino(domino, head, tail)
                }
            }


            console.log('MON DOMINO', domino)
            store.dispatch('addToBoard', domino)
            let score = { score: utils.updateScores(store.state.hand), player: true }
            store.dispatch('updateScore', score)

            tour = ++tour
            upto = !upto
            console.log('PICKUP FROM PROG', pickup)
            return { stop, pickup, tour, upto }
  },
  
  machinesTurn(keepPlaying, stopDrawing, upto){
    if (keepPlaying === true) {
      let head = calculations.calculateHead()
      let tail = calculations.calculateTail()


        if (store.state.board.length > 0){
            // détermination des choix possibles pour la machine
            let choices = []

            console.log('HEAD AND TAIL', head, tail)

            let one = store.state.machineHand.filter(d => d.value[0] === head)
            if (one) choices.push(one)

            let two = store.state.machineHand.filter(d => d.value[1] === head)
            if (two) choices.push(two)

            let three = store.state.machineHand.filter(d => d.value[0] === tail)
            if (three) choices.push(three)

            let four = store.state.machineHand.filter(d => d.value[1] === tail)
            if (four) choices.push(four)

            let allChoices = _.flatten(choices)
            allChoices = new Set(allChoices)
            let machineChoices = [ ...allChoices ]
            let choicesNum = machineChoices.length
            console.log('MACHINECHOICES', machineChoices)
            store.dispatch('actualizeMachineChoices', choicesNum)
            console.log('AFTER ACTUALIZE')

            // selon les résultats... pas de choix, un seul choix, plusieurs choix possibles
            // pas de domino à placer : la machine pioche...
            if (machineChoices.length === 0) {
                if (store.state.noChoice === true){
                  console.log('KEEP_PLAYING_FALSE')
                    keepPlaying = false

                } else {
                  console.log('CONTINUE_DRAWING_TRUE')
                  let continueDrawing = true
                  while (continueDrawing && store.state.shuffledPieces.length > 0) {
                    utils.drawAgain(0, stopDrawing, upto)

                    let one = store.state.machineHand[store.state.machineHand.length-1]
                    if (one.value[0] === head || one.value[1] === head || one.value[0] === tail || one.value[1] === tail){
                    one.player = false
                    machineChoices.push(one)
                    continueDrawing = false

                    console.log('MACHINECHOICES AFTER DRAWING', machineChoices)
                    }
                    else utils.drawAgain(0)
                  }
                }
            }
            //la machine a un ou plusieurs dominos possibles : comment choisir le meilleur ?
            if (machineChoices.length > 0) return utils.makeChoice(machineChoices, head, tail)
            return { stop, pickup, tour, upto }
      }
    }
  },
  claimVictory(){
    console.log('CLAIM VICTORY!')
    let results = { neitherWins: store.state.neitherWins, playerWins: store.state.playerWins, machineWins: store.state.machineWins, player: store.state.hand, machine: store.state.machineHand }
            let finalTotal = utils.calculateScores(results)
            let playerFinalScore = store.state.playerScore
            let machineFinalScore = store.state.machineScore
            let scores = Object.assign({}, { playerFinalScore, machineFinalScore })
            store.dispatch('setScores', scores)
            console.log('RESULT', this.resultMessage)
            this.progression = true
            if (store.state.neitherWins) {
                if (finalTotal > 0) this.resultMessage = 'Vous êtes bloqués tous les deux, mais la machine gagne avec ' + finalTotal + " points."
                if (finalTotal < 0) this.resultMessage = 'Vous êtes bloqués tous les deux, mais vous, '+ this.name + ', gagnez avec ' + Math.abs(finalTotal) + " points."
                if (finalTotal === 0) this.resultMessage = 'La partie se termine sur un blocage.'
            }
            if (store.state.playerWins) this.resultMessage = "Bravo "+ this.name + ", vous avez gagné avec " + finalTotal + " points !"
            if (store.state.machineWins) this.resultMessage = "C'est la machine qui gagne avec "+ finalTotal + " points !"
            console.log('RESULT_MESSAGE', this.resultMessage)
  }
}


