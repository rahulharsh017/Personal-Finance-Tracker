import React,{useState} from 'react'
import "./style.css"
import Input from '../Input'
import Button from '../Button'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { auth,db,provider } from "../../firebase"
import { getDoc,setDoc,doc} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SignUpSigninComponent() {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[confirmPassword,setConfirmPassword] = useState('')
    const[loginForm,setLoginForm] = useState(false)
    const[loading,setLoading] = useState(false)
    const navigate = useNavigate()

    function signupwithEmail(){
        setLoading(true)
        console.log("Name",name);
        console.log("Email",email);
        console.log("password",password);
        console.log("confirmpassword",confirmPassword);

        if(name!=='' && email!=='' && password!=='' && confirmPassword!==''){
            if(password == confirmPassword){
                createUserWithEmailAndPassword( auth,email, password)
            .then((userCredential) => {
              // Signed up 
              const user = userCredential.user;
              console.log("User:",user);
              toast.success("User Signed Up Successfully")
              setLoading(false)
              setName('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')
              createDoc(user)
              navigate('/dashboard')
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage)
              setLoading(false)
              // ..
            });
            }
            else{
                toast.error("Password and Confirm Password do not match")
                setLoading(false)
            }
           
        }
        else{
            toast.error("Please fill all the fields")
            setLoading(false)
        }
    }

    function loginwithEmail(){
        console.log("Email",email);
        console.log("password",password);
        setLoading(true)
        if( email!=='' && password!==''){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
             toast.success("User Logged In Successfully")
                setLoading(false)
             navigate('/dashboard')
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              setLoading(false)
              toast.error(errorMessage)
            });
        }
        else{
            toast.error("Please fill all the fields")
            setLoading(false)
        }


    }

    async function createDoc(user){
        setLoading(true)
        if(!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if(!userData.exists()){
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date()
                });
                // toast.success("Doc Created Successfully")
                setLoading(false)
            } catch (e) {
                // toast.error(e.message)
                console.log(e.message)
                setLoading(false)
            }
        }
        else{
            // toast.error("Doc already exists")
            setLoading(false)
        }
        
    }

    function googleAuth(){
        setLoading(true)
        try {
            signInWithPopup(auth, provider)
            .then((result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;
              createDoc(user)
              navigate('/dashboard')
              // IdP data available using getAdditionalUserInfo(result)
              // ...
              toast.success("User Logged In Successfully")
            }).catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage)
            });
            
        } catch (error) {
            toast.error(error.message)  
        }
       
    }
  return (
    <>
    {loginForm ? 
        <div className='login-wrapper'>
        <h2 className='title'>Login into <span style={{color:"var(--theme"}}>FinTrack</span> </h2>
        <form>
          
             <Input 
            label="Email"
            state={email}
            setState={setEmail}
            placeholder="Johndoe@gmail.com"
            type="email"
            />
             <Input 
            label="Password"
            state={password}
            setState={setPassword}
            placeholder="Example123"
            type="password"
            />
           
            <Button 
            text={loading?"Loading..." :"Login using Email and Password"} 
            onClick={loginwithEmail} 
            disabled={loading}
            />
            <p className='p-login'>Or</p>
            <Button text={loading?"Loading...":"Login using Google"} blue={true} onClick={googleAuth} />
            <p className='p-login' style={{cursor:'pointer'}} onClick={() => setLoginForm(!loginForm)} >Or Dont Have an Account Already ?Click Here</p>
        </form>
    </div> :<div className='signup-wrapper'>
        <h2 className='title'>Sign Up on <span style={{color:"var(--theme"}}>FinTrack</span> </h2>
        <form>
            <Input 
            label="Full Name"
            state={name}
            setState={setName}
            placeholder="John Doe"
            />
             <Input 
            label="Email"
            state={email}
            setState={setEmail}
            placeholder="Johndoe@gmail.com"
            type="email"
            />
             <Input 
            label="Password"
            state={password}
            setState={setPassword}
            placeholder="Example123"
            type="password"
            />
             <Input 
            label="Confirm Password"
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder="Example123"
            type="password"
            />
            <Button 
            text={loading?"Loading..." :"Sign Up using Email and Password"} 
            onClick={signupwithEmail} 
            disabled={loading}
            />
            <p className='p-login'>Or</p>
            <Button text={loading?"Loading...":"Sign Up using Google"} blue={true} onClick={googleAuth}  />
            <p className='p-login' style={{cursor:'pointer'}} onClick={() => setLoginForm(!loginForm)}>Or Have an Account Already ? Click Here</p>
        </form>
    </div>}
    
    </>
  )
}

export default SignUpSigninComponent