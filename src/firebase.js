import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCCD8hdBd-nvdaHERhCgYyemUcGIr1biMI",
    authDomain: "e-clone-with-react.firebaseapp.com",
    databaseURL: "https://e-clone-with-react.firebaseio.com",
    projectId: "e-clone-with-react",
    storageBucket: "e-clone-with-react.appspot.com",
    messagingSenderId: "505890859998",
    appId: "1:505890859998:web:b8de30f349286bad4d0b4f",
    measurementId: "G-N49W7ZDSKH"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  
  export { db, auth };
