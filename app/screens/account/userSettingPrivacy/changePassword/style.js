import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../config/constants';
const {colors, fonts, urls, PATH} = constants;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    
  },
  matchFeeTxt: {
    height: 40,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('3.8%'),
    fontFamily: fonts.RRegular,
    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    elevation: 3,
  },
  fieldView: {
    marginTop: 15,
  },
  fieldTitle: {
    marginTop: hp('2%'),
    color: colors.blackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  separatorLine: {
      marginTop:40,
      marginBottom:25,
    backgroundColor: colors.lightgrayColor,
    width: wp('92%'),
    height: 0.5,
    alignSelf: 'center',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: wp('4%'),
    fontFamily: fonts.RBold,
    marginVertical: 10,
  },
  nextButton: {
    width: '92%',
    height: 45,
    alignSelf: 'center',
    marginTop: wp('12%'),
    borderRadius: 30,
    marginBottom: 40,
  },
  passwordView: {
    flexDirection: 'row',
    height: 40,
    width:wp('92%'),
   
    alignSelf: 'center',
    marginTop: 12,
    fontSize: wp('4%'),
    color: 'black',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    
  },
  textInput: {
      
    borderRadius: 5,
    fontSize: wp('3.8%'),
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    paddingLeft: 17,
    height: 40,
    width:wp('85%'),
    
    backgroundColor: colors.whiteColor,
  },
  passwordEyes: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default styles;