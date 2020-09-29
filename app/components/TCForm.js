import React from 'react';
import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';

import constants from '../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

function TCForm({initialValues, onSubmit, validationSchema, children}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {() => <>{children}</>}
    </Formik>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginLeft: wp('8%'),
    marginRight: wp('8%'),
    marginBottom: hp('1.5%'),
    borderRadius: 5,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    shadowColor: colors.googleColor,
    shadowOpacity: 0.5,
    // fontFamily: fonts.RRegular,
    fontSize: wp('4.5%'),
    color: colors.blackColor,
    paddingLeft: 17,
    height: 50,
    backgroundColor: colors.whiteColor,
  },
});

export default TCForm;
