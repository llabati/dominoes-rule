/* eslint-disable */
<template lang="pug">

    .hand-board
        
        .hor.hand#player-hand
            ul.flex-list
                li(v-for="piece in playerHand" :key="piece.id")
                    domino.domino-vert.active-domino(:value='piece.value' @chosenLeft="chooseDomino(piece, 'left')" @chosenRight="chooseDomino(piece, 'right')")

        select(v-if='chooseSide' :message='message' v-on:chosenSide='chooseDomino(side)')
        
        //div(v-if='progression')
            p(style="color: white; font-size: 24px;")
                strong {{ victoryMessage }}
        
        alert(v-if='alert' :message="message") 

        //prompt(v-if='prompt' :message='message')

        div(v-if='display')
            transition(name='fade' mode='in-out')
                button.intro(v-if='start' ref='start' @click='letsPlay') 
                    strong {{ name }}, lancez le jeu
                button.intro(v-if='draw' style='background-color: brown;' ref='draw' @click='drawAgain(1)') 
                    strong Piochez
                button.intro(v-if='stopDrawing' style='background-color: yellow; color: black;' ref='pass' @click='upto=!upto') 
                    strong Passez
            


</template>

<script>
/* eslint-disable */
import { store } from '../store/index'
import Player from '../models/Player'
import Domino from './Domino.vue'
import Board from '../models/Board'
import ProgressionCircle from './ProgressionCircle.vue'
import progression from '../services/progression.js'
import utils from '../services/utils.js'
import calculations from '../services/calculations.js'
import Select from './Select.vue'
import Alert from './Alert.vue';
//import display from '../services/display.js'

export default {
    props: {
        name: String,
        //launch: Boolean,
        display: Boolean
    },
    store,
    components: {
        Domino,
        ProgressionCircle,
        Select,
        Alert
    },
    data(){
        return {
            /*message: `Cliquez sur le domino de votre choix; il se placera automatiquement sur le tapis.
              Si vous avez le choix entre le placer à gauche ou à droite, un clic simple l'envoie à gauche,
              un double clic l'envoie à droite.`,*/
            message: '',
            alert: false,
            upto: false,
            tour: 0,
            chooseSide:false,
            keepPlaying: true,
            playerChoices: [],
            draw: false,
            possibleLocks: [],
            playerStarts: false,
            machineStarts: false,
            
            neitherWins: false,
            playerWins: false,
            machineWins: false,
            empty: false,
            newLock: [],
            stopDrawing: false,
            pass: false,
            double: false,
            wrong: false,
            progression: false,
            

        }
    },
    watch: {
       /* launch(){
            if (this.launch) {
                this.resetAll()
                this.launch = false
            }
        },*/
        upto(){
            var self = this
            setTimeout(() => { self.machinePlays() }, 1500)
            
        },
        playerStarts(){
            if (this.playerStarts){
                console.log('PLAYER STARTS IS ON!')
                return this.playerPlays(this.player.start, 'left')
            } 
        },
        machineStarts(){
            if (this.machineStarts) {
                console.log('MACHINE STARTS IS ON!')
                return this.machinePlays(this.machine.start)
            }
        },
        // mauvais domino joué
        wrong(){
          if (this.wrong) {
              this.message = this.name + ', vous ne pouvez pas jouer ce domino ! Peut-être devez-vous piocher...'
              this.alert = true
          }
          if (this.wrong === false) {
              this.alert = false
              this.message = `Cliquez sur le domino de votre choix; il se placera automatiquement sur le tapis.
              Si vous avez le choix entre le placer à gauche ou à droite, un clic l'envoie à gauche, un double clic l'envoie à droite.`
          }
        },
        // le joueur peut-il encore jouer ?
        playerChoices(){
            console.log('PLAYER, PLAYER!', this.playerChoices)
            if (this.playerChoices.length === 0) {
                  if (this.$store.state.dominoes.length === 0) {
                    console.log('PLAYER, PLAYER, NO LONGER DOMINOES TO DRAW!', this.$store.state.dominoes.length)
                      this.stopDrawing = true
                      this.draw = false
                      }
                  else this.draw = true
                }
            else this.draw = false
        },
        // dominos restants
        restPieces(){
            if (this.restPieces < 1){
                this.draw = false
                this.stopDrawing = true
                if (this.$store.state.machineChoices < 1 && this.playerChoices.length < 1) {
                    this.keepPlaying = false
                    this.neitherWins = true
                    //this.claimVictory()
                    this.start = true
                    console.log('KEEPPLAYING RESTPIECES', this.keepPlaying)
                    
                }
            }
        },
        // main du joueur
        playerHandLength(){
            if (this.playerHandLength < 1) {
                this.keepPlaying = false
                this.playerWins = true
                //this.claimVictory()
                this.start = true
                this.draw = false
                console.log('KEEPPLAYING PLAYERHANDLENGTH', this.keepPlaying)
            }
        },
        
        // main de la machine
        machineHandLength(){
            if (this.machineHandLength < 1) {
                this.keepPlaying = false
                this.machineWins = true
                //this.claimVictory()
                this.start = true
                this.draw = false
                console.log('KEEPPLAYING MACHINEHANDLENGTH', this.keepPlaying)
            }
        },
        // quand le joueur est coincé... mémorise les valeurs qu'il n'a pas dans son jeu
        empty(){
            if (this.empty === true){
                let lastRight = this.$store.state.board.length - 1
                this.newLock.push(this.$store.state.board[0].value[0])
                this.newLock.push(this.$store.state.board[lastRight].value[1])
                console.log('COINCE AVEC...', this.newLock)
                this.$store.dispatch('addToLock', this.newLock)
            }
        },
        // quand on arrive à une situation bloquée
        pass(){
            if (this.$store.state.machineChoices.length < 1 && this.playerChoices.length < 1) {
                this.keepPlaying = false
                this.neitherWins = true
                //this.claimVictory()
                this.start = true
                this.draw = false
                console.log('KEEPPLAYING PASS', this.keepPlaying)
            }
            this.upto = !this.upto
        },
        playerWins(){
          if (this.playerWins === true) {
            this.claimVictory()
          }
        },
        machineWins(){
          if (this.machineWins === true){
            this.claimVictory()
          }
        },
        neitherWins(){
          if (this.neitherWins === true){
            this.claimVictory()
          }
        }
    },
    /*watch: {

        tour(){
          if (this.tour === 0){
            return this.letsPlay()
          }
          else {
            return calculations.evaluatePlayerChoices()
          }
        },

        


        */
    computed: {
      
      start(){
          return this.$store.state.start
      },
      player(){
        console.log('PLAYER IS... ', this.$store.state.player)
        return this.$store.state.player
      },
      playerHand(){
          console.log('HAND OF THE PLAYER', this.$store.state.player.hand)
          return this.$store.state.player.hand
      },
      playerHandLength(){
          return this.$store.state.player.hand.length
      },
      machine(){
        return this.$store.state.machine
      },
      machineHand(){
          return this.$store.state.machine.hand
      },
      machineHandLength(){
          return this.$store.state.machine.hand.length
      },
      head(){
          return this.$store.state.board[0].value[0]
      },
      tail(){
          return this.$store.state.board[this.$store.state.board.length-1].value[1]
      },
      restPieces(){
          return this.$store.state.dominoes.length
      },
      winner(){
        return this.$store.state.game.winner
      },
      resultMessage(){
        return this.$store.state.game.resultMessage
      }
    },


    methods: {
        async letsPlay(){
            if (this.tour === 0) {
                console.log('START', this.start, 'STORE START', this.$store.state.start)
                //await this.$store.dispatch('invertStart')
                await progression.startGame()
                //this.start = false
                let starter = progression.whoStarts(this.player, this.machine, this.tour)
                this.tour = 1
                console.log('THE PLAYERS', this.player, this.machine, this.tour, 'START', this.start)
                if (starter.name) {
                    console.log(this.tour, 'C EST LE JOUEUR QUI COMMENCE', this.player)
                    this.playerStarts = true
                    this.message = `C'est vous qui commencez ! L'application vient de jouer pour vous, mais ensuite, pour jouer vous devrez cliquer sur le domino de votre choix; il se placera automatiquement sur le tapis.
              Si vous avez le choix entre le placer à gauche ou à droite, un clic simple l'envoie à gauche, un double clic l'envoie à droite.`
                    this.alert = true
                    }
                else {
                    console.log(this.tour, 'C EST LA MACHINE QUI COMMENCE', this.machine)
                    this.machineStarts = true
                    this.message = `C'est la machine qui commence ! Pour jouer, cliquez sur le domino de votre choix; il se placera automatiquement sur le tapis.
              Si vous avez le choix entre le placer à gauche ou à droite, un clic simple l'envoie à gauche, un double clic l'envoie à droite.`
                    this.alert = true
                }
            }
            if (this.tour === 1) {
                console.log('START 1', this.start, 'STORE START 1', this.$store.state.start)
                let name = this.$store.state.player.name
                await this.$store.dispatch('invertStart')
                //await progression.startGame()
                let response = this.getFromDatabase(name)
                let machine_recent_winning = response.machine_recent_winning 
                let player_recent_winning = response.player_recent_winning


                // afficher ici les résultats et la progression et le cumul des manches avec response.player_score et response.machine.score
                //console.log('OU EN SOMMES NOUS ?', 'JOUEUR: ', response.player_score, 'MACHINE: ', response.machine_score)
                //this.start = false
                
                if (machine_recent_winning) {
                    this.message = `C'est à la machine de commencer !`
                    this.alert = true
                    this.machinePlays()
                }
                if (player_recent_winning) {
                    this.message = "C'est à vous de commencer !"
                    console.log('C EST A VOUS !')
                    this.alert = true
                }
                
            }
            if (this.tour > 1) {
                console.log('START N', this.start, 'STORE START N', this.$store.state.start)
                
                
            }
        },
        
      /////////////////////////////////////////////////////////
      playerPlays(domino){
        if (this.tour === 1 && this.player.isStarting === true){
            console.log(`Player is starting with ${this.player.start.value[0]} ${this.player.start.value[1]}`)
            this.message = "C'est vous qui commencez ! L'application vient de jouer pour vous..."
            this.alert = true
            //let allPieces = [ ...document.querySelectorAll('#player-hand img')].map( img => img.addEventListener('click', this.chooseDomino(img, 'left')))
            domino.player = true
            this.$store.dispatch('addToBoard', this.player.start, 'tour', this.tour)
            console.log('DOMINO!!!', domino)
            
        } else {
            console.log('AVANT PLAYERTURN', domino, this.head, this.tail, this.tour, this.wrong, this.upto)
            domino.player = true
            let playerTurn = progression.playersTurn(domino, this.head, this.tail, this.tour, this.wrong, this.upto)
            console.log('AFTER PROG', playerTurn)
            if (playerTurn.stop) {
              this.stopDrawing = true
              this.draw = false
            }
            if (playerTurn.pickup) {
              this.draw = true
            }

        }
        //this.alert = false
        this.tour = ++this.tour
        this.upto = !this.upto
        this.keepPlaying = true
      },

      /////////////////////////////////////////////////////////
      // c'est le joueur qui joue
        chooseDomino(domino, side){
            console.log('CHOOSE THIS DOMINO', domino, 'SIDE...', side)
            domino.player = true
            if (this.wrong) this.wrong = false
            //this.playerChoices = calculations.evaluatePlayerChoices()
            //console.log('PLAYER CHOICES', this.playerChoices)
            // démarrage du jeu, premier domino posé par le joueur
            /*if(this.tour === 0) {
                let head = domino.value[0]
                let tail = domino.value[1]
                domino.place = side
                console.log('HEAD AND TAIL FIRST TOUR', head, tail, domino.place)
            }*/
            // en cours de partie
            if (this.tour >= 1) {
                //this.board.head = calculations.calculateHead()
                //this.board.tail = calculations.calculateTail()
                //let head = this.calculateHead()
                //let tail = this.calculateTail()
                console.log('HEAD AND TAIL PLAYER', domino, this.head, this.tail)
                this.playerChoices = calculations.evaluatePlayerChoices()
                console.log('PLAYER CHOICES', this.playerChoices)
                if (!this.playerChoices.length) this.draw = true

                if (side === 'left') domino.left = true
                else domino.left = false

                // vérification que le domino choisi est bon
                this.warningWrongDomino(domino, this.head, this.tail)
                if (this.wrong === true) return
                /*else{
                    // lorsqu'on a un domino qui peut être placé à gauche ou à droite*/
                if ((domino.value[0] === this.head && domino.value[1] === this.tail) || (domino.value[1] === this.head && domino.value[0] === this.tail)) {
                    this.chooseSide = true
                    this.message = 'Vous pouvez placer votre domino à gauche ou à droite. Choisissez !'
                    this.select = true
                }
                    /*if ((domino.value[0] === this.board.tail && domino.value[1] === this.board.head) || (domino.value[0] === this.board.head && domino.value[1] === this.board.tail)) {
                        domino.left = 
                        if (domino.place === "left") {
                        domino.tail = undefined
                        domino.head = head
                        } else {
                        domino.head = undefined
                        domino.tail = tail
                        }
                    }
                    else { */
                        //calculations.positionningTheChosenDomino(domino, this.head, this.tail)
                    //}
                }

            console.log('MON DOMINO', domino)
            this.$store.dispatch('addToBoard', domino)
            this.tour = ++this.tour
            this.keepPlaying = true
            this.upto = !this.upto
            console.log('KEEPPLAYING CHOOSEDOMINO', this.keepPlaying)
            
        },
        ////////////////////////////////////////////////////////////////
/*
      machinePlays(){
        let machineTurn = progression.machinesTurn(this.keepPlaying, this.stopDrawing, this.upto)
        console.log('AFTER MACHINE PLAYS', machineTurn)
      },
            */
      // empêche la mise par le joueur sur le tapis de jeu d'un domino inadéquat
        warningWrongDomino: function(domino, head, tail) {
            if(domino.value[0] !== head && domino.value[0] !== tail && domino.value[1] !== head && domino.value[1] !== tail) {
            console.log('WRONG DOMINO!')
            this.wrong = true
            //return this.chooseDomino(domino)
            }
        },
      ///////////////////////////////////////////////////////////////////
      // c'est la machine qui joue
        machinePlays(){
            console.log('MACHINE IS PLAYING', this.keepPlaying)
            if (this.tour === 1 && this.machine.isStarting === true){
            console.log(`Machine is starting with ${this.machine.start.value[0]} ${this.machine.start.value[1]}`)
            //this.board = new Board(this.machine.start.value[0], this.machine.start.value[1])
            //display.addAPiece(this.machine.start, null)
            this.machine.start.player = false
            this.$store.dispatch('addToBoard', this.machine.start, 1)
            this.machine.isStarting = false
            this.keepPlaying = false
            
            }
            if (this.keepPlaying === true) {
                console.log('KEEP PLAYING!')
                if (this.$store.state.board.length > 0){
                    let knownDominoes = this.$store.state.machine.hand.concat(this.$store.state.board)
                    console.log('KNOWNDOMINOES', knownDominoes)
                    let valuedDominoes = knownDominoes.map( d => d.value )
                    console.log('VALUED DOMS', valuedDominoes)
                    let allValues = valuedDominoes.reduce( (acc, cur) => acc.concat(cur), [])
                    console.log('ALL VALUES', allValues)
                    let stats = allValues.reduce( (acc, cur) => {
                        if (!acc[cur]) acc[cur] = 1
                        else acc[cur]++
                        return acc
                        }, {}) 
                        console.log('WHERE ARE WE?', stats)
                    //let possibleLocks = stats.filter( d => d[1] > 4 )
                    //this.possibleLocks = possibleLocks
                    //console.log('POSSIBLE LOCKS', possibleLocks)
                    // détermination des choix possibles pour la machine
                    let choices = []
                    //this.board.head = calculations.calculateHead()
                    //this.board.tail = calculations.calculateTail()
                    //let head = this.calculateHead()
                    //let tail = this.calculateTail()
                    console.log('HEAD AND TAIL', this.head, this.tail)

                    let one = this.$store.state.machine.hand.filter(d => d.value[0] === this.head)
                    if (one) choices.push(one)

                    let two = this.$store.state.machine.hand.filter(d => d.value[1] === this.head)
                    if (two) choices.push(two)

                    let three = this.$store.state.machine.hand.filter(d => d.value[0] === this.tail)
                    if (three) choices.push(three)

                    let four = this.$store.state.machine.hand.filter(d => d.value[1] === this.tail)
                    if (four) choices.push(four)

                    let allChoices = _.flatten(choices)
                    allChoices = new Set(allChoices)
                    let machineChoices = [ ...allChoices ]
                    let choicesNum = machineChoices.length
                    console.log('MACHINECHOICES', machineChoices)
                    this.$store.dispatch('actualizeMachineChoices', choicesNum)

                    // selon les résultats... pas de choix, un seul choix, plusieurs choix possibles
                    // pas de domino à placer : la machine pioche...
                    if (machineChoices.length === 0) {
                        if (this.$store.state.noChoice === true){
                            this.keepPlaying = false
                            console.log('KEEPPLAYING MACHINE PLAYS NOCHOICE', this.keepPlaying)
                        } else {
                            let continueDrawing = true
                            while (continueDrawing && this.$store.state.dominoes.length > 0) {
                                this.drawAgain(0)

                                let one = this.$store.state.machine.hand[this.$store.state.machine.hand.length-1]
                                if (one.value[0] === this.head || one.value[1] === this.head || one.value[0] === this.tail || one.value[1] === this.tail){
                                one.player = false
                                machineChoices.push(one)
                                continueDrawing = false

                                console.log('MACHINECHOICES AFTER DRAWING', machineChoices)
                                }
                                else this.drawAgain(0)
                            }
                        }
                    }
                    //la machine a un ou plusieurs dominos possibles : comment choisir le meilleur ?
                    if (machineChoices.length > 0) return this.makeChoice(machineChoices)
                }
            }
                else {
                    if (this.restPieces === 0 && !this.playerChoices.length) {
                        this.neitherWins = true
                    }
                }
                //this.upto = !this.upto
                this.keepPlaying = false
                console.log('HEAD AND TAIL PLAYER', this.head, this.tail)
                console.log('KEEPPLAYING MACHINEPLAYS END TO PLAYER', this.keepPlaying)
                this.playerChoices = calculations.evaluatePlayerChoices()
                console.log('PLAYER CHOICES', this.playerChoices)
                if (!this.playerChoices.length) this.draw = true
            
        },
        /////////////////////////////////////////////////////////////////
      // pioche (illimitée, jusqu'à trouver le bon domino, ou à vider la réserve)
        drawAgain(player) {
            // si lapioche est vide
            if (this.$store.state.dominoes.length === 0) {
                this.draw = false
                this.stopDrawing = true
                this.upto = !this.upto
            }
            // si c'est le joueur humain qui pioche (bouton 'DRAW')
            if (player === 1) {
                this.empty = true
                this.$store.dispatch('drawOne', player)
                calculations.evaluatePlayerChoices()
                return this.$store.state.player.hand
            }
            // si c'est la machine qui pioche
            if (player === 0) {
                if (this.stopDrawing === true) {
                    this.$store.dispatch('noMoreChoice')
                    return
                }
                if (this.stopDrawing === false) {
                    this.$store.dispatch('drawOne', player)
                    return this.$store.state.machine.hand
                }
            }
        },

    
    //////////////////////////////////////////////////////
    makeChoice(machineChoices){
            console.log('MACHINE CHOICES INSIDE MAKECHOICE', machineChoices, this.empty)
            // this.empty = quand le joueur ne dispose manifestement pas de certaines valeurs...
            // ne pas jouer sur ces valeurs est un moyen de bloquer le joueur
            if (this.empty === true){
                let lockChoices = calculations.lockPlayer(machineChoices, this.head, this.tail)
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
            console.log('MACHINE HAND NOW', this.$store.state.machine.hand)
            console.log('LET FINAL', final)
            let piece = this.$store.state.machine.hand.find(p => p.value[0] === final[0] && p.value[1] === final[1])
            console.log("PIECE TO PLAY", piece, this.head, this.tail)
            piece.player = false
            //calculations.positionningTheChosenDomino(piece, this.head, this.tail)

            this.$store.dispatch('addToBoard', piece)
            this.keepPlaying = false
            console.log('HEAD AND TAIL PLAYER AFTER MACHINE MAKING CHOICE AND PLAYING', this.head, this.tail)
            console.log('KEEPPLAYING MAKECHOICE TO PLAYER', this.keepPlaying)
            this.playerChoices = calculations.evaluatePlayerChoices()
            console.log('PLAYER CHOICES', this.playerChoices)
            if (!this.playerChoices.length) this.draw = true

        },

        // afficher le résultat de la partie
    async claimVictory(){
        this.progression = true
        let results = { neitherWins: this.neitherWins, playerWins: this.playerWins, machineWins: this.machineWins, player: this.playerHand, machine: this.machineHand }
        let finalTotal = utils.calculateScores(results)
        if (this.neitherWins) {
            if (finalTotal > 0) this.message = 'Les deux joueurs sont bloqués, mais c\'est la machine qui gagne, avec ' + finalTotal + " points."
            if (finalTotal < 0) this.message = 'Les deux joueurs sont bloqués, mais c\'est vous, '+ this.name + ', qui gagnez avec ' + Math.abs(finalTotal) + " points."
            if (finalTotal === 0) this.message = 'Les deux joueurs sont bloqués. Pas de vainqueur pour cette manche.'
        }
        if (this.playerWins) this.message = "Bravo, "+ this.name + ", vous gagnez avec " + finalTotal + " points !"
        if (this.machineWins) this.message = "C'est la machine qui gagne, avec "+ finalTotal + " points !"
        this.alert = true
        //alert ('AND NOW, THE DB!')
        await this.updateDatabase(this.name, results, finalTotal)
        //this.limitTo100(this.name)
        
        await this.isTheGameEnded(this.getFromDatabase, this.name)

        await console.log('AFTER AWAIT... THE RESPONSE', response)
        setTimeout( () => {
        
            this.$store.dispatch('clearAll')
            //this.$store.dispatch('invertStart')
            this.draw = false
            this.stopDrawing = false
            this.progression = false
            this.alert = false
            this.start = true
            this.tour = 1
            //this.start = Math.max(scores.player_score, scores.machine_score) < 100 ? true : false
        }, 5000)
        
        },

    updateDatabase(player, results, finalTotal){
    
        let request = window.indexedDB.open("DominoBase")
        request.onsuccess = function(event){
            let db = event.target.result
            let gamesObjectStore = db.transaction("games", "readwrite").objectStore("games")
            let res = gamesObjectStore.get(player)
            res.onsuccess = function(event){
                let scores = res.result
                if (results.playerWins) {
                scores.player_score = scores.player_score + finalTotal
                scores.player_victory = scores.player_victory + 1
                scores.player_recent_winning = true
                scores.machine_recent_winning = false
            }
            if (results.machineWins) {
                scores.machine_score = scores.machine_score + finalTotal
                scores.machine_victory = scores.machine_victory + 1
                scores.machine_recent_winning = true
                scores.player_recent_winning = false
            }
            if (results.neitherWins) {
                if (finalTotal > 0) {
                    scores.machine_score = scores.machine_score + finalTotal
                    scores.machine_victory = scores.machine_victory + 1
                    scores.machine_recent_winning = true
                    scores.player_recent_winning = false
                }
                if (finalTotal < 0) {
                    scores.player_score = scores.player_score + finalTotal
                    scores.player_victory = scores.player_victory + 1
                    scores.player_recent_winning = true
                    scores.machine_recent_winning = false
                }
                
            }
                let update = gamesObjectStore.put(scores)
                alert('UPDATE IS DONE')
                res.oncomplete = function(event){
                    console.log('SCORES', scores)
                    return scores
                }
                
            }
        }
    },

    getFromDatabase(name){
    let response
    let request = window.indexedDB.open("DominoBase")
    request.onsuccess = function(event){
        let db = event.target.result
        let gamesObjectStore = db.transaction("games").objectStore("games")
        let res = gamesObjectStore.get(name)
        res.onsuccess = function(event){
            
            response = res.result
            console.log('RESPONSE FOUND', response)
            return response
            }

        /*res.oncomplete = function(event){
            return response
        }*/
        }
    },

    async isTheGameEnded(fn, name){
        await fn(name)
        console.log('THE RESPONSE IS...', response)
        if (response.player_score >= 100){
            this.message = `Félicitations, ${this.name}, vous venez de remporter la partie !`
            this.alert = true
            this.start = false
            this.draw = false
            this.stopDrawing = false
        }
        if (response.machine_score >= 100){
            this.message = `Désolé, ${this.name}, c'est la machine qui remporte la partie !`
            this.alert = true
            this.start = false
            this.draw = false
            this.stopDrawing = false
        }

    },

    limitTo100(name){
        let response = this.getFromDatabase(name)
        console.log('RESPONSE', response)
        if (response.player_score <= 100) {
            this.message = "Vous avez gagné, " + this.name + ". Bravo !"
        }
        if (response.machine_score <= 100) {
            this.message = "C'est la machine qui a gagné !"
        }
    },
        // remettre le composant PlayingZone à zéro pour une nouvelle partie
    resetAll(){
            
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
            this.upto = false
            this.playerChoices = []
            this.playerStarts = false
            this.machineStarts = false
            this.wrong = false
            this.message = ''
            this.tour = 1

        } 
    }
}



</script>

<style>
.hand-board {
    background-color: green;
    border: solid 5px brown;
    width: 100%;
    margin: 10px auto;
    background-color: green;
    padding: 10px;
}

.intro {
    width: 30%;
    margin: 20px auto;
    padding: 15px;
    border: solid 3px white;
    border-radius: 5px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, .3);
    z-index: 10;
    background-color: brown;
    color: white;
    animation: GetVisible 3s ease;
}
.btn-play {
    margin: 10px;
    padding: 1%;
    background-color: green;
    color: white;
    font-size: 2rem;
    font-weight: 800;
    border-radius: 5%;
    border: solid 1px red;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .3);
}

.flex-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.active-domino {
    padding: 0;
    cursor: pointer;
}
.game-item {
    display: inline-block;
    padding: 0;
    margin: 15px 5px;
    box-shadow: 1px 1px 1px 1px black;
    cursor: pointer;
    animation: enterTheHand 1s;
}
.hand {
    justify-content: center;
}
/*.commands {
    animation: GetVisible 2s ease;
} */
.fade-leave-active {
    transition: opacity 2s ease;
}
.fade-leave-to {
    opacity: 0;
}

.end-enter {
    opacity: 0;
    transform: translateX(30px);
}
.end-enter-active {
    transition: all 3s ease;
}
.end-enter-to {
    opacity: 1;
    transform: translateX(0px);
}
@keyframes enterTheHand {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}



</style>
