import firebase from 'firebase/app'
import 'firebase/firestore'



var firebaseConfig = {
    apiKey: "AIzaSyDqFK46ve9YKfcfs6Srqlssx0UnQUrCT10",
    authDomain: "dominoes-rule.firebaseapp.com",
    databaseURL: "https://dominoes-rule.firebaseio.com",
    projectId: "dominoes-rule",
    storageBucket: "dominoes-rule.appspot.com",
    messagingSenderId: "796136911204",
    appId: "1:796136911204:web:4c8564141fda4e8d27ca71"
} 
  // Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const db = firebase.database()