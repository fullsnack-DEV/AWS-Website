import React, {useState, useEffect, Component} from 'react';
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

import constants from '../../../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

function CreateTeamForm4({navigation, route}) {
  const [selected, setSelected] = useState(0);
  const [matchFee, setMatchFee] = useState(0.0);
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

        <TouchableOpacity onPress={() => console.log('Form filling ended')}>
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
