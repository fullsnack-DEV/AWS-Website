import {
  StyleSheet,

} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';

const {
  colors, fonts,
} = constants;
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('2%'),
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sportImg: {
    width: wp('5%'),
    height: hp('4%'),
    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  sportList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  sportText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginBottom: hp('4%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
    width: wp('70%'),
  },
});
export default styles;
