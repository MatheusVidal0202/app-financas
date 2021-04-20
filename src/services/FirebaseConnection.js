import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyCjZUN9F-mcDRwKX-b5XoUq8fx9wpsQGCU",
    authDomain: "financas-b0f0f.firebaseapp.com",
    projectId: "financas-b0f0f",
    storageBucket: "financas-b0f0f.appspot.com",
    messagingSenderId: "946648915072",
    appId: "1:946648915072:web:88a91481a800cbdce1da65",
    measurementId: "G-HQRSM13D0H"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
