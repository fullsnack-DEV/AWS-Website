import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';

import moment from 'moment';

import {Tooltip} from 'react-native-elements';

import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-date-picker';

import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthScreenHeader from './AuthScreenHeader';

const windowHeight = Dimensions.get('window').height;

export default function AddBirthdayScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  console.log(
    'auth birthday',
    new Date(authContext?.entity?.obj?.birthday * 1000),
  );
  const [dateValue, setDateValue] = useState(
    authContext?.entity?.obj?.birthday
      ? new Date(authContext?.entity?.obj?.birthday * 1000)
      : new Date(),
  );
  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());

  const [loading] = useState(false);

  const onChange = (selectedDate) => {
    console.log('on date change call', selectedDate);
    setDateValue(selectedDate);
  };

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // Set minimum date as defaul date (13 YEAR)
    setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);
  }, []);
  const navigateToGenderScreen = (userParams) => {
    const profileData = {
      ...route?.params?.signupInfo,
      birthday: userParams.birthday,
    };

    navigation.navigate('ChooseGenderScreen', {
      signupInfo: {...profileData},
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.kHexColorFF8A01}}>
      <ActivityLoader visible={loading} />
      <FastImage
        // resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />

      <AuthScreenHeader
        title={strings.addBirthdayText}
        onBackPress={() => {
          navigation.pop();
        }}
        onNextPress={() => {
          const userParams = {
            birthday: new Date(dateValue).getTime() / 1000,
          };
          navigateToGenderScreen(userParams);
        }}
      />

      <View style={{flex: 1}}>
        <View style={styles.addBirthdayTextContainer}>
          <Text style={styles.resetText}>{strings.notDisplayText}</Text>
        </View>

        <Tooltip
          popover={
            <Text
              style={{
                color: colors.signUpTextColor,
                fontSize: 14,
                fontFamily: fonts.RRegular,
                paddingHorizontal: 15,
              }}>
              {strings.birthdatText}
            </Text>
          }
          backgroundColor={colors.parrotColor}
          width={305}
          overlayColor={'transparent'}
          skipAndroidStatusBar={true}
          containerStyle={{
            left: 25,
            padding: 0,
            shadowColor: colors.shdowColorToolKit,
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 1,
            shadowRadius: 6,
            height: 315,
            paddingTop: 15,
            paddingBottom: 15,
          }}>
          <Text style={styles.whyAskingText}>{strings.whyAskingText}</Text>
        </Tooltip>

        {/* Date.parse(dateValue) */}

        <View style={styles.matchFeeTxt}>
          <Text style={styles.dateText}>
            {moment(dateValue).format('MMM DD, YYYY')}
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <DatePicker
            textColor={colors.whiteColor}
            fadeToColor={'none'}
            mode={'date'}
            maximumDate={minDateValue}
            minimumDate={maxDateValue}
            testID={'birthday-signup-picker'}
            style={{marginTop: 15}}
            date={dateValue}
            onDateChange={onChange}
          />
        </View>
      </View>
      <SafeAreaView>
        <View
          style={{
            bottom: 16,
          }}>
          <Text style={styles.birthDateChangeNote}>
            {strings.birthDateChangeNote}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: windowHeight,
    resizeMode: 'cover',
  },

  dateText: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },

  matchFeeTxt: {
    height: 40,
    justifyContent: 'center',
    marginTop: 25,
    color: 'black',
    backgroundColor: colors.bhirthdaybgcolor,
    paddingLeft: 20,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 35,
    marginRight: 35,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 5,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 15,
    textAlign: 'left',
  },
  birthDateChangeNote: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'left',
  },

  addBirthdayTextContainer: {
    marginTop: 25,
  },
});
