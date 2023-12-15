import React, { useContext, useEffect } from 'react';
import {BrowserRouter as Router , Route ,Routes} from 'react-router-dom'
import { AuthContext, FirebaseContext } from './store/Context';
import './App.css';
import Signup from './Pages/Signup'
import Home from './Pages/Home';
import Login from './Pages/Login'

function App() {
  const {setUser} = useContext(AuthContext)
  const {firebase} = useContext(FirebaseContext)


  // checking if the  user is logged in or not
  useEffect(() => {
    const auth = firebase.firebaseAuth.getAuth()
    firebase.firebaseAuth.onAuthStateChanged(auth, (user)=>{
      setUser(user)
    })
  })
  return (
    <div>
      <Router>
        <Routes>
        <Route  path='/' element={ <Home />} />
        <Route  path='/signup' element={ <Signup />} />
        <Route path='/login' element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
