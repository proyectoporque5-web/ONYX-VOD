import React from 'react';
import { View, Text } from 'react-native';
import { RouterProvider, useRouter } from './expo-router-mock';
import Home from '../app/index';
import Search from '../app/search';
import MovieDetail from '../app/movie/[id]';
// Import Player if available, or mock it
// import Player from '../app/player/[url]';

// Main Content Component that renders screens based on current route
const MainContent = () => {
  const { path } = useRouter();

  if (path === '/') {
    return <Home />;
  }
  
  if (path === '/search') {
    return <Search />;
  }

  if (path === '/movie/[id]') {
    return <MovieDetail />;
  }

  if (path === '/player/[url]') {
    // Basic mock for player since expo-av might not work perfectly on web without config
    // Or we can try to render the actual component if it uses web-compatible video
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Video Player Mock</Text>
      </View>
    );
  }

  return <Home />;
};

export default function App() {
  return (
    <RouterProvider>
      <View style={{ flex: 1, height: '100vh', backgroundColor: 'black' }}>
        <MainContent />
      </View>
    </RouterProvider>
  );
}
