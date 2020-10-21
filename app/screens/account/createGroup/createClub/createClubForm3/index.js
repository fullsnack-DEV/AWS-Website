import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';

import * as Utility from '../../../../../utils/index';

import { postGroups } from '../../../../../api/Accountapi';
import images from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';
import colors from '../../../../../Constants/Colors';

function CreateClubForm3({ navigation, route }) {
  const [membershipFee, setMembershipFee] = useState(0);
  const [feeCycle, setFeeCycle] = useState('');
  const [membershipFeeDetail, setMembershipFeeDetail] = useState('');
  useEffect(() => {}, []);

  const creatClubCall = async () => {
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
    console.log('BODY PARAMS:', bodyParams);

    const teamObject = await Utility.getStorage('team');
    postGroups(
      bodyParams,
      teamObject.group_id || null,
      teamObject.group_id ? 'team' : null,
    ).then((response) => {
      if (response.status === true) {
        navigation.navigate('ClubCreatedScreen', {
          groupName: response.payload.group_name,
        });
      } else {
        alert(response.messages);
      }
      console.log('RESPONSE WITH TEAM IS:: ', response);
    });
  };

  return (
    <>
      <ScrollView style={ styles.mainContainer }>
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

export default CreateClubForm3;
