import React, {
  useState, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import images from '../../../Constants/ImagePath';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import * as Utility from '../../../utils/index';

import { patchRegisterPlayerDetails } from '../../../api/Users';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'

export default function RegisterPlayerForm2({ navigation, route }) {
  // For activity indigator
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [matchFee, onMatchFeeChanged] = React.useState('');
  const [selected, setSelected] = useState(0);

  const registerPlayerCall = () => {
    setloading(true);
    if (route.params && route.params.bodyParams) {
      const bodyParams = { ...route.params.bodyParams };
      bodyParams.fee = matchFee;
      if (selected === 0) {
        bodyParams.cancellation_policy = 'strict';
      } else if (selected === 1) {
        bodyParams.cancellation_policy = 'moderate';
      } else {
        bodyParams.cancellation_policy = 'flexible';
      }
      console.log('bodyPARAMS:: ', bodyParams);
      const registerdPlayerData = authContext.user.registered_sports
      registerdPlayerData.push(bodyParams);
      const body = {
        registered_sports: registerdPlayerData,
      }
      patchRegisterPlayerDetails(body).then(async (response) => {
        if (response.status === true) {
          // FIXME:
          await Utility.setStorage('user', response.payload);
          authContext.setUser(response.payload)
          Alert.alert('Towns Cup', 'Player sucessfully registered');
          navigation.navigate('AccountScreen');
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      });
    }
  };

  return (
    <>
      <ScrollView style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        <View style={ styles.formSteps }>
          <View style={ styles.form1 }></View>
          <View style={ styles.form2 }></View>
        </View>

        <Text style={ styles.LocationText }>
          {strings.matchFeesTitle}

          <Text style={ styles.smallTxt }> {strings.perHourText} </Text>
        </Text>

        <View style={ styles.matchFeeView }>
          <TextInput
            placeholder={ strings.enterFeePlaceholder }
            style={ styles.feeText }
            onChangeText={ (text) => onMatchFeeChanged(text) }
            value={ (matchFee) }
            keyboardType={ 'decimal-pad' }></TextInput>
          <Text style={ styles.curruency }>CAD/match</Text>
        </View>
        <View>
          <Text style={ styles.LocationText }>
            {strings.cancellationPolicyTitle}
          </Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setSelected(0) }>
            {selected === 0 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
                source={ images.radioUnselect }
                style={ styles.unSelectRadioImage }
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.strictText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setSelected(1) }>
            {selected === 1 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
                source={ images.radioUnselect }
                style={ styles.unSelectRadioImage }
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.moderateText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setSelected(2) }>
            {selected === 2 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
                source={ images.radioUnselect }
                style={ styles.unSelectRadioImage }
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.flexibleText}</Text>
        </View>
        {selected === 0 && (
          <View>
            <Text style={ styles.membershipText }>{strings.strictText} </Text>
            <Text style={ styles.whoJoinText }>
              <Text style={ styles.membershipSubText }>
                {strings.strictPoint1Title}
              </Text>
              {'\n'}
              {strings.strictPoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.strictPoint2Title}
              </Text>
              {'\n'}
              {strings.strictPoint2Desc}
            </Text>
          </View>
        )}
        {selected === 1 && (
          <View>
            <Text style={ styles.membershipText }>{strings.moderateText} </Text>
            <Text style={ styles.whoJoinText }>
              <Text style={ styles.membershipSubText }>
                {strings.moderatePoint1Title}
              </Text>
              {'\n'}
              {strings.moderatePoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.moderatePoint2Title}
              </Text>
              {'\n'}
              {strings.moderatePoint2Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.moderatePoint3Title}
              </Text>
              {strings.moderatePoint3Desc}
            </Text>
          </View>
        )}
        {selected === 2 && (
          <View>
            <Text style={ styles.membershipText }>{strings.flexibleText} </Text>
            <Text style={ styles.whoJoinText }>
              <Text style={ styles.membershipSubText }>
                {strings.flexiblePoint1Title}
              </Text>
              {'\n'}
              {strings.flexiblePoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.flexiblePoint2Title}
              </Text>
              {'\n'}
              {strings.flexiblePoint2Desc}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={ () => registerPlayerCall() }>
          <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.doneTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: '22%',
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  LocationText: {
    marginTop: hp('2%'),
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
    // fontFamily: fonts.RBold,
  },
  descriptionTxt: {
    height: 120,
    // alignSelf: 'center',
    width: wp('92%'),
    fontSize: wp('3.8%'),
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  // curruency: {
  //   height: 40,
  //   width: 50,
  //   marginTop: 12,
  //   backgroundColor: colors.textFieldColor,
  //   textAlign: 'center',
  //   lineHeight: 37,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   fontSize: wp('4%'),
  // },
  curruency: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 15,
    textAlign: 'center',
  },
  feeText: {
    fontSize: wp('3.8%'),
    width: '84%',
  },
  // matchFeeView: {
  //   flexDirection: 'row',
  //   height: 40,

  //   marginBottom: 14,
  // },
  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),
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
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldColor,
    fontSize: wp('4%'),
    height: 40,
    paddingLeft: 10,

    width: wp('77%'),
    // marginTop: 12,
  },

  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
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
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },
  doneButton: {
    alignSelf: 'center',
    backgroundColor: colors.doneButtonColor,
    borderRadius: 8,
    bottom: 30,
    height: 45,

    marginLeft: '7%',
    marginRight: '5%',
    marginTop: hp('2%'),
    position: 'absolute',
    width: '75%',
  },
  signUpText: {
    fontSize: 17,
    // fontFamily: fonts.RBold,
    height: 50,
    padding: 12,
    textAlign: 'center',
    color: colors.whiteColor,
  },
  downArrow: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 22,
    width: 18,
  },
  certificateImg: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldColor,
    borderRadius: 10,

    height: 45,

    marginRight: 15,
    resizeMode: 'contain',
    width: 45,
  },
  chooseImage: {
    bottom: -8,
    height: 20,
    position: 'absolute',
    resizeMode: 'contain',
    right: 8,
    width: 20,
  },
  addCertificateView: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginTop: 12,
    marginBottom: 12,
    width: wp('92%'),
    alignSelf: 'center',
  },
  addCertificateButton: {
    alignItems: 'center',

    alignSelf: 'center',
    borderColor: colors.blackColor,
    borderRadius: 6,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginTop: '5%',
    width: '35%',
  },
  addCertificateText: {
    fontSize: 12,
    // fontFamily: fonts.RBold,

    color: colors.blackColor,
  },
  delete: { alignSelf: 'flex-end', color: colors.fbTextColor, marginRight: 15 },

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
  radioText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    marginLeft: 15,
    marginRight: 15,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    // tintColor: colors.radioButtonColor,
    alignSelf: 'center',
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  membershipText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginLeft: 15,
    marginTop: 20,
  },
  mendatory: {
    color: 'red',
  },
  membershipSubText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: 15,
    marginTop: 20,
  },
  whoJoinText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },

});
