import {
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import constants from '../../../config/constants';

const { colors, fonts } = constants;
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 28,
    marginLeft: 20,
    marginTop: wp('25%'),
    textAlign: 'left',

  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 15,
    marginTop: 20,
  },
  radioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    width: 22,

  },
  radioText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',

  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    width: 22,
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
});
export default styles
