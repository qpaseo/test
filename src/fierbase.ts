import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZU1rwstssre1gaNtr3rjyUZr8IKXDYaw",
  authDomain: "nwitter-reloaded-3ffbb.firebaseapp.com",
  projectId: "nwitter-reloaded-3ffbb",
  storageBucket: "nwitter-reloaded-3ffbb.firebasestorage.app",
  messagingSenderId: "393110051990",
  appId: "1:393110051990:web:3ae5344de53e8829eff6b7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
