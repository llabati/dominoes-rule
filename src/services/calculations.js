
import store from '../store/index.js'
import display from './display.js'
export default {
    //state: store.state,

    // désigne la valeur gauche du domino placé à l'extrémité gauche du tapis de jeu
    calculateHead: function(){
        
        return store.state.board[0].value[0]
    },
    // désigne la valeur droite du domino placé à l'extrémité droite du tapis
    calculateTail: function(){
         
        return store.state.board[store.state.board.length-1].value[1]
    },
    // évalue les choix du joueur
    evaluatePlayerChoices: function(){
      console.log('EVALUATE PLAYER CHOICES')
      return store.state.player.hand.filter( d => d.value[0] === store.state.board[0].value[0] || d.value[0] === store.state.board[store.state.board.length-1].value[1] || d.value[1] === store.state.board[0].value[0] || d.value[1] === store.state.board[store.state.board.length-1].value[1] )

    },
    
    // détermine le meilleur domino à jouer (nombre de points le plus élevé), parmi les choix possibles
    // favorise le choix des doubles
    calculateBestChoice: function(machineChoices){
        console.log('MACHINECHOICES ENTERING CALCULEBEST CHOICE', machineChoices)
            let computedChoices = machineChoices.map(e => [ e.value[0], e.value[1], e.value[0] + e.value[1] ])
                console.log('COMPUTEDCHOICES', computedChoices)

            let finalChoices = (computedChoices.find( e => e[0] === e[1])) ? computedChoices.filter(a => a[0] === a[1]).sort((a,b) => b[2] - a[2]) : computedChoices.sort((a,b) => b[2] - a[2])
            console.log('FINAL CHOICES', finalChoices)

            let final = finalChoices[0]
            console.log('FINAL CHOICE', final)
            //this.double = false
            return final
    },

    // déterminer les possibilités que la machine a de bloquer le joueur et de le forcer à piocher
    lockPlayer(machineChoices, head, tail){
        console.log('MACHINECHOICES in LOCKPLAYER', machineChoices)
        let lockChoices = []
        let lockHead = machineChoices.filter (d => d.value[0] === store.state.board[0].value[0] || d.value[1] === store.state.board[0].value[0])
        let lockTail = machineChoices.filter (d => d.value[0] === store.state.board[store.state.board.length-1].value[1] || d.value[1] === store.state.board[store.state.board.length-1].value[1])
        lockChoices = [ ...lockHead, ...lockTail ]
        console.log('LOCKCHOICES', lockChoices)
        return lockChoices
    }


}
