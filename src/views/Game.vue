<template lang="pug">
  div(ref='play' style='width: 100%;')
    prompt(v-on:newName='nameThisPlayer')

    
    board
    
    playing-zone(:name='name' :display='display')

</template>

<script>
import Prompt from '../components/Prompt.vue'
import Board from '../components/Board.vue'
import PlayingZone from '../components/PlayingZone.vue'
import { store } from '../store/index'
import Player from '../models/Player'
//import searchForDatabase from '../services/db'
//import { setDatabase } from '../services/db'
export default {
  store,
  //searchForDatabase,
  //setDatabase,
  data(){
    return {
      name: '',
      launch: false,
      display: false,
      dbExists: false,
    }
  },/*
  watch: {
    dbExists(){
      if (this.dbExists === false) console.log('DB EXISTS IS FALSE', this.dbExists)
      if (this.dbExists === true) console.log('DB EXISTS IS TRUE', this.dbExists)
    }
  },*/
  computed: {
    /*version(){
      return this.searchForDatabase()
    }
    /*board: {
            get(){
                return this.$store.state.board
            },
            set(value){
                this.$store.dispatch('saveBoard', value)
            }
        },
    hand(){
      return this.$store.state.hand
    },
    machineHand(){
      return this.$store.state.machineHand
    },
    restPieces(){
      return this.$store.state.shuffledPieces.length
    } */
  },
  /*watch: {
    version(){
      if (this.version <= 3) this.dbExists = false
      else this.dbExists = true
    }
  },*/
  methods: {
    nameThisPlayer(name){
      console.log('DB EXISTS WHEN NAME', this.dbExists)
      if (!this.dbExists) this.setDatabase(name)
      else this.addNewPlayerToDatabase(name)
      this.name = name
      let currentPlayer = new Player(name)
      this.$store.dispatch('addPlayer', currentPlayer)
      
      /*if (currentPlayer.step % 2 === 1) {
        this.launch = true
      } else {
        this.launch = false
      } */
      this.display = true
    },
    searchForDatabase(){
    var request = window.indexedDB.open('DominoBase') 
    request.onsuccess = function (e){ 
        let version = e.target.result.version
        return version
        //console.log('VERSION', version)
        //request.oncomplete = function(event) {
        //  if (version < 4) this.dbExists = false
        //  else this.dbExists = true
        //this.dbExists = version === 4 ? true : false
        alert('DB EXISTS NOW')
      //window.indexedDB.deleteDatabase(name);
          } 
        },
      
  
  setDatabase(name){
    //console.log('SETTING THE DB')
    let request = window.indexedDB.open("DominoBase", 4)
    //request.onsuccess = function(event){
    //  alert('DB WITH VERSION 4')
      request.onupgradeneeded = function(event){
        var db = event.target.result
        alert ('UPGRADE NEEDED')
          
        let gamesStore = db.createObjectStore("games", { keyPath: "player" })
        
        gamesStore.transaction.oncomplete = function(event) {
    
          let resultObjectStore = db.transaction("games", "readwrite").objectStore("games")
          resultObjectStore.add({player: name, player_score: 0, player_victory: 0, machine: "IA", machine_score: 0, machine_victory: 0})
          alert('PLAYER SAVED', db)
          
          request.oncomplete = function(event){
            let db = event.target.result
            let gamesObjectStore = db.transaction("games").objectStore("games")
            let res = gamesObjectStore.get(player)
            res.onsuccess = function(event){
                let response = res.result
                alert('SCORE DE LUDOVIC : ', response.player_score)
                
                    }

              }
              }
    
          }
  },
  addNewPlayerToDatabase(name){
    let request = window.indexedDB.open("DominoBase")
    request.onsuccess = function(event){
        let db = event.target.result
        let gamesObjectStore = db.transaction("games", "readwrite").objectStore("games")
        let res = gamesObjectStore.get(name)
        res.onsuccess = function(event){
          alert ('GOT PLAYERS')
          gamesObjectStore.add({player: name, player_score: 0, player_victory: 0, machine: "IA", machine_score: 0, machine_victory: 0})
          
          }

      }
    }

  },

  components: {
    Prompt,
    Board,
    PlayingZone
  },
  mounted(){
    console.log('GAME', this.dbExists)
    this.launch = true
    let version = this.searchForDatabase("DominoBase")
    //console.log('DB EXISTS', this.dbExists)
    if (version <= 3) this.dbExists = false
    else this.dbExists = true

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#intro {
    padding: 15px;
    background-color: brown;
    color: white;
    margin: 20px auto;
}
input {
    display: block;
    width: 100%;
    border: solid 1px red;
    margin-bottom: 10px;
}
.center {
  width: 90%;
  margin: 10px auto;
}
</style>
