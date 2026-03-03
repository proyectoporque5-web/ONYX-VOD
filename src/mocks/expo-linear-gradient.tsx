import React from 'react';
import { View, StyleSheet } from 'react-native';

export const LinearGradient = ({ colors, style, start, end, locations, ...props }) => {
  // Flatten style to handle arrays
  const flatStyle = StyleSheet.flatten(style) || {};
  
  // Default to top-to-bottom (180deg) which matches RN LinearGradient default
  // colors is an array of strings
  const gradientColors = colors.join(', ');
  
  // Add backgroundImage to the style
  const gradientStyle = {
    ...flatStyle,
    backgroundImage: `linear-gradient(to bottom, ${gradientColors})`,
  };

  return (
    <View style={gradientStyle} {...props} />
  );
};
