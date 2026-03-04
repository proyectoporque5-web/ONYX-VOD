import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const storedHistory = await AsyncStorage.getItem('history');
      
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const addToFavorites = async (movie) => {
    try {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites', error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      const newFavorites = favorites.filter(m => m.id !== movieId);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(m => m.id === movieId);
  };

  const addToHistory = async (movie) => {
    try {
      // Remove if already exists to avoid duplicates and move to top
      const filteredHistory = history.filter(m => m.id !== movie.id);
      const newHistory = [movie, ...filteredHistory].slice(0, 20); // Keep last 20
      setHistory(newHistory);
      await AsyncStorage.setItem('history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  };

  return (
    <UserContext.Provider value={{
      favorites,
      history,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      addToHistory
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
