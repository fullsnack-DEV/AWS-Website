import React, {useState, useEffect, Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import * as Utility from '../../../utility/index';

import {patchRegisterPlayerDetails} from '.././../../api/Accountapi';

function RegisterPlayer({navigation, route}) {
  const [sports, setSports] = useState('');
  const [description, onChangeText] = React.useState('');
  const [matchFee, onMatchFeeChanged] = React.useState(0.0);
  const [selected, setSelected] = useState(0);

  checkValidation = () => {
    if (sports == '') {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
    } else if (matchFee == 0.0) {
      Alert.alert('Towns Cup', 'Fee cannot be blank');
    }
  };

  registerPlayerCall = () => {
    checkValidation();
    if (sports != '' && matchFee != 0.0) {
      let bodyParams = {registered_sports: []};
      bodyParams.registered_sports.sport_name = sports;
      bodyParams.registered_sports.Tennis = 'single-multiplayer';
      bodyParams.registered_sports.fee = matchFee;
      bodyParams.registered_sports.descriptions = description;

      if (selected == 0) {
        bodyParams.registered_sports.cancellation_policy = 'strict';
      } else if (selected == 1) {
        bodyParams.registered_sports.cancellation_policy = 'moderate';
      } else {
        bodyParams.registered_sports.cancellation_policy = 'flexible';
      }

      console.log('bodyPARAMS:: ', bodyParams);

      patchRegisterPlayerDetails(bodyParams).then((response) => {
        if (response.status == true) {
          Alert.alert('Towns Cup', 'Player sucessfully registered');
          navigation.navigate('AccountScreen');
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
        console.log('RESPONSE IS:: ', response);
      });
    }
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.LocationText}>
          {strings.sportsEventsTitle}
          <Text style={styles.mendatory}> {strings.star}</Text>
        </Text>
        <RNPickerSelect
          placeholder={{
            label: strings.selectSportPlaceholder,
            value: '',
          }}
          items={[{label: 'Tennis', value: 'Tennis'}]}
          onValueChange={(value) => {
            setSports(value);
          }}
          useNativeAndroidPickerStyle={false}
          style={{...styles}}
          value={sports}
          Icon={() => {
            return (
              <Image source={PATH.dropDownArrow} style={styles.downArrow} />
            );
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.LocationText}>{strings.descriptionText}</Text>
          {/* <Text style={styles.smallTxt}> {strings.opetionalText} </Text> */}
        </View>
        <TextInput
          style={styles.descriptionTxt}
          onChangeText={(text) => onChangeText(text)}
          value={description}
          multiline
          numberOfLines={4}
          placeholder={strings.descriptionPlaceholder}
        />

        <Text style={styles.LocationText}>
          {strings.matchFeesTitle}
          <Text style={styles.mendatory}> {strings.star}</Text>
          <Text style={styles.smallTxt}> {strings.perHourText} </Text>
        </Text>

        <View style={styles.matchFeeView}>
          <TextInput
            placeholder={strings.enterFeePlaceholder}
            style={styles.feeText}
            onChangeText={(text) => onMatchFeeChanged(text)}
            value={matchFee}
            keyboardType={'decimal-pad'}></TextInput>
          <Text style={styles.curruency}>CAD</Text>
        </View>
        <View>
          <Text style={styles.LocationText}>
            {strings.cancellationPolicyTitle}
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
        <TouchableOpacity onPress={() => registerPlayerCall()}>
          <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>{strings.doneTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default RegisterPlayer;
