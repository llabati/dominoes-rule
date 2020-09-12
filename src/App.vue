<template lang="pug">
  #app
    //#nav
    game
  
</template>

<script>
//import * as firebase from 'firebase'
//import { db } from './db'

import Game from './views/Game.vue';


export default {
  data(){
    return {
      options: []
    }
  },
  components: {
    Game
  },
  
  methods: {
    /*setDatabase(){
      let request = window.indexedDB.open("scores", 3)
      let db
      request.onsuccess = event => {
        db = event.target.result
        console.log('DB', db)
      }
      let firstGirls = [ { name: 'Eva', score: 66 }, { name: 'Ema', score: 45 }, { name: 'Lea', score: 96 } ]
      request.onupgradeneeded = function (event) {

      let db = event.target.result;

    // Création d'un autre objet appelé "names" avec l'option autoIncrement définie à true.    
      let objStore = db.createObjectStore("girls", { autoIncrement: true });

    // Puisque l'objet "names" a un générateur de clés, la clé pour la valeur name est générée automatiquement.
    // Les enregistrements ajoutés ressembleront à ceci :
    // key : 1 => value : "Bill"
    // key : 2 => value : "Donna"
    for (var i in customerData) {
        objStore.add(firstGirls[i].name);
    }

     /*
        let store = db.createObjectStore("players", { keyPath: "name"})
        store.createIndex("name", "name", { unique: true }) 
        let transaction = db.transaction(['players'], 'readwrite')
        let updatedStore = transaction.objectStore('players')
        let data = [
          { name: 'Eva', score: 122 },
          { name: 'Ema', score: 96 },
          { name: 'Lia', score: 138 }

        ]
        for (let i of data ) {
          let request = updatedStore.add(data[i])
        }
        transaction.oncomplete = event => {
          console.log(objScore)

        }
        transaction.onerror = event => {
          console.log('FAILURE!', error.message)
        }
        
      }
      /*let transaction = db.transaction(["players"])
      let actualStore = transaction.objectStore("players")
      request = actualStore.get("name")
      console.log('REQUEST', request)
      }
    },
    getTheScores(){
      let db = window.indexedDB
      console.log('DB', db)
      let transaction = db.transaction(['players'])
      let store = transaction.objectStore('players')
      let request = store.get("name")
      request.onerror = event => {
        console.log('NOT FOUND', event)
      }
      request.onsuccess = event => {
        console.log('FOUND!', request.result)
      }*/
    },
  
  mounted(){
    this.$store.dispatch('setState')
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
