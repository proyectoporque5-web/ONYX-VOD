import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Text, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react-native';
import { searchMovies, getTrendingMovies } from '../src/api/tmdb';

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'; // Optimized for grid

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch top searches (trending) on mount
    const fetchTopSearches = async () => {
      try {
        const data = await getTrendingMovies();
        setTopSearches(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTopSearches();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const data = await searchMovies(query);
          setResults(data.results);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const renderItem = ({ item }) => (
    <Link href={`/movie/${item.id}`} asChild>
      <TouchableOpacity style={{ margin: 4 }}>
        <Image
          source={{ uri: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/150' }}
          style={{ width: (width / 3) - 10, height: 160, borderRadius: 8 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </Link>
  );

  const renderTopSearchItem = ({ item }) => (
    <Link href={`/movie/${item.id}`} asChild>
      <TouchableOpacity className="flex-row items-center mb-4" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Image
          source={{ uri: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/150' }}
          style={{ width: 120, height: 70, borderRadius: 4, marginRight: 12 }}
          resizeMode="cover"
        />
        <Text className="text-white text-base font-semibold flex-1" style={{ color: 'white', fontSize: 16, fontWeight: '600', flex: 1 }}>{item.title}</Text>
        <Text className="text-white text-2xl" style={{ color: 'white', fontSize: 24 }}>▶</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="flex-1 bg-black pt-12 px-4" style={{ flex: 1, backgroundColor: 'black', paddingTop: 48, paddingHorizontal: 16 }}>
      <View className="flex-row items-center mb-4" style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => router.back()} className="mr-4" style={{ marginRight: 16 }}>
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 12 }}>
          <SearchIcon color="#9CA3AF" size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-white p-3"
            style={{ flex: 1, color: 'white', paddingVertical: 12 }}
            placeholder="Buscar películas, series, géneros..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E50914" className="mt-8" style={{ marginTop: 32 }} />
      ) : (
        <>
          {query.length === 0 ? (
            <View style={{ flex: 1 }}>
              <Text className="text-white text-xl font-bold mb-4" style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Búsquedas populares</Text>
              <FlatList
                data={topSearches}
                renderItem={renderTopSearchItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={{ paddingBottom: 20 }}
              initialNumToRender={9}
              maxToRenderPerBatch={9}
              windowSize={3}
              ListEmptyComponent={
                <Text className="text-gray-400 text-center mt-8" style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 32 }}>No se encontraron resultados</Text>
              }
            />
          )}
        </>
      )}
    </View>
  );
}
