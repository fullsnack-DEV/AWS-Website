import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import moment from 'moment';

import {Tooltip} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-date-picker';

import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';

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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <Text
          testID={'next-signupBirthday-button'}
          style={styles.nextButtonStyle}
          onPress={() => {
            const userParams = {birthday: new Date(dateValue).getTime() / 1000};
            navigateToGenderScreen(userParams);
          }}>
          {strings.next}
        </Text>
      ),
    });
  });
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
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        // resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <View style={{flex: 1}}>
        <View style={styles.addBirthdayTextContainer}>
          <Text style={styles.checkEmailText}>{strings.addBirthdayText}</Text>
          <Text style={styles.resetText}>{strings.notDisplayText}</Text>
        </View>

        <Tooltip
          popover={
            <Text
              style={{
                color: colors.themeColor,
                fontSize: 14,
                fontFamily: fonts.RRegular,
                paddingHorizontal: 15,
              }}>
              {strings.birthdatText}
            </Text>
          }
          backgroundColor={colors.parrotColor}
          height={305}
          width={305}
          overlayColor={'transparent'}
          skipAndroidStatusBar={true}
          containerStyle={{
            left: 25,
            padding: 0,
            shadowColor: 'rgba(0, 0, 0, 0.16)',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 1,
            shadowRadius: 6,
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
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: 25,
    marginTop: Platform.OS === 'ios' ? 40 + 25 : 25,
    textAlign: 'left',
  },
  dateText: {
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  matchFeeTxt: {
    height: 40,
    justifyContent: 'center',
    marginTop: 65,
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.9)',
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
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
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

  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
  addBirthdayTextContainer: {
    marginTop: 25,
  },
});
