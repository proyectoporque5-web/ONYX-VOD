import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewPlayer() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <WebView 
        source={{ uri: url }} 
        style={{ flex: 1, backgroundColor: 'black' }}
        allowsFullscreenVideo={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 50,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
