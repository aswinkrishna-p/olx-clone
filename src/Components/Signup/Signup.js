import React, { useState , useContext, useRef, useEffect } from 'react';
import Logo from '../../olx-logo.png';
import './Signup.css';
import {FirebaseContext ,AuthContext} from '../../store/Context'
import { useNavigate } from 'react-router-dom';
import { collection, addDoc} from "firebase/firestore";
import Swal from 'sweetalert2';

export default function Signup() {

  const [Username ,setUsername] = useState('')
  const [email , setEmail] = useState('')
  const [phone , setPhone] = useState('')
  const [password , setPassword] =useState('')
  const {firebase} = useContext(FirebaseContext)
  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  const inputFocus = useRef(null)



  useEffect(() =>{
    if(user)navigate('/')
    function focusInput() {
      inputFocus.current.focus();
    }
    focusInput()
  },[user , navigate])
 
 

  const handleSubmit = async (e) =>{
    try {

        e.preventDefault()
        setUsername(Username.trimEnd());
        setEmail((email).toLowerCase().trimEnd())


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
            Swal.fire({ position: 'top-center', icon: 'success', text: 'User account created successfully', width: 340, showConfirmButton: false, timer: 1500 })
            navigate('/login')
          })
          .catch((error) =>{
            console.error("Error adding document: ", error);
          })
        })
      })
      } catch (error) {
        console.log('Error creating user:', error.message);
        if(error.message === "Firebase: Error (auth/email-already-in-use).") {
          Swal.fire({
            icon: 'error',
            title: 'Existing user found !',
            text:'Please login to continue'
          })
        }
      }
     
  }
  return (
    <div>
    <div className="row mx-5 p-4 ">
      <div className="col-12 col-md-4 p-4"></div>
      <div className="col-12 col-md-4 p-4 box">
        <div className="text-center" style={{ cursor: 'pointer' }}>
          <img width="150em" src={Logo} onClick={() => navigate('/')} alt='OLX-Logo'></img>
        </div>

        <div className="px-3 pb-3">
          <form className="formData" onSubmit={handleSubmit}>
            <div className="col-12 px-2">

              <div className="mb-3">
                <label htmlFor="text" className="form-label">Name</label>
                <input type="text" placeholder="Enter your first name" pattern="[A-Za-z ]*" minLength="3"
                  name="firstName" className="form-control" id="firstName" required ref={inputFocus}
                  value={Username} onChange={(input) => setUsername(input.target.value.trimStart())} />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" name="email" className="form-control" id="email" pattern="^(?=.*[@])(?=.*[.]).{5,}$"
                  placeholder="Enter email ID" required
                  value={email} onChange={(input) => setEmail(input.target.value.trimStart())} />
              </div>

              <div className="mb-3">
                <label htmlFor="number" className="form-label">Phone number</label>
                <input type="tel" name="phone" className="form-control" id="phone" pattern="[0-9]*"
                  minLength="10" placeholder="Enter contact number" required
                  value={phone} onChange={(input) => setPhone(input.target.value.trimStart())} />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" name="password" className="form-control" placeholder="Enter password" id="password"
                  // pattern="^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-=|]).{6,}$" 
                  required minLength='6' value={password} onChange={(input) => setPassword(input.target.value)} />
              </div>

              <div className="text-center mb-2">
                <button type="submit" className="btn btn-primary w-50">Signup</button>
              </div>
              <p className="text-center">Already have account? <span onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>Login</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
