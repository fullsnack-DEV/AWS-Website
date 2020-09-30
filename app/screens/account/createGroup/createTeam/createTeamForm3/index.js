import React, {useState, useEffect, Component} from 'react';
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
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';

import constants from '../../../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

function CreateTeamForm3({navigation, route}) {
  const [basicFee, setBasicFee] = useState('');
  const [membershipFee, setMembershipFee] = useState('');
  const [basicFeeDetail, setBasicFeeDetail] = useState('');
  const [feeCycle, setFeeCycle] = useState('');

  const [membershipFeeDetail, setMembershipFeeDetail] = useState('');
  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
          <View style={styles.form3}></View>
          <View style={styles.form4}></View>
        </View>
        <Text style={styles.registrationText}>{strings.registerTitle}</Text>
        <Text style={styles.registrationDescText}>
          {strings.registerSubTitle}
        </Text>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>{strings.basicFeeTitle}</Text>
        </View>
        <View style={styles.matchFeeView}>
          <TextInput
            placeholder={strings.enterFeePlaceholder}
            style={styles.feeText}
            onChangeText={(text) => setBasicFee(text)}
            value={basicFee}
            keyboardType={'decimal-pad'}></TextInput>
          <Text style={styles.curruency}>CAD</Text>
        </View>

        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>{strings.feeDetailsText}</Text>
          <TextInput
            style={styles.descriptionTxt}
            onChangeText={(text) => setBasicFeeDetail(text)}
            value={basicFeeDetail}
            multiline
            numberOfLines={4}
            placeholder={strings.feeDetailsPlaceholder}
          />
        </View>
        <Text style={styles.registrationText}>
          {strings.membershipFeeTitle}
        </Text>
        <Text style={styles.registrationDescText}>
          {strings.membershipSubTitle}
        </Text>

        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>{strings.basicFeeTitle}</Text>
          <View
            style={{
              flexDirection: 'row',

              marginTop: 12,

              align: 'center',
              marginLeft: 15,
              marginRight: 15,
              justifyContent: 'space-between',
            }}>
            <RNPickerSelect
              placeholder={{
                label: strings.feeCyclePlaceholder,
                value: null,
              }}
              items={[
                {label: 'Weekly', value: 'weekly'},
                {label: 'Biweekly', value: 'biweekly'},
                {label: 'Monthly', value: 'monthly'},
                {label: 'Yearly', value: 'yearly'},
              ]}
              onValueChange={(value) => {
                setFeeCycle(value);
              }}
              value={feeCycle}
              useNativeAndroidPickerStyle={false}
              style={{
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
                  shadowOffset: {width: 0, height: 1},
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
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 1,
                  elevation: 3,
                },
              }}
              Icon={() => {
                return (
                  <Image
                    source={PATH.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                );
              }}
            />
            <View style={styles.halfMatchFeeView}>
              <TextInput
                placeholder={strings.enterFeePlaceholder}
                style={styles.halffeeText}
                keyboardType={'decimal-pad'}
                onChangeText={(text) => setMembershipFee(text)}
                value={membershipFee}></TextInput>
              <Text style={styles.curruency}>CAD</Text>
            </View>
          </View>
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>{strings.feeDetailsText}</Text>
          <TextInput
            style={styles.descriptionTxt}
            onChangeText={(text) => setMembershipFeeDetail(text)}
            value={membershipFeeDetail}
            multiline
            numberOfLines={4}
            placeholder={strings.membershipPlaceholder}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTeamForm4')}>
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

export default CreateTeamForm3;
