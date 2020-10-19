import {
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    resizeMode: 'stretch',
    width: wp('100%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  profile: {
    alignContent: 'center',
    alignSelf: 'center',
    height: hp('25%'),
    marginBottom: hp('3%'),
    marginTop: hp('3%'),
    resizeMode: 'contain',
    width: wp('25%'),
  },
});
export default styles;
