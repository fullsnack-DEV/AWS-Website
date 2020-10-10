import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../config/constants';
const {colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextButton: {
    width: '90%',
    height: 45,
    alignSelf: 'center',
    marginTop: wp('12%'),
    borderRadius: 30,
    marginBottom: 40,
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: wp('4%'),
    fontFamily: fonts.RBold,
    marginVertical: 10,
  },
  membershipText: {
    fontSize: wp('5%'),
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginTop: 20,
    color: colors.lightBlackColor,
  },
  whoJoinText: {
    fontSize: wp('4%'),
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    color: colors.lightBlackColor,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    tintColor: colors.radioButtonColor,
    alignSelf: 'center',
  },
  unSelectRadioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    alignSelf: 'center',
  },
  radioButtonView: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  radioText: {
    fontSize: wp('4%'),
    marginLeft: 15,
    alignSelf: 'center',
    marginRight: 15,
    color: colors.lightBlackColor,
  },
});

export default styles;
