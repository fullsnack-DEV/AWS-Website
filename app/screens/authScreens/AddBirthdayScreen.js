import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Tooltip } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-date-picker';
import TCButton from '../../components/TCButton';
import * as Utility from '../../utils/index';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function AddBirthdayScreen({ navigation }) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const [dateValue, setDateValue] = useState(new Date());
  const [minDateValue, setMinDateValue] = useState(new Date());

  const onChange = (selectedDate) => {
    setDateValue(selectedDate);
  };

  useEffect(() => {
    const date = new Date(new Date());
    date.setFullYear(date.getFullYear() - 13);
    setDateValue(date);
    setMinDateValue(date);
  }, [])
  return (
    <LinearGradient
          colors={[colors.themeColor1, colors.themeColor3]}
          style={styles.mainContainer}>
      <View>
        <FastImage resizeMode={'stretch'} style={styles.background} source={images.loginBg} />

        <Text style={ styles.checkEmailText }>{strings.addBirthdayText}</Text>
        <Text style={ styles.resetText }>{strings.notDisplayText}</Text>

        <Tooltip popover={ <Text style={ { color: colors.themeColor, fontSize: 14 } }>{strings.birthdatText}</Text> }
                 backgroundColor={ colors.parrotColor }
                 height={ hp('50%') }
                 width={ wp('75%') }
                 overlayColor={ 'transparent' }
                 skipAndroidStatusBar= {true}>
          <Text style={ styles.whyAskingText } >{strings.whyAskingText}</Text>
        </Tooltip>

        {/* Date.parse(dateValue) */}

        <View style={ styles.matchFeeTxt }>
          <Text style={ styles.dateText }>{monthNames[dateValue.getMonth()]} {dateValue.getDate()} , {dateValue.getFullYear()}</Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <DatePicker
              textColor={colors.whiteColor}
              mode={'date'}
              maximumDate={minDateValue}
              testID={'startsDateDateTimePicker'}
              style={styles.dateTimePickerStyle}
              date={dateValue}
              onDateChange={onChange}
          />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
        <TCButton
            title={ strings.continueCapTitle }
            onPress={ async () => {
              const user = await Utility.getStorage('userInfo');
              const userBirthday = {
                ...user,
                birthday: new Date(dateValue).getTime() / 1000,
              }

              await Utility.setStorage('userInfo', userBirthday);
              navigation.navigate('ChooseGenderScreen');
            } }
            extraStyle={ { marginTop: 50 } }
        />
      </View>
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
    marginLeft: 20,
    marginTop: wp('25%'),
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
    width: wp('90%'),
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 30,
    fontSize: wp('3.8%'),
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingLeft: 20,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    elevation: 3,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',

  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
});
