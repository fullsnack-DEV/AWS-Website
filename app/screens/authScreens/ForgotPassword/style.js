import {
  StyleSheet,
} from 'react-native';

import {
  heightPercentageToDP as hp,
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
  forgotText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginBottom: hp('11%'),
    marginTop: hp('0.5%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
});
export default styles
