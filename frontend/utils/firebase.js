import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// console.log("API Key:", import.meta.env.VITE_FIREBASE_APIKEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "lmsauth-2af7e.firebaseapp.com",
  projectId: "lmsauth-2af7e",
  storageBucket: "lmsauth-2af7e.appspot.com",
  messagingSenderId: "747433874765",
  appId: "1:747433874765:web:f26c19071d713b38481304",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
