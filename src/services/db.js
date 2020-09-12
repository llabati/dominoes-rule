function searchForDatabase(name){
    let dbExists = true 
    var request = window.indexedDB.open(name) 
    request.onupgradeneeded = function (e){ 
        let db = e.target.result
     if(db.version === 1){ 
      dbExists = false 
      window.indexedDB.deleteDatabase(name);
      return setDatabase()
     } 
     
    }; 
    
}

function setDatabase(){
  let request = window.indexedDB.open("DominoBase", 3)
  
  request.onerror = function(event){
      console.log('NO DB', event)
  }
  request.onsuccess = function(event){
    console.log('DB created!', request.result)
  }
  request.onupgradeneeded = function(event){
    let db = event.target.result
    let gamesStore = db.createObjectStore("games", { keyPath: "player" })
    }
}

function addToDatabase(game){
    let request = window.indexedDB.open("DominoBase")
    request.onsuccess = function(event){
        let db = event.target.result
        let gamesObjectStore = db.transaction("games", "readwrite").objectStore("games")
        gamesObjectStore.add(game)
        console.log('GAME IN PROGRESS...', gamesObjectStore)
    }
}

function getFromDatabase(player){
    let request = window.indexedDB.open("DominoBase")
    request.onsuccess = function(event){
        let db = event.target.result
        let gamesObjectStore = db.transaction("games").objectStore("games")
        let res = gamesObjectStore.get(player)
        res.onsuccess = function(event){
            let response = res.result
            console.log('RESPONSE', response)
            return response
        }

    }
}

function updateDatabase(update){
    let request = window.indexedDB.open("DominoBase")
    request.onsuccess = function(event){
        let db = event.target.result
        let gamesObjectStore = db.transaction("games", "readwrite").objectStore("games")
        let res = gamesObjectStore.get(player)
        res.onsuccess = function(event){
            res.put(update)
            console.log('UPDATE', res)
        }
    }
}

//function clearDatabase(){}



export default { searchForDatabase, setDatabase, addToDatabase, getFromDatabase, updateDatabase }



