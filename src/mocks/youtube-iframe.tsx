import React from 'react';

const YoutubeIframe = ({ videoId, height, play, onChangeState }) => {
  return (
    <iframe
      width="100%"
      height={height}
      src={`https://www.youtube.com/embed/${videoId}?autoplay=${play ? 1 : 0}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YoutubeIframe;
