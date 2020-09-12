import Firebase from 'firebase/app'
import 'firebase/firestore'
import firestoreConfig from './db'

const config = firestoreConfig

const App = Firebase.initializeApp(config)

const Firestore = App.firestore()
//Firestore.settings({ timestampsInSnapshots: true })

export default {
  create(game){
    return Firestore.collection('games').add(game)
  },
  read(){
    return Firestore.collection('games').get()
  }
}
