import React from "react";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

export const FirebaseContext = React.createContext(null);

export const FirebaseContextProvider = ({ children }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyDMGmgKjMbbUyzjw8aNfNMvfduY4V5bEvk",
    authDomain: "songgpt-xyz.firebaseapp.com",
    projectId: "songgpt-xyz",
    storageBucket: "songgpt-xyz.appspot.com",
    messagingSenderId: "1028758828362",
    appId: "1:1028758828362:web:aff42d2756621f8d777db3",
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const analytics = getAnalytics(app);
  console.debug("🔥  Firestore + Storage + Anlaytics");

  return (
    <FirebaseContext.Provider
      value={{
        app,
        storage,
        firestore,
        analytics,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
