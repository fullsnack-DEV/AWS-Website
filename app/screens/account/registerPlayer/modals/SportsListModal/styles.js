import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    padding: 0,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flex: 1,
  },
  card: {
    backgroundColor: colors.whiteColor,
    height: Dimensions.get('window').height - 40,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  headerRow: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 17,
    paddingBottom: 10,
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
    lineHeight: 24,
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
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  container: {
    paddingHorizontal: 30,
    flex: 1,

  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    marginBottom: 7,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  listLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
  },
  listIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineSeparator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
});

export default styles;
