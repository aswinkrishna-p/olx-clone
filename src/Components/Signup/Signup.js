import React, { useState, useContext, useRef, useEffect } from 'react';
import Logo from '../../olx-logo.png';
import './Signup.css';
import { AuthContext, FirebaseContext } from '../../store/Context';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc} from "firebase/firestore";
import Swal from 'sweetalert2';

export default function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { firebase } = useContext(FirebaseContext)
  const navigate = useNavigate()
  const inputFocus = useRef(null)
  const {user} = useContext(AuthContext)

  useEffect(() => {
    if(user)navigate('/')
    function focusInput() {   //focus on name input field
      inputFocus.current.focus();
    }
    focusInput()
  }, [user,navigate])


  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSignup = async (event) => {     //Submit the signup data and redirect to login
    try {
      // console.log(firebase)
      event.preventDefault()
      setName(name.trimEnd());
      setEmail((email).toLowerCase().trimEnd())

      // console.log(name, email, phone, password)   //test mode

      if (!validateForm()) {
        return; // Stop execution if there are validation errors
      }

      const auth = firebase.firebaseAuth.getAuth();
      await firebase.firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {  // Signed up 

          const user = userCredential.user;

          const userDocData = {
            id: user.uid,
            name: name,
            phone: phone,
          }

          firebase.firebaseAuth.updateProfile(auth.currentUser, { displayName: name, })
            .then(async () => {
              // Reference the "users" collection to add a new document
              const usersCollection = collection(firebase.db, "users");
              await addDoc(usersCollection, userDocData)
                .then((docRef) => {
                  Swal.fire({ position: 'top-center', icon: 'success', text: 'User account created successfully', width: 340, showConfirmButton: false, timer: 1500 })
                  navigate('/login');
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
            });
        })
    } catch (error) {
      console.log(error.message);
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
            <form className="formData" onSubmit={handleSignup}>
              <div className="col-12 px-2">
                                {/* Display validation errors */}
                                {Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger mt-3">
                    {Object.values(errors).map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="text" className="form-label">Name</label>
                  <input type="text" placeholder="Enter your first name" pattern="[A-Za-z ]*" minLength="3"
                    name="firstName" className="form-control" id="firstName" required ref={inputFocus}
                    value={name} onChange={(input) => setName(input.target.value)} />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" name="email" className="form-control" id="email" pattern="^(?=.*[@])(?=.*[.]).{5,}$"
                    placeholder="Enter email ID" required
                    value={email} onChange={(input) => setEmail(input.target.value)} />
                </div>

                <div className="mb-3">
                  <label htmlFor="number" className="form-label">Phone number</label>
                  <input type="tel" name="phone" className="form-control" id="phone" pattern="[0-9]*"
                    minLength="10" placeholder="Enter contact number" required
                    value={phone} onChange={(input) => setPhone(input.target.value)} />
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
