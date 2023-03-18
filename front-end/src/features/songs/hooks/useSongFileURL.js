export const useSongFileURL = (songID, type) => {
  return `https://firebasestorage.googleapis.com/v0/b/songgpt-xyz.appspot.com/o/songs%2F${songID}%2F${songID}.${type}?alt=media`;
};
