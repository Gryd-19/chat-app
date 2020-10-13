import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
firebase.initializeApp({
  apiKey: "AIzaSyBBq1VEiIH2gIr7KYA0ZkCqbjZ24d8pev8",
  authDomain: "chat-app-bd14b.firebaseapp.com",
  databaseURL: "https://chat-app-bd14b.firebaseio.com",
  projectId: "chat-app-bd14b",
  storageBucket: "chat-app-bd14b.appspot.com",
  messagingSenderId: "352401354096",
  appId: "1:352401354096:web:dbf4a896d7c75c74bb73b5",
  measurementId: "G-CHWVFKST03"
});
const auth = firebase.auth();
const firestore = firebase.firestore();
//main app
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>Chat App <SignOut /></header>
      <section>{user ? <Chat /> : <SignIn />}</section>
    </div>
  );
}
//sign in
function SignIn() {
  const SignGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider;
    auth.signInWithPopup(provider);
  }
  return (<button onClick={SignGoogle}>Sign In</button>);
}
//sign out
function SignOut() {
  console.log(auth.currentUser);
  return auth.currentUser && (<button onClick={() => auth.signOut()}>Sign Out</button>);
}
//chat
function Chat() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limitToLast(25);
  const [messages] = useCollectionData(query, { "idField": 'id' });
  const [formValue, setFormValue] = useState('');
  const dummy=useRef();
  //submit new
  const submitMessage = async (e) => {
    e.preventDefault();
    if(formValue!=''){
      const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({behavior:'smooth'});
    }
    
  };
  //render
  return (
    <div class=".chat">
      <main >
        {messages && messages.map(m => <ChatMess m={m} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={submitMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type={"submit"}>Send</button>
      </form>

    </div>);
}
//chat message comp
function ChatMess(props) {
  const { text, uid, photoURL } = props.m;
  const messClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}


export default App;
