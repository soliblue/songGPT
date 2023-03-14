import React from "react";
import { useQuery } from "react-query";
import { doc, getDoc, collection } from "firebase/firestore";
// internal
import { FirebaseContext } from "src/services/firebase.context";

export const useSong = (songID) => {
  const { firestore } = React.useContext(FirebaseContext);

  return useQuery(
    ["song", songID],
    () => {
      console.debug(`💬 Song ${songID}`);
      return getDoc(doc(collection(firestore, "songs"), songID)).then((doc) =>
        doc.data()
      );
    },
    {
      onError: (error) => console.error(error),
      enabled: !!songID,
    }
  );
};
