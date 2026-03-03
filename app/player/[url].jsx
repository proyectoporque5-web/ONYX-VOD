import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Player() {
  const { url } = useLocalSearchParams();
  const decodedUrl = decodeURIComponent(url);
  const router = useRouter();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    async function lockLandscape() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    lockLandscape();

    return () => {
      async function unlockOrientation() {
        await ScreenOrientation.unlockAsync();
      }
      unlockOrientation();
    };
  }, []);

  const handleNextEpisode = () => {
    // In a real app, this would fetch the next episode URL
    // For now, we simulate by restarting or just going back
    if (videoRef.current) {
      videoRef.current.replayAsync();
    }
  };

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(status.positionMillis + 85000); // Skip 85 seconds
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Video
        ref={videoRef}
        style={styles.video}
        source={{
          uri: decodedUrl,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={status => setStatus(status)}
        onError={(e) => console.log('Video Error:', e)}
      />
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>

      {/* Skip Intro Button - Show during first 2 minutes */}
      {status.positionMillis < 120000 && status.positionMillis > 5000 && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkipIntro}
        >
          <Text style={styles.buttonText}>Saltar Intro</Text>
        </TouchableOpacity>
      )}

      {/* Next Episode Button - Show when less than 60 seconds remaining */}
      {status.durationMillis && status.positionMillis && (status.durationMillis - status.positionMillis < 60000) && (
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNextEpisode}
        >
          <Text style={styles.buttonText}>Siguiente Episodio</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    zIndex: 10,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    zIndex: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
