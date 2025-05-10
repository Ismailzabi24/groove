const STORAGE_KEY = 'groove_custom_albums';

export const saveAlbums = (albums) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
};

export const loadAlbums = () => {
  const albums = localStorage.getItem(STORAGE_KEY);
  return albums ? JSON.parse(albums) : [];
};

export const addAlbum = (album) => {
  const albums = loadAlbums();
  albums.push(album);
  saveAlbums(albums);
  return albums;
};

export const updateAlbum = (updatedAlbum) => {
  const albums = loadAlbums();
  const index = albums.findIndex(album => album.id === updatedAlbum.id);
  if (index !== -1) {
    albums[index] = updatedAlbum;
    saveAlbums(albums);
  }
  return albums;
};

export const deleteAlbum = (albumId) => {
  const albums = loadAlbums();
  const filteredAlbums = albums.filter(album => album.id !== albumId);
  saveAlbums(filteredAlbums);
  return filteredAlbums;
}; 