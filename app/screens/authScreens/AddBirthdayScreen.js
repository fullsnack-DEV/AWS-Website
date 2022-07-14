import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
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

import strings from '../../Constants/String';
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
              marginLeft: wp('5.33%'),
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            const userParams = {birthday: new Date(dateValue).getTime() / 1000};
            navigateToGenderScreen(userParams);
          }}>
          Next
        </Text>
      ),
    });
  });
  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);
  }, []);
  const navigateToGenderScreen = (userParams) => {
    console.log('route?.params?.signupInfo', route?.params?.signupInfo);
    console.log('userParams', userParams);

    const profileData = {
      ...route?.params?.signupInfo,
      birthday: userParams.birthday,
    };
    console.log('Profile data gender ', profileData);
    navigation.navigate('ChooseGenderScreen', {
      signupInfo: {...profileData},
    });
  };

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        <FastImage
          resizeMode={'stretch'}
          style={styles.background}
          source={images.loginBg}
        />

        <Text style={styles.checkEmailText}>{strings.addBirthdayText}</Text>
        <Text style={styles.resetText}>{strings.notDisplayText}</Text>
        <Tooltip
          containerStyle={{
            left: 25,
          }}
          popover={
            <View style={{flex: 1, padding: 10}}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.RRegular,
                }}>
                {strings.birthdatText}
              </Text>
            </View>
          }
          backgroundColor={colors.parrotColor}
          height={hp('40%')}
          width={wp('75%')}
          overlayColor={'transparent'}
          skipAndroidStatusBar={true}>
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
            testID={'startsDateDateTimePicker'}
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
          {/* <TCButton
          title={strings.continueCapTitle}
          onPress={() => {
            const userParams = {birthday: new Date(dateValue).getTime() / 1000};
            updateProfile(userParams, () => {
              navigation.navigate('ChooseGenderScreen');
            });
          }}
          extraStyle={{marginTop: 50}}
        /> */}
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
    marginLeft: wp('6.6%'),
    marginTop: hp('11.39%'),
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
    width: wp('81.3%'),
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: hp('9.23%'),
    fontSize: wp('3.8%'),
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingLeft: 20,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    elevation: 3,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginLeft: wp('6.6%'),
    marginRight: 20,
    marginTop: 5,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: wp('6.6%'),
    marginRight: 20,
    marginTop: hp('1.84%'),
    // marginBottom: hp('9%'),
    textAlign: 'left',
  },
  birthDateChangeNote: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginRight: wp('9.33%'),
    marginLeft: wp('9.33%'),
    textAlign: 'left',
  },

  nextButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: wp('4%'),
    color: colors.whiteColor,
  },
});
