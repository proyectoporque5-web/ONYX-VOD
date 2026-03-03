import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, FlatList, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Play, Info } from 'lucide-react-native';
import { getMovieDetails, getLogo } from '../../src/api/tmdb';
import { resolveMovieStream } from '../../src/utils/resolver';

const { width, height } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'; // Optimized for lists
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280'; // Optimized backdrop
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185'; // Optimized profile
const LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [logoPath, setLogoPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [servers, setServers] = useState([]);
  const [isSearchingLinks, setIsSearchingLinks] = useState(false);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setLogoPath(getLogo(data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handlePlay = async () => {
    setIsSearchingLinks(true);
    try {
      const imdbId = movie.external_ids?.imdb_id;
      const streams = await resolveMovieStream(id, imdbId);
      
      if (streams.length === 1) {
        const encodedUrl = encodeURIComponent(streams[0].url);
        router.push(`/player/${encodedUrl}`);
      } else if (streams.length > 1) {
        setServers(streams);
        setModalVisible(true);
      } else {
        // Handle no streams found (optional: show alert)
        console.log("No streams found");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingLinks(false);
    }
  };

  const handleServerPress = (url) => {
    setModalVisible(false);
    const encodedUrl = encodeURIComponent(url);
    router.push(`/player/${encodedUrl}`);
  };

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlayingTrailer(false);
    }
  }, []);

  if (loading || !movie) {
    return (
      <View className="flex-1 bg-black justify-center items-center" style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 10);
  const similar = movie.similar?.results?.slice(0, 6);

  return (
    <View className="flex-1 bg-black" style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative">
          {playingTrailer && trailer ? (
            <View style={{ width: width, height: 250, backgroundColor: 'black' }}>
              <YoutubeIframe
                height={250}
                play={true}
                videoId={trailer.key}
                onChangeState={onStateChange}
              />
            </View>
          ) : (
            movie.backdrop_path && (
              <Image
                source={{ uri: `${BACKDROP_BASE_URL}${movie.backdrop_path || movie.poster_path}` }}
                style={{ width: '100%', height: 300 }}
                resizeMode="cover"
              />
            )
          )}
          
          {!playingTrailer && (
            <View 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(0,0,0,0.3)' 
              }} 
            />
          )}

          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ position: 'absolute', top: 40, left: 20, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Atrás</Text>
          </TouchableOpacity>
        </View>

        <View className="p-4" style={{ padding: 16 }}>
          {logoPath ? (
            <Image 
              source={{ uri: `${LOGO_BASE_URL}${logoPath}` }}
              style={{ width: width * 0.6, height: 100, marginBottom: 16, alignSelf: 'center' }}
              resizeMode="contain"
            />
          ) : (
            <Text className="text-white text-3xl font-bold mb-2" style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
              {movie.title}
            </Text>
          )}

          {/* Meta Tags */}
          <View className="flex-row items-center mb-4 space-x-4" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
            <Text className="text-green-500 font-bold" style={{ color: '#46d369', fontWeight: 'bold' }}>98% Coincidencia</Text>
            <Text className="text-gray-400" style={{ color: '#9CA3AF' }}>{movie.release_date?.split('-')[0]}</Text>
            <View className="bg-gray-700 px-2 rounded" style={{ backgroundColor: '#374151', paddingHorizontal: 6, borderRadius: 4 }}>
              <Text className="text-white text-xs" style={{ color: 'white', fontSize: 12 }}>HD</Text>
            </View>
            <View className="border border-gray-500 px-1 rounded" style={{ borderWidth: 1, borderColor: '#6B7280', paddingHorizontal: 4, borderRadius: 2 }}>
              <Text className="text-gray-400 text-xs" style={{ color: '#9CA3AF', fontSize: 12 }}>5.1</Text>
            </View>
          </View>

          {/* Primary Action Button: Reproducir */}
          <TouchableOpacity
            onPress={handlePlay}
            disabled={isSearchingLinks}
            className="bg-[#E50914] py-3 rounded-md mb-3 items-center flex-row justify-center"
            style={{ backgroundColor: '#E50914', paddingVertical: 12, borderRadius: 4, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center' }}
          >
            {isSearchingLinks ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Play color="white" size={24} fill="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-lg uppercase" style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase' }}>Reproducir</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Secondary Action Button: Ver Tráiler */}
          {trailer && (
            <TouchableOpacity
              onPress={() => setPlayingTrailer(true)}
              className="bg-gray-700 py-3 rounded-md mb-6 items-center flex-row justify-center"
              style={{ backgroundColor: '#262626', paddingVertical: 12, borderRadius: 4, alignItems: 'center', marginBottom: 24, flexDirection: 'row', justifyContent: 'center' }}
            >
              <Info color="white" size={24} style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-lg uppercase" style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase' }}>Ver Tráiler</Text>
            </TouchableOpacity>
          )}

          <Text className="text-white text-lg font-bold mb-2" style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Sinopsis</Text>
          <Text className="text-gray-300 leading-6 mb-6" style={{ color: '#D1D5DB', lineHeight: 24, marginBottom: 24 }}>
            {movie.overview}
          </Text>

          {cast && cast.length > 0 && (
            <View className="mb-6" style={{ marginBottom: 24 }}>
              <Text className="text-white text-lg font-bold mb-4" style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Reparto</Text>
              <FlatList
                data={cast}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={3}
                renderItem={({ item }) => (
                  <View className="mr-4 items-center w-20" style={{ marginRight: 16, alignItems: 'center', width: 80 }}>
                    <Image
                      source={{ uri: item.profile_path ? `${PROFILE_BASE_URL}${item.profile_path}` : 'https://via.placeholder.com/100' }}
                      className="w-16 h-16 rounded-full mb-2 bg-gray-800"
                      style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 5 }}
                      resizeMode="cover"
                    />
                    <Text className="text-gray-300 text-xs text-center" numberOfLines={2} style={{ color: '#D1D5DB', fontSize: 12, textAlign: 'center' }}>
                      {item.name}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {similar && similar.length > 0 && (
            <View className="mb-6" style={{ marginBottom: 24 }}>
              <Text className="text-white text-lg font-bold mb-4" style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Títulos Similares</Text>
              <FlatList
                data={similar}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                windowSize={2}
                renderItem={({ item }) => (
                  <Link href={`/movie/${item.id}`} asChild>
                    <TouchableOpacity className="mr-4" style={{ marginRight: 16 }}>
                      <Image
                        source={{ uri: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/150' }}
                        className="w-28 h-40 rounded-md bg-gray-800"
                        style={{ width: 100, height: 150, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </Link>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <View className="bg-gray-900 rounded-t-3xl p-6 h-1/2" style={{ backgroundColor: '#111827', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '50%' }}>
            <View className="flex-row justify-between items-center mb-6" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text className="text-white text-xl font-bold" style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Seleccionar Servidor</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-400 text-lg" style={{ color: '#9CA3AF', fontSize: 18 }}>Cerrar</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={servers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleServerPress(item.url)}
                  className="bg-gray-800 p-4 rounded-lg mb-3 flex-row justify-between items-center"
                  style={{ backgroundColor: '#1F2937', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text className="text-white font-semibold" style={{ color: 'white', fontWeight: '600' }}>{item.server}</Text>
                  <Text className="text-red-500" style={{ color: '#E50914' }}>Ver</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
