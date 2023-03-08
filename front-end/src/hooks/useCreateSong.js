import React from "react";
import { Toast } from "native-base";
import { useMutation, useQueryClient } from "react-query";
import { AxiosContext } from "../services/axios.context";

export const useCreateSong = () => {
  const { client } = React.useContext(AxiosContext);

  const queryClient = useQueryClient();

  return useMutation(
    (prompt) =>
      client.post(`songs/`, {
        prompt: prompt,
      }),
    {
      onSuccess: (resp) => {
        Toast.show({
          title: "Song created successfully 🎶",
        });
        queryClient.refetchQueries(["songs"]);
      },
      onError: (error) => {
        console.error(error.response?.data);
        Toast.show({
          title: "Something went wrong 😢 ...",
        });
      },
    }
  );
};
