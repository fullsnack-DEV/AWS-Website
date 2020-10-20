import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  dottedLine: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    bottom: 0,
    left: 50,
    width: 1,

  },
});

export default styles;
