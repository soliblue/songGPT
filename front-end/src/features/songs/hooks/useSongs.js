import React from "react";
import { useInfiniteQuery } from "react-query";
import {
  query,
  limit,
  getDocs,
  orderBy,
  collection,
  startAfter,
} from "firebase/firestore";
import { FirebaseContext } from "src/services/firebase.context";

export const useSongs = (itemsLimit = 6) => {
  const { firestore } = React.useContext(FirebaseContext);

  return useInfiniteQuery(
    ["songs"],
    ({ pageParam }) => {
      const baseQuery = query(
        collection(firestore, "songs"),
        orderBy("created_at", "desc"),
        limit(itemsLimit)
      );
      if (pageParam) {
        console.debug(`💬 Songs ...`);
        return getDocs(query(baseQuery, startAfter(pageParam))).then(
          (snapshot) => snapshot.docs
        );
      } else {
        console.debug(`💬 Songs`);
        return getDocs(baseQuery).then((snapshot) => snapshot.docs);
      }
    },
    {
      getNextPageParam: (snapshot) =>
        snapshot?.length > 0 ? snapshot[snapshot.length - 1] : undefined,
    }
  );
};
