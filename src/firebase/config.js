import {initializeApp} from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBRGBuCpdfaOP0sXS3aJU_Jd-qP-7SnN54",
    authDomain: "olx-clone-b6b93.firebaseapp.com",
    projectId: "olx-clone-b6b93",
    storageBucket: "olx-clone-b6b93.appspot.com",
    messagingSenderId: "202073551431",
    appId: "1:202073551431:web:6e82c264f93eee980d7762",
    measurementId: "G-WT17FLJ75F"
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firebaseExports = { app , auth};
    export default firebaseExports;