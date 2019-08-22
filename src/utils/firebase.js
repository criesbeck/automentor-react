import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDtS35VE7FqORpJbZTeKj-Ws2lAeiMQj7o",
  authDomain: "automentor-be920.firebaseapp.com",
  databaseURL: "https://automentor-be920.firebaseio.com",
  projectId: "automentor-be920",
  storageBucket: "",
  messagingSenderId: "422306890779",
  appId: "1:422306890779:web:42fc5116e3ae7f5f"
};

firebase.initializeApp(firebaseConfig);

export { firebase };