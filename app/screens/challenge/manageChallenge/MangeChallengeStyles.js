import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const layout = Dimensions.get('window');
const styles = StyleSheet.create({
  greyContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: colors.textFieldBackground,
    margin: 15,
    borderRadius: 5,
  },
  greyContainerText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  textButtonContainer: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 25,
  },
  textButton: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.googleColor,
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  nextArrow: {
    width: 8,
    height: 14,
    marginLeft: 15,
  },
  separatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    marginVertical: 15,
  },
  backIcon: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 6,
    paddingTop: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  loadingContainer: {
    width: layout.width,
    height: layout.height,
    position: 'absolute',
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export default styles;
