import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, StatusBar, Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search } from 'lucide-react-native';
import { MovieCard } from '../src/components/MovieCard';
import { 
  getTrendingMovies, 
  getActionMovies, 
  getComedyMovies, 
  getHorrorMovies, 
  getSciFiMovies,
  getDramaMovies,
  getThrillerMovies,
  getRomanceMovies,
  getFamilyMovies,
  getDocumentaries,
  getAnimationMovies,
  getMovieDetails,
  getLogo
} from '../src/api/tmdb';

const { width, height } = Dimensions.get('window');
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280'; // Optimized backdrop size
const LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [drama, setDrama] = useState([]);
  const [thriller, setThriller] = useState([]);
  const [horror, setHorror] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [romance, setRomance] = useState([]);
  const [family, setFamily] = useState([]);
  const [animation, setAnimation] = useState([]);
  const [documentary, setDocumentary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLogo, setHeroLogo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData, 
          actionData, 
          comedyData, 
          dramaData,
          thrillerData,
          horrorData, 
          scifiData,
          romanceData,
          familyData,
          animationData,
          documentaryData
        ] = await Promise.all([
          getTrendingMovies(),
          getActionMovies(),
          getComedyMovies(),
          getDramaMovies(),
          getThrillerMovies(),
          getHorrorMovies(),
          getSciFiMovies(),
          getRomanceMovies(),
          getFamilyMovies(),
          getAnimationMovies(),
          getDocumentaries()
        ]);

        setTrending(trendingData.results);
        setAction(actionData.results);
        setComedy(comedyData.results);
        setDrama(dramaData.results);
        setThriller(thrillerData.results);
        setHorror(horrorData.results);
        setScifi(scifiData.results);
        setRomance(romanceData.results);
        setFamily(familyData.results);
        setAnimation(animationData.results);
        setDocumentary(documentaryData.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroMovie = trending[0];

  useEffect(() => {
    if (heroMovie) {
      getMovieDetails(heroMovie.id).then(data => {
        setHeroLogo(getLogo(data));
      }).catch(e => console.log(e));
    }
  }, [heroMovie]);

  const renderMovieItem = useCallback(({ item, index, sectionTitle }) => {
    // Check if this is the trending section
    const isTrendingSection = sectionTitle === "Tendencias Globales";
    return (
      <MovieCard 
        item={item} 
        rank={index + 1} 
        isTrending={isTrendingSection} 
      />
    );
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  const renderSection = (title, data) => (
    <View className="mb-6">
      <Text className="text-white text-lg font-bold mb-3 px-4" style={{ color: 'white', fontSize: 18, fontWeight: 'bold', paddingLeft: 10, marginBottom: 5 }}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item, index }) => renderMovieItem({ item, index, sectionTitle: title })}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
        removeClippedSubviews={true}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Logo and Search */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#E50914', fontSize: 28, fontWeight: '900', letterSpacing: 2 }}>ONYX</Text>
        <Link href="/search" asChild>
          <TouchableOpacity>
            <Search color="white" size={28} />
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView className="flex-1 bg-black" style={{ flex: 1, backgroundColor: 'black' }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Banner */}
        {heroMovie && (
          <View className="relative mb-8">
            <Image
              source={{ uri: `${BACKDROP_BASE_URL}${heroMovie.backdrop_path || heroMovie.poster_path}` }}
              style={{ width: width, height: 450 }}
              resizeMode="cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', '#000000']}
              style={{ 
                width: width, 
                height: 450, 
                position: 'absolute', 
                bottom: 0 
              }}
            >
               <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20, paddingBottom: 40 }}>
                  {heroLogo ? (
                    <Image 
                      source={{ uri: `${LOGO_BASE_URL}${heroLogo}` }}
                      style={{ width: width * 0.8, height: 120, marginBottom: 20, alignSelf: 'center' }}
                      resizeMode="contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Text className="text-white text-4xl font-extrabold mb-2 text-center shadow-lg">
                      {heroMovie.title}
                    </Text>
                  )}
                  
                  <View className="flex-row justify-center space-x-4 mb-6">
                     {heroMovie.genre_ids?.slice(0, 3).map((genreId, index) => (
                       <Text key={index} className="text-gray-300 text-xs">• {genreId} •</Text>
                     ))}
                  </View>
  
                  <View className="flex-row justify-center space-x-4 gap-4">
                    <Link href={`/movie/${heroMovie.id}`} asChild>
                      <TouchableOpacity 
                        className="bg-white py-2 px-6 rounded flex-row items-center"
                      >
                        <Text className="text-black font-bold text-lg">▶ Reproducir</Text>
                      </TouchableOpacity>
                    </Link>
                    
                    <TouchableOpacity 
                      className="bg-gray-600/80 py-2 px-6 rounded flex-row items-center"
                    >
                      <Text className="text-white font-bold text-lg">+ Mi Lista</Text>
                    </TouchableOpacity>
                  </View>
               </View>
            </LinearGradient>
          </View>
        )}
  
        {/* Movie Rows */}
        {renderSection("Tendencias Globales", trending)}
        {renderSection("Acción y Aventura", action)}
        {renderSection("Comedias", comedy)}
        {renderSection("Drama y Emoción", drama)}
        {renderSection("Suspenso y Thriller", thriller)}
        {renderSection("Cine de Terror", horror)}
        {renderSection("Ciencia Ficción y Fantasía", scifi)}
        {renderSection("Romance", romance)}
        {renderSection("Para toda la Familia", family)}
        {renderSection("Animación", animation)}
        {renderSection("Documentales", documentary)}
  
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
