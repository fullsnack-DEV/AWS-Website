import {StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 17,
    paddingTop: 8,
    paddingBottom: 13,
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
  backIconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  completeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.localHomeGreenGradientEnd,
    alignSelf: 'center',
  },
  congratsText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 24,
    paddingBottom: 10,
  },
  congratsSportText: {
    alignSelf: 'center',
    color: colors.darkYellowColor,
    fontFamily: fonts.RBold,
    fontSize: 24,
    paddingBottom: 10,
  },
  subHeading: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 15,
    marginTop: 20,
  },
  info: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    marginBottom: 25,
  },
  linkButtonText: {
    fontSize: 14,
    lineHeight: 21,
    textDecorationLine: 'underline',
    color: colors.googleColor,
  },
  divider: {
    height: 7,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  venue: {
    paddingHorizontal: 13,
    marginTop: 15,
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: widthPercentageToDP('100%'),
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 20,
    resizeMode: 'contain',
  },
});

export default styles;
