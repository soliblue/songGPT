import React from "react";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon, IconButton, Menu } from "native-base";

export const SongDetailDownload = ({ songID }) => {
  const getFileURL = (type) => {
    return `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${songID}%2F${songID}.${type}?alt=media`;
  };

  const wavFileURL = getFileURL("wav");
  const abcFileURL = getFileURL("abc");
  const midiFileURL = getFileURL("mid");

  return (
    <Menu
      trigger={(triggerProps) => {
        return (
          <IconButton
            size="lg"
            icon={<Icon as={Ionicons} name="ellipsis-vertical" />}
            {...triggerProps}
          />
        );
      }}
    >
      <Menu.OptionGroup title="Download">
        <Menu.Item
          onPress={() => {
            Linking.openURL(abcFileURL);
          }}
        >
          ABC
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            Linking.openURL(midiFileURL);
          }}
        >
          MIDI
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            Linking.openURL(wavFileURL);
          }}
        >
          WAV
        </Menu.Item>
      </Menu.OptionGroup>
    </Menu>
  );
};
