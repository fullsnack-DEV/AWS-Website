import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';
const {colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
  },

  nextButton: {
    width: '90%',
    height: hp('5%'),
    alignSelf: 'center',
    marginTop: wp('10%'),
    borderRadius: 30,
    marginBottom: 40,
  },

  formSteps: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 15,
  },
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  form3: {
    backgroundColor: colors.themeColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  form4: {
    backgroundColor: colors.themeColor,
    height: 5,
    width: 10,
    marginLeft: 2,
    marginRight: 2,
  },

  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: wp('4%'),
    fontFamily: fonts.RBold,
    marginVertical: 10,
  },
  registrationText: {
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
    color: colors.lightBlackColor,
  },
  registrationDescText: {
    fontSize: wp('4%'),
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 20,
    color: colors.lightBlackColor,
  },
  matchFeeView: {
    flexDirection: 'row',
    height: 40,

    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('3.5%'),
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: colors.blackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  feeText: {
    width: '96%',
    fontSize: wp('3.8%'),
  },
  membershipText: {
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
    color: colors.lightBlackColor,
    //fontWeight: 'bold',
  },
  membershipSubText: {
    fontSize: wp('4%'),
    marginLeft: 15,
    marginTop: 20,
    color: colors.lightBlackColor,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  whoJoinText: {
    fontSize: wp('4%'),
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 20,
    color: colors.lightBlackColor,
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

    alignSelf: 'center',
  },
});

export default styles;
