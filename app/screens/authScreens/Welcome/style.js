import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../Constants/Colors';
import constants from '../../../config/constants';

const {
  fonts,
} = constants;
const styles = StyleSheet.create({
  allButton: {
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  alreadyMemberText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  alreadyView: {
    alignSelf: 'center',
    bottom: hp('4%'),
    position: 'absolute',
  },
  background: {
    height: hp('100%'),
    position: 'absolute',
    resizeMode: 'stretch',
    width: wp('100%'),
  },
  imgWithText: {
    flexDirection: 'row',
    paddingLeft: 80,
  },
  logo: {
    alignContent: 'center',
    height: hp('15%'),
    marginBottom: hp('4%'),
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: hp('10%'),
  },
  logoTagLine: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  logoTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('9%'),
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  signUpImg: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  signUpText: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 17,
    height: 50,
    padding: 12,
  },
  welcome: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 25,
    marginTop: hp('5%'),
    paddingLeft: wp('10%'),
    textAlign: 'left',
  },
  welcomeText: {
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
    fontSize: 18,
    marginRight: wp('5%'),
    marginTop: hp('1%'),
    paddingLeft: wp('10%'),
    textAlign: 'left',
  },
});
export default styles;
