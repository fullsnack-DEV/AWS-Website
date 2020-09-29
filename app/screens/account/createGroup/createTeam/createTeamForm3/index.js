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
  const [basicFee, setBasicFee] = useState(0.0);
  const [membershipFee, setMembershipFee] = useState(0.0);
  const [basicFeeDetail, setBasicFeeDetail] = useState('');
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
        <Text style={styles.registrationText}>Registration Fee</Text>
        <Text style={styles.registrationDescText}>
          A team admin can send a new member the invoice for the registration
          fee after the member joins your team.
        </Text>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>Basic Fee</Text>
        </View>
        <View style={styles.matchFeeView}>
          <TextInput
            placeholder={'Enter fee'}
            style={styles.feeText}
            onChangeText={(text) => setBasicFee(text)}
            value={basicFee}
            keyboardType={'decimal-pad'}></TextInput>
          <Text style={styles.curruency}>CAD</Text>
        </View>

        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>Fee Details</Text>
          <TextInput
            style={styles.descriptionTxt}
            onChangeText={(text) => setBasicFeeDetail(text)}
            value={basicFeeDetail}
            multiline
            numberOfLines={4}
            placeholder={'Write Details regarding the registration fee…'}
          />
        </View>
        <Text style={styles.registrationText}>Membership Fee</Text>
        <Text style={styles.registrationDescText}>
          A team admin can send a member the invoice for the membership fee
          regularly.
        </Text>

        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>Basic Fee</Text>
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
                label: 'Male',
                value: null,
              }}
              items={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
              onValueChange={(value) => {
                setMinAge(value);
              }}
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
                  fontSize: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderColor: 'purple',
                  borderRadius: 8,
                  color: 'black',
                  paddingRight: 30, // to ensure the text is never behind the icon
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
                placeholder={'Enter fee'}
                style={styles.halffeeText}
                keyboardType={'decimal-pad'}
                onChangeText={(text) => setMembershipFee(text)}
                value={membershipFee}></TextInput>
              <Text style={styles.curruency}>CAD</Text>
            </View>
          </View>
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>Fee Details</Text>
          <TextInput
            style={styles.descriptionTxt}
            onChangeText={(text) => setMembershipFeeDetail(text)}
            value={membershipFeeDetail}
            multiline
            numberOfLines={4}
            placeholder={'Write Details regarding the membership fee…'}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTeamForm4')}>
          <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default CreateTeamForm3;
