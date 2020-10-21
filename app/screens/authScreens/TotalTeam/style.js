import {
  StyleSheet,

} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'

const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6.5%'),
    marginTop: 20,
    textAlign: 'center',
    width: wp('60%'),
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  foundText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('6.5%'),
  },
  groupsImg: {
    height: 60,
    resizeMode: 'contain',

    width: 60,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
