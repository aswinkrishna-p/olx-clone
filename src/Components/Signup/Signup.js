import React, { useState , useContext } from 'react';
import Logo from '../../olx-logo.png';
import './Signup.css';
import {FirebaseContext ,AuthContext} from '../../store/Context'
import { useNavigate } from 'react-router-dom';
import { collection, addDoc} from "firebase/firestore";

export default function Signup() {

  const [Username ,setUsername] = useState('')
  const [email , setEmail] = useState('')
  const [phone , setPhone] = useState('')
  const [password , setPassword] =useState('')
  const {firebase} = useContext(FirebaseContext)
  const navigate = useNavigate()
 
 

  const handleSubmit = async (e) =>{
      e.preventDefault()
      try {
        const auth = firebase.firebaseAuth.getAuth()
         await firebase.firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
         .then((result) => {
          
          const userDocData = {
            id: result.user.uid,
            name: Username,
            phone: phone,
          }
         
        firebase.firebaseAuth.updateProfile(auth.currentUser,{displayName: Username,})
        .then(async () =>{
          const usersCollection = collection(firebase.db, "users");
          await addDoc(usersCollection , userDocData)
          .then((docRef) =>{
            navigate('/login')
          })
          .catch((error) =>{
            console.error("Error adding document: ", error);
          })
        })
      })
      } catch (error) {
        console.error('Error creating user:', error.message);
      }
     
  }
  return (
    <div>
      <div className="signupParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className="input"
            type="text"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            id="fname"
            name="name"
            defaultValue="John"
          />
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="fname"
            name="email"
            defaultValue="John"
          />
          <br />
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            id="lname"
            name="phone"
            defaultValue="Doe"
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="lname"
            name="password"
            defaultValue="Doe"
          />
          <br />
          <br />
          <button>Signup</button>
        </form>
        <a>Login</a>
      </div>
    </div>
  );
}
