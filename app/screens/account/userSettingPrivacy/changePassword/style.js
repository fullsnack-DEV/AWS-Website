import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../config/constants';

const {
  colors, fonts,
} = constants;

const styles = StyleSheet.create({
  fieldTitle: {
    marginTop: hp('2%'),
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  fieldView: {
    marginTop: 15,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',

  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '92%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
  passwordEyes: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    width: 22,
  },
  passwordView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,

    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),

  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    marginBottom: 25,
    marginTop: 40,
    width: wp('92%'),
  },
  textInput: {

    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.8%'),
    height: 40,
    paddingLeft: 17,

    width: wp('85%'),
  },
});

export default styles;
