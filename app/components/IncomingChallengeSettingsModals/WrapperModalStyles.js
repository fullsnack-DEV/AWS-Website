import {StyleSheet} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    // justifyContent: 'flex-end',
    paddingTop: 50,
  },
  card: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    // height: Dimensions.get('window').height - 50,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  divider: {
    height: 2,
    backgroundColor: colors.thinDividerColor,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 19,
    flex: 1,
  },
});

export default styles;
