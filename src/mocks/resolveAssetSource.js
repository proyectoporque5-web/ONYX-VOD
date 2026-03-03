
const resolveAssetSource = (source) => {
  if (typeof source === 'object') {
    return source;
  }
  if (typeof source === 'number') {
    return { uri: '', width: 0, height: 0 };
  }
  return null;
};

resolveAssetSource.pickScale = () => 1;
resolveAssetSource.setCustomSourceTransformer = () => {};

export default resolveAssetSource;
