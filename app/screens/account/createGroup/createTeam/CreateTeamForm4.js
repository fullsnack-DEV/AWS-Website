import React, {
  useState, useContext,
} from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ActivityLoader from '../../../../components/loader/ActivityLoader';
import { createGroup } from '../../../../api/Groups';
import AuthContext from '../../../../auth/context'
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'

export default function CreateTeamForm4({ navigation, route }) {
  const [selected, setSelected] = useState(0);
  const authContext = useContext(AuthContext)
  const [matchFee, setMatchFee] = useState(0.0);
  const [loading, setloading] = useState(false);

  const creatTeamCall = async () => {
    setloading(true)
    const bodyParams = { ...route.params.createTeamForm3 };

    if (selected === 0) {
      bodyParams.cancellation_policy = 'strict';
    } else if (selected === 1) {
      bodyParams.cancellation_policy = 'moderate';
    } else {
      bodyParams.cancellation_policy = 'flexible';
    }

    bodyParams.gamefee = matchFee;
    bodyParams.invite_required = false;
    bodyParams.privacy_profile = 'members';
    bodyParams.createdAt = 0.0;
    bodyParams.unread = 0;
    bodyParams.homefield_address_longitude = 0.0;
    bodyParams.homefield_address_latitude = 0.0;
    bodyParams.office_address_latitude = 0.0;
    bodyParams.office_address_longitude = 0.0;
    bodyParams.privacy_members = 'everyone';
    bodyParams.approval_required = false;
    bodyParams.is_following = false;
    bodyParams.privacy_events = 'everyone';
    bodyParams.is_joined = false;
    bodyParams.privacy_followers = 'everyone';
    bodyParams.entity_type = 'team';
    bodyParams.is_admin = false;
    bodyParams.should_hide = false;
    console.log('bodyPARAMS:: ', bodyParams);

    const entity = authContext.entity
    createGroup(
      bodyParams,
      entity.role === 'club' && entity.uid,
      entity.role === 'club' && 'club',
      authContext,
    ).then((response) => {
      setloading(false);
      navigation.navigate('TeamCreatedScreen', {
        groupName: response.payload.group_name,
      });
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
    });
  };

  return (
    <>
      <ScrollView style={ styles.mainContainer }>
        <ActivityLoader visible={loading} />
        <View style={ styles.formSteps }>
          <View style={ styles.form1 }></View>
          <View style={ styles.form2 }></View>
          <View style={ styles.form3 }></View>
          <View style={ styles.form4 }></View>
        </View>
        <Text style={ styles.registrationText }>{strings.matchFeeTitle}</Text>
        <Text style={ styles.registrationDescText }>
          {strings.matchFeeSubTitle}
        </Text>

        <View style={ styles.matchFeeView }>
          <TextInput
            placeholder={ strings.enterFeePlaceholder }
            style={ styles.feeText }
            keyboardType={ 'decimal-pad' }
            onChangeText={ (text) => setMatchFee(text) }
            value={ matchFee }></TextInput>
          <Text style={ styles.curruency }>CAD</Text>
        </View>
        <View>
          <Text style={ styles.membershipText }>
            {strings.cancellationPolicyTitle}
          </Text>
          <Text style={ styles.whoJoinText }>
            {strings.cancellationpolicySubTitle}
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
        <Text style={ styles.registrationDescText }>
          {strings.requesterWarningText}
        </Text>

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

        <TouchableOpacity onPress={ () => creatTeamCall() }>
          <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  curruency: {
    alignSelf: 'flex-end',
    fontSize: wp('4%'),
  },

  feeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '96%',
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
  form3: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: colors.blackColor,
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
  membershipSubText: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: 15,
    marginTop: 20,
  },
  membershipText: {
    color: colors.lightBlackColor,
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
    // fontWeight: 'bold',
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
  registrationDescText: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
  },
  registrationText: {
    color: colors.lightBlackColor,
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  whoJoinText: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },
});
