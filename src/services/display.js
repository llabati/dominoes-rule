import store from '../store/index.js'
export default {

    translate(piece, player){
        let translated = player.hand.find( d => d.value)
    },
    addAPiece(piece, html){
        let board = store.state.board
        let list
        if ( html === null ) {
            if (board.length <= 6) {
                list = document.querySelector('#begin')
            }
            if (board.length > 6 && board.length <= 10) {
                list = piece.lefty === true ? document.querySelector('#left') : document.querySelector('#right')
            }
            if (board.length > 10) {
                list = piece.lefty === true ? document.querySelector('#top') : document.querySelector('#bottom')
            }
    
        }
        else {
            list = document.querySelector(html)
        }
        //console.log('HAND', haand)
        console.log('PIECE WITH TWO LITTERALS', `${piece.value[0]}, ${piece.value[1]}`)
        let newPiece = document.createElement('img')
        let source = require(`@/assets/${piece.value[0]}-${piece.value[1]}.png`)
        console.log('SOURCE', source)
        newPiece.src = source
        newPiece.className = (html === '#left' || '#right') || piece.double === true ? 'domino domino-vert' : 'domino'
        newPiece.id = `${piece.value[0]}-${piece.value[1]}`
        console.log('NEW PIECE', newPiece)
        list.appendChild(newPiece)
        
    },
    removeAPiece(piece){
                
        let list = document.querySelector('#player-hand')
        console.log('PLAYER HAND', list)
        let allPieces = [ ...document.querySelectorAll('#player-hand img') ]
        console.log('ALL PIECES IN HAND', allPieces)
        console.log('PIECE TO REMOVE', `${piece.value[0]}, ${piece.value[1]}`)
        let playedPiece = allPieces.find( i => i.id === `${piece.value[0]}-${piece.value[1]}`)
        console.log('PIECE TO REMOVE', playedPiece)
        
        list.removeChild(playedPiece)
        
                
    }
}







