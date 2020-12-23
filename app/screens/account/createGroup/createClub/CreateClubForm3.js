import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import ActivityLoader from '../../../../components/loader/ActivityLoader';
import { createGroup } from '../../../../api/Groups';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import AuthContext from '../../../../auth/context'

export default function CreateClubForm3({ navigation, route }) {
  const [membershipFee, setMembershipFee] = useState(0);
  const authContext = useContext(AuthContext)
  const [feeCycle, setFeeCycle] = useState('');
  const [membershipFeeDetail, setMembershipFeeDetail] = useState('');
  const [loading, setloading] = useState(false);

  const creatClubCall = async () => {
    setloading(true)
    const bodyParams = { ...route.params.createClubForm2 };

    if (feeCycle !== '') {
      bodyParams.membership_fee_type = feeCycle;
    }
    if (membershipFee !== 0) {
      bodyParams.membership_fee = membershipFee;
    }
    if (membershipFeeDetail !== '') {
      bodyParams.details = membershipFeeDetail;
    }
    bodyParams.privacy_profile = 'members';
    bodyParams.allclubmemberautomatically_sync = false;
    bodyParams.homefield_address_longitude = 0.0;
    bodyParams.homefield_address_latitude = 0.0;
    bodyParams.allclubmembermannually_sync = false;
    bodyParams.office_address_longitude = 0.0;
    bodyParams.office_address_latitude = 0.0;
    bodyParams.privacy_events = 'everyone';
    bodyParams.privacy_followers = 'everyone';
    // eslint-disable-next-line no-unused-expressions
    (bodyParams.createdAt = 0.0);
    (bodyParams.entity_type = 'club');
    bodyParams.unread = 0;

    const entity = authContext.entity
    createGroup(
      bodyParams,
      entity.role === 'team' && entity.uid,
      entity.role === 'team' && 'club',
      authContext,
    ).then((response) => {
      setloading(false)
      navigation.navigate('ClubCreatedScreen', {
        groupName: response.payload.group_name,
        group_id: response.payload.group_id,
        entity_type: response.payload.entity_type,
      }).catch((e) => {
        setTimeout(() => {
          setloading(false)
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
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
        </View>

        <Text style={ styles.registrationText }>
          {strings.membershipFeeTitle}
        </Text>

        <View style={ styles.fieldView }>
          <Text style={ styles.fieldTitle }>{strings.basicFeeTitle}</Text>
          <View
            style={ {
              flexDirection: 'row',

              marginTop: 12,

              align: 'center',
              marginLeft: 15,
              marginRight: 15,
              justifyContent: 'space-between',
            } }>
            <RNPickerSelect
              placeholder={ {
                label: strings.feeCyclePlaceholder,
                value: null,
              } }
              items={ [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Biweekly', value: 'biweekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ] }
              onValueChange={ (value) => {
                setFeeCycle(value);
              } }
              value={ feeCycle }
              useNativeAndroidPickerStyle={ false }
              style={ {
                inputIOS: {
                  height: 40,

                  fontSize: wp('3.5%'),
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  width: wp('45%'),
                  color: 'black',
                  paddingRight: 30,
                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  shadowColor: colors.googleColor,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 1,
                },
                inputAndroid: {
                  height: 40,

                  fontSize: wp('4%'),
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  width: wp('45%'),
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
              } }
              Icon={ () => (
                <Image
                    source={ images.dropDownArrow }
                    style={ styles.miniDownArrow }
                  />
              ) }
            />
            <View style={ styles.halfMatchFeeView }>
              <TextInput
                placeholder={ strings.enterFeePlaceholder }
                style={ styles.halffeeText }
                keyboardType={ 'decimal-pad' }
                onChangeText={ (text) => setMembershipFee(text) }
                value={ membershipFee }></TextInput>
              <Text style={ styles.curruency }>CAD</Text>
            </View>
          </View>
        </View>
        <View style={ styles.fieldView }>
          <Text style={ styles.fieldTitle }>{strings.feeDetailsText}</Text>
          <TextInput
            style={ styles.descriptionTxt }
            onChangeText={ (text) => setMembershipFeeDetail(text) }
            value={ membershipFeeDetail }
            multiline
            numberOfLines={ 4 }
            placeholder={ strings.membershipPlaceholder }
          />
        </View>
        <TouchableOpacity
          onPress={ () => {
            console.log('filling ended..');
            creatClubCall();
          } }>
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
  curruency: {
    alignSelf: 'flex-end',
    fontSize: wp('4%'),
  },

  descriptionTxt: {
    height: 120,
    // alignSelf: 'center',

    fontSize: wp('3.8%'),

    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,

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

  fieldTitle: {
    marginTop: hp('2%'),

    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
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

  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: 'black',

    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),

    height: 40,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('46%'),
  },

  halffeeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '90%',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
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

  registrationText: {
    color: colors.lightBlackColor,
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
  },

});
