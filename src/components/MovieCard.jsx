import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export const MovieCard = ({ item, rank, isTrending }) => {
  const showRank = isTrending && rank && rank <= 10;

  return (
    <Link href={`/movie/${item.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={styles.cardContent}>
          {showRank && (
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{rank}</Text>
            </View>
          )}
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
            style={[
              styles.poster,
              showRank && styles.posterWithRank
            ]}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  },
  rankContainer: {
    position: 'absolute',
    left: -20,
    bottom: -25,
    zIndex: 10,
    width: 100,
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  rankText: {
    fontSize: 110,
    fontWeight: '900',
    color: '#000000',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    includeFontPadding: false,
    lineHeight: 110,
    // Note: React Native doesn't support text stroke natively without libraries like react-native-svg or custom native modules.
    // Using textShadow to simulate outline.
  },
  poster: {
    width: 110,
    height: 160,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  posterWithRank: {
    marginLeft: 50, // Push poster to the right to make space for the number
  },
});
