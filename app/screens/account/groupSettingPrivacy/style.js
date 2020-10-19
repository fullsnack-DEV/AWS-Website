import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import constants from '../../../config/constants';

const {
  colors, fonts,
} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  membershipText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    // tintColor: colors.radioButtonColor,
    alignSelf: 'center',
  },
  radioText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    marginLeft: 15,
    marginRight: 15,
  },
  unSelectRadioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    // tintColor: colors.grayColor,
    alignSelf: 'center',
  },
  whoJoinText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 10,
  },
});

export default styles;
