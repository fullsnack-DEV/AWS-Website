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
import {string} from 'yup';

function CreateClubForm1({navigation, route}) {
  const [sports, setSports] = useState('');
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');

  const [description, onChangeText] = React.useState('');
  const [matchFee, onMatchFeeChanged] = React.useState(0.0);

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
        </View>
        <View>
          <Text style={styles.fieldTitle}>
            {strings.SportsTextFieldTitle}
            <Text style={styles.mendatory}> {strings.star}</Text>
          </Text>
          <RNPickerSelect
            placeholder={{
              label: strings.selectSportPlaceholder,
              value: null,
            }}
            items={[
              {label: 'Football', value: 'football'},
              {label: 'Baseball', value: 'baseball'},
              {label: 'Hockey', value: 'hockey'},
            ]}
            onValueChange={(value) => {
              setSports(value);
            }}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('3.5%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

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
              inputAndroid: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('4%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.offwhite,

                borderRadius: 5,

                elevation: 3,
              },
            }}
            value={sports}
            Icon={() => {
              return (
                <Image source={PATH.dropDownArrow} style={styles.downArrow} />
              );
            }}
          />
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>
            {strings.clubNameTitle}
            <Text style={styles.mendatory}> {strings.star}</Text>
          </Text>

          <TextInput
            placeholder={strings.clubNameplaceholder}
            style={styles.matchFeeTxt}
            onChangeText={(text) => setClubName(text)}
            value={clubName}></TextInput>
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>{strings.genderTitle}</Text>
          <RNPickerSelect
            placeholder={{
              label: strings.selectGenderPlaceholder,
              value: null,
            }}
            items={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            onValueChange={(value) => {
              setGender(value);
            }}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('3.5%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

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
              inputAndroid: {
                height: 40,
                width: wp('92%'),
                alignSelf: 'center',
                marginTop: 12,
                fontSize: wp('4%'),
                paddingVertical: 12,
                paddingHorizontal: 15,

                color: 'black',
                paddingRight: 30,
                backgroundColor: colors.offwhite,

                borderRadius: 5,

                elevation: 3,
              },
            }}
            value={gender}
            Icon={() => {
              return (
                <Image source={PATH.dropDownArrow} style={styles.downArrow} />
              );
            }}
          />
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.fieldTitle}>{strings.membersAgeTitle}</Text>
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
                label: strings.minPlaceholder,
                value: null,
              }}
              items={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
              onValueChange={(value) => {
                setMinAge(value);
              }}
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
              value={minAge}
              Icon={() => {
                return (
                  <Image
                    source={PATH.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                );
              }}
            />
            <RNPickerSelect
              placeholder={{
                label: strings.maxPlaceholder,
                value: null,
              }}
              items={[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
              ]}
              onValueChange={(value) => {
                setMaxAge(value);
              }}
              useNativeAndroidPickerStyle={false}
              style={{
                iconContainer: {},
                inputIOS: {
                  height: 40,

                  fontSize: wp('3.5%'),
                  paddingVertical: 12,
                  paddingHorizontal: 15,

                  width: wp('45%'),
                  color: 'black',

                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  shadowColor: colors.googleColor,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 1,
                  elevation: 3,
                },
                inputAndroid: {
                  height: 40,
                  fontSize: wp('4%'),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  width: wp('45%'),
                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  color: 'black',

                  elevation: 3,
                },
              }}
              value={maxAge}
              Icon={() => {
                return (
                  <Image
                    source={PATH.dropDownArrow}
                    style={styles.miniDownArrow}
                  />
                );
              }}
            />
          </View>
          <View style={styles.fieldView}>
            <Text style={styles.fieldTitle}>
              {strings.locationTitle}
              <Text style={styles.mendatory}> {strings.star}</Text>
            </Text>

            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={styles.matchFeeTxt}
              onChangeText={(text) => setLocation(text)}
              value={location}></TextInput>
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={styles.smallTxt}>
              (<Text style={styles.mendatory}>{strings.star} </Text>
              {strings.requiredText})
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateClubForm2')}>
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

export default CreateClubForm1;
