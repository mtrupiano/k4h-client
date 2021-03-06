import  { React, useState, useEffect } from 'react';
import { Grommet, Box, Text, Anchor } from 'grommet';
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Home from "./pages/Home";
import Tag from "./pages/Tag";
import Profile from "./pages/ProfilePage";
import Question from "./pages/Question";
import User from "./pages/User";
import UserHome from './pages/UserHome';
import Ask from './pages/Ask';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Browse from './pages/Browse';
import NotFound from './pages/NotFound';
import Service from './pages/Service';
import MessageView from './pages/MessageView';
import Splash from './pages/Splash';
import UserNavbar from './components/UserNavbar/index';
import LoginNavbar from './components/LoginNavbar'
import API from "./utils/API";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const history = useHistory();

  const [formObj, setFormObj] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  const [userState, setUserState] = useState({
    id: "",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    isSignedIn: false,
    token: "",
    portrait: "qi6o2g0haw3vfcjetmmn"
  });

  const handleInputChanged = event => {
    const { name, value } = event.target;
    setFormObj({ ...formObj, [name]: value })
  }

  const handleSignUpSubmit = cb => {

    API.signUp(formObj).then(response => {
      setUserState({
        id: response.data.id,
        userName: response.data.user.userName,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        bio: response.data.user.bio,
        isSignedIn: true,
        token: response.data.token,
        portrait: response.data.user.portrait        
      });
      localStorage.setItem("token", response.data.token);  
      localStorage.setItem("portrait", response.data.portrait);  
      
      cb();    
    }).catch(err => {
      console.log(err);
      localStorage.clear("token")
      localStorage.clear("portrait")
    });
  }

  const handleSignInSubmit = cb => {    

    API.signIn(formObj).then(response => {
      setUserState({
        id: response.data.user.id,
        userName: response.data.user.userName,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        bio: response.data.user.bio,
        portrait: localStorage.getItem("portrait") || response.data.user.portrait,
        isSignedIn: true,
        token: response.data.token
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("portrait", response.data.user.portrait);
      cb();
    }).catch(err => {
      console.log(err);
      localStorage.clear("token")
      localStorage.clear("portrait")
    });
  }

  useEffect(()=> {
    const token = localStorage.getItem("token");
    if(token){
      API.authenticate(token).then(response => {
        setUserState({
          id: response.data.user.id,
          userName: response.data.user.userName,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          bio: response.data.user.bio,
          portrait: localStorage.getItem("portrait") || response.data.user.portrait,
          isSignedIn: true,
          token: response.data.token
        });
      }).catch(err => {
        console.log(err);
        localStorage.clear("token")
        localStorage.clear("portrait")
      });
    }
  }, [])

  const globalGrommetTheme = {
    global: {
      focus: {
        border: {
          color :'rgba(0,0,0,0)'
        }
      },
      button: {
        active: {
          background: {
            color: '#FCE181'
          }
        }
      }
    }
  }

  const handleGuestGoToSignUp = () => {
    setUserState({
      id: "",
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      isSignedIn: false,
      token: "",
      portrait: "qi6o2g0haw3vfcjetmmn"
    });
  }

  return (
    <Router>
      <Grommet theme={globalGrommetTheme}>


      <Switch>

        <Route exact path="/">
          <Home userState={ userState.isSignedIn ? userState : {} } />
        </Route>
        <Route exact path="/home">
          <Home userState={ userState.isSignedIn ? userState : {} } />
        </Route>

        <Route exact path="/splash">
          {userState.isSignedIn ? 
            <Redirect to='/home' /> : <Splash setUserState={setUserState} />}
        </Route>
        <Route exact path='/splash/:tab'>
            {userState.isSignedIn ?
              <Redirect to='/home' /> : <Splash setUserState={setUserState} />}
        </Route>
        <Route exact path="/browse">
          <Browse userState={userState}/>
        </Route>
        <Route exact path="/profile/:id">
          <Profile userState={userState} setUserState={setUserState}/>
        </Route>
        <Route exact path="/tag/:id">
          <Tag userState={userState}/>
        </Route>
        <Route exact path="/question/:id">
          <Question userState={userState}/>
        </Route>
        <Route exact path="/users/:id">
          <User />
        </Route>
        <ProtectedRoute exact path="/ask" isSignedIn={userState.isSignedIn}>
          <Ask pad={{ horizontal: '10%' }} showBackButton showNav userState={userState}/>
        </ProtectedRoute>
        <Route path="/service/:id">
          <Service userState={userState}/>
        </Route>
        <Route exact path="/signin">
          <Signin
            handleInputChanged={handleInputChanged} 
            handleSubmit={handleSignInSubmit} 
            formObj={formObj} 
            setFormObj={setFormObj} 
            userState={userState} 
            setUserState={setUserState}  />
        </Route>
        <Route exact path="/signup">
          <Signup 
            handleInputChanged={handleInputChanged} 
            handleSubmit={handleSignUpSubmit} 
            formObj={formObj} 
            setFormObj={setFormObj} 
            userState={userState} 
            setUserState={setUserState} 
          />
        </Route>
        <Route exact path='/messages/:threadId'>
          <MessageView userState={userState} />
        </Route> 
        <Route exact path='/messages'>
          <MessageView userState={userState} />
        </Route> 

        {/* <ProtectedRoute exact path="/messages/:threadId" isSignedIn={userState.isSignedIn}>
          <MessageView userState={userState} />
        </ProtectedRoute> */}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      </Grommet>
      { userState.userName === 'Guest' && 
        <Box 
          width={{ max: '400px', min: 'auto' }}
          margin={{ right: 'small' }}
          background='rgba(0,0,0,0.1)' 
          pad='small' 
          round='small'
          style={{ position: 'fixed', bottom: '10px', right: '0px' }} 
        >
          <Text color='rgba(0,0,0,0.4)'>
            You are signed in as a guest. <Anchor pointerEvents='auto' href='/splash/signup' onClick={handleGuestGoToSignUp}>Click here</Anchor> to create an account for yourself.
          </Text>
        </Box> }
      
    </Router>
  );
}

export default App;
