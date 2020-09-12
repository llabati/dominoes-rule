<template lang="pug">
    
    .board(v-if='!start')
        
        #top(v-if='top.length')
            ul.flex-top-list
                li(v-for="piece in top" :key="piece.id" class="domino-mid")
                    domino(:value='piece.value' :class='{ "domino-vert": piece.isDouble, "domino-swap": piece.swap }')
            
        #left(v-if='left.length')
            ul.flex-left-list
                li(v-for="piece in left" :key="piece.id" style='margin: 30px' class="domino-vert domino-swap")
                    domino(:value='piece.value' :class='{ "domino-vert": piece.isDouble, "domino-swap": piece.swap }')
            
        #begin(v-if='begin.length')
            ul.flex-list
                li(v-for="piece in begin" :key="piece.id")
                    domino(:value='piece.value' :class='{ "domino-vert": piece.isDouble, "domino-swap": piece.swap }')
            
        #right(v-if='right.length')
            ul.flex-right-list
                li(v-for="piece in right" :key="piece.id" style='margin: 30px' class='domino-vert domino-swap')
                    domino(:value='piece.value' :class='{ "domino-vert": piece.isDouble, "domino-swap": piece.swap }')
            
        #bottom(v-if='bottom.length')
            ul.flex-bottom-list
                li(v-for="piece in bottom" :key="piece.id" class="domino-mid")
                    domino(:value='piece.value' :class='{ "domino-vert": !piece.isDouble ,"domino-swap": piece.swap }')
    
</template>

<script>
import { store } from '../store/index'
import Domino from './Domino.vue'


export default {
    store,
    data(){
        return {
            pieces: this.$store.state.board.length,
            piece: {},
            
        }
    },
    computed: {
        start(){
            return this.$store.state.start
        },
        begin(){
            return this.$store.state.begin
        },
        left(){
            return this.$store.state.left
        },
        right(){
            return this.$store.state.right
        },
        top(){
            return this.$store.state.top
        },
        bottom(){
            return this.$store.state.bottom
        },
        board(){
            return this.$store.state.board
        }
        /*board: {
            get(){
                return this.$store.state.board
            },
            set(value){
                this.$store.dispatch('saveBoard', value)
            }
        },
        pieces() {
            return this.board.length
        },*/

        
    },
    
    methods: {
        addAPiece(piece){
            ++this.pieces
            this.piece = piece
            if (this.pieces <= 5) {
                this.begin.push(piece)
                let beegin = document.querySelector('#begin')
                beegin.insertAdjacentHTML('beforeend', '<img class="domino" src="../src/assets/whole_domino.png">')
                //let source = '../assets/whole_domino.png'
                //let newBegin = document.createElement('img')
                //newBegin.src = source
                //newBegin.className = "hor"
                
                //beegin.appendChild(newBegin)
            }
            let refDom = document.querySelector('#ref-domino')
            if (this.pieces > 5 && this.pieces <= 8 && this.piece.lefty) {
                this.left.push(piece)
                let leeft = document.querySelector('#left')
                let newLeft = document.createElement('div')
                newLeft.className = "domino domino-vert"
                newLeft.style.background = 'pink'
                let inner = '<img src="../assets/whole_domino.png">'
                //let source = "../assets/whole_domino.png"
                newLeft.src = "../assets/whole_domino.png"
                newLeft.innerHTML = inner
                leeft.appendChild(newLeft)
                console.log('NEW LEFT', newLeft)
            }
            if (this.pieces > 8 && this.piece.lefty) this.top.push(piece)
            if (this.pieces > 5 && this.pieces <= 8 && this.piece.lefty === false) {
                this.right.push(piece)
                let riight = document.querySelector('#right')
                let newRight = document.createElement('div')
                newRight.className = "domino domino-vert"
                newRight.innerHTML = '<img src="../assets/whole_domino.png">'
                
                riight.appendChild(newRight)
            }
            if (this.pieces > 8 && this.piece.lefty === false) this.bottom.push(piece)
            console.log('LEFT?', this.left.includes(this.piece))
            console.log('RIGHT?', this.right.includes(this.piece))

            console.log('BEGIN', this.begin)
            if (this.left.length) console.log('LEFT', this.left)
            if (this.right.length) console.log('RIGHT', this.right)

                    }
    },
    components: {
        Domino
    }
    
    
}
</script>

<style>
.board {
    min-width: 1500px; 
    margin: 10px; 
    background-color: green; 
    padding: 30px;
    display: grid;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(11, 100px);
}
/*.flex-board {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.board-draggable {
    height: 100%;
    width: 100%;
}

.board div {
    border: solid 1px white;
}
.board-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 15px 2px;
    box-shadow: 1px 1px 1px 1px black;
}
.board-item:first-child {
    animation: enterTheBoardLeft 1s;
}
.board-item:last-child {
    animation: enterTheBoardRight 1s;
}

.dom-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 85%;
    margin: 10px;
} 
.flex-board li:last-child {
    box-shadow: 1px 1px 1px 1px red;
}
.flex-board li:first-child {
    box-shadow: -1px -1px 1px 1px red;
} 


.hor {
    display: flex;
    flex-direction: row;
    justify-content:center;
    width: 80%;
    margin: 0 auto;
    height: 100px;
}
.vert {
    display: flex;
    flex-direction: column;
    
    width: 100px;
    height: 300px;
} */
.flex-list {
    list-style-type: none;
    margin: none;
    padding: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
}
.flex-left-list {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    justify-content: end;
}
.flex-right-list {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    justify-content: start;
}
.flex-top-list {
    list-style-type: none;
    margin: none;
    padding: none;
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
}
.flex-bottom-list {
    list-style-type: none;
    margin: none;
    padding: none;
    display: flex;
    flex-direction: row-reverse;
    justify-content: right;
    flex-wrap: wrap;
}
#top {
    grid-column: 2 / 8;
    grid-row: 1 / 2;
    border: solid 1px white;
    /*justify-items: start;*/
    
}
#left {
    /*justify-items: start;*/
    /*align-items: center;*/
    grid-column: 2 / 3;
    grid-row: 2 / 6;
    border: solid 1px white;

}
#begin {
    grid-column: 2 / 8;
    grid-row: 6 / 7;
    border: solid 1px white;
}
#right {
    /*position: relative;
    left: 80%;
    justify-content: flex-start; */
    grid-column: 7 / 8;
    grid-row: 7 / 11;
    border: solid 1px white;
}
#bottom {
    grid-column: 2 / 8;
    grid-row: 11 / 12;
    border: solid 1px white;

}
.piece {
    width: 90px;
    height: 45px;
    border: solid 1px blue;
    background: cadetblue;
}
.lefty {
    width: 45px;
    height: 90px;
}

.swap {
    transform: rotate(180deg);
}


@keyframes enterTheBoardRight {
    from {
        opacity: 0;
        transform: translateX(10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
@keyframes enterTheBoardLeft {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

</style>