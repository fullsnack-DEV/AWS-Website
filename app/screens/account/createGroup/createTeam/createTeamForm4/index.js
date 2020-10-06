import React, {useState, useEffect, Component, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import AuthContext from '../../../../../auth/context';
import * as Utility from '../../../../../utility/index';
import {get, post} from '../../../../../api/services';
import {CREATE_TEAM} from '../../../../../api/Url';

import constants from '../../../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

function CreateTeamForm4({navigation, route}) {
  const [selected, setSelected] = useState(0);
  const [matchFee, setMatchFee] = useState(0.0);

  const creatTeamCall = async () => {
    let bodyParams = {...route.params.createTeamForm3};

    if (selected == 0) {
      bodyParams.cancellation_policy = 'strict';
    } else if (selected == 1) {
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

    const token = await Utility.getStorage('token');
    const switchEntity = Utility.getStorage('switchBy');
    const clubObject = Utility.getStorage('club');
    const endPoint = CREATE_TEAM;
    console.log('endPoint  IS: ', endPoint, token);
    if (clubObject != null) {
      post(
        endPoint,
        JSON.parse(token),
        bodyParams,
        clubObject.group_id,
        'club',
      ).then((response) => {
        if (response.status == true) {
          navigation.navigate('TeamCreatedScreen', {
            groupName: response.payload.group_name,
          });
        }
        console.log('RESPONSE IS:: ', response);
      });
    } else {
      post(endPoint, JSON.parse(token), bodyParams).then((response) => {
        if (response.status == true) {
          navigation.navigate('TeamCreatedScreen', {
            groupName: response.payload.group_name,
          });
        }
        console.log('RESPONSE IS:: ', response);
      });
    }
    navigation.navigate('TeamCreatedScreen', {
      // groupName: response.payload.group_name,
      groupName: 'Kishan Football Team',
    });
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
          <View style={styles.form3}></View>
          <View style={styles.form4}></View>
        </View>
        <Text style={styles.registrationText}>{strings.matchFeeTitle}</Text>
        <Text style={styles.registrationDescText}>
          {strings.matchFeeSubTitle}
        </Text>

        <View style={styles.matchFeeView}>
          <TextInput
            placeholder={strings.enterFeePlaceholder}
            style={styles.feeText}
            keyboardType={'decimal-pad'}
            onChangeText={(text) => setMatchFee(text)}
            value={matchFee}></TextInput>
          <Text style={styles.curruency}>CAD</Text>
        </View>
        <View>
          <Text style={styles.membershipText}>
            {strings.cancellationPolicyTitle}
          </Text>
          <Text style={styles.whoJoinText}>
            {strings.cancellationpolicySubTitle}
          </Text>
        </View>

        <View style={styles.radioButtonView}>
          <TouchableWithoutFeedback onPress={() => setSelected(0)}>
            {selected == 0 ? (
              <Image source={PATH.radioSelect} style={styles.radioImage} />
            ) : (
              <Image
                source={PATH.radioUnselect}
                style={styles.unSelectRadioImage}
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={styles.radioText}>{strings.strictText}</Text>
        </View>
        <View style={styles.radioButtonView}>
          <TouchableWithoutFeedback onPress={() => setSelected(1)}>
            {selected == 1 ? (
              <Image source={PATH.radioSelect} style={styles.radioImage} />
            ) : (
              <Image
                source={PATH.radioUnselect}
                style={styles.unSelectRadioImage}
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={styles.radioText}>{strings.moderateText}</Text>
        </View>
        <View style={styles.radioButtonView}>
          <TouchableWithoutFeedback onPress={() => setSelected(2)}>
            {selected == 2 ? (
              <Image source={PATH.radioSelect} style={styles.radioImage} />
            ) : (
              <Image
                source={PATH.radioUnselect}
                style={styles.unSelectRadioImage}
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={styles.radioText}>{strings.flexibleText}</Text>
        </View>
        <Text style={styles.registrationDescText}>
          {strings.requesterWarningText}
        </Text>

        {selected == 0 && (
          <View>
            <Text style={styles.membershipText}>{strings.strictText} </Text>
            <Text style={styles.whoJoinText}>
              <Text style={styles.membershipSubText}>
                {strings.strictPoint1Title}
              </Text>
              {'\n'}
              {strings.strictPoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={styles.membershipSubText}>
                {strings.strictPoint2Title}
              </Text>
              {'\n'}
              {strings.strictPoint2Desc}
            </Text>
          </View>
        )}
        {selected == 1 && (
          <View>
            <Text style={styles.membershipText}>{strings.moderateText} </Text>
            <Text style={styles.whoJoinText}>
              <Text style={styles.membershipSubText}>
                {strings.moderatePoint1Title}
              </Text>
              {'\n'}
              {strings.moderatePoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={styles.membershipSubText}>
                {strings.moderatePoint2Title}
              </Text>
              {'\n'}
              {strings.moderatePoint2Desc}
              {'\n'}
              {'\n'}
              <Text style={styles.membershipSubText}>
                {strings.moderatePoint3Title}
              </Text>
              {strings.moderatePoint3Desc}
            </Text>
          </View>
        )}
        {selected == 2 && (
          <View>
            <Text style={styles.membershipText}>{strings.flexibleText} </Text>
            <Text style={styles.whoJoinText}>
              <Text style={styles.membershipSubText}>
                {strings.flexiblePoint1Title}
              </Text>
              {'\n'}
              {strings.flexiblePoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={styles.membershipSubText}>
                {strings.flexiblePoint2Title}
              </Text>
              {'\n'}
              {strings.flexiblePoint2Desc}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={() => creatTeamCall()}>
          <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default CreateTeamForm4;
