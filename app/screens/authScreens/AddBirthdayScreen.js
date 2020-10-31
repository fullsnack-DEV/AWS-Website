import React, { useState } from 'react';
import {
  View, Text, Image, Platform, StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Tooltip } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';

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
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateValue(currentDate);
    if (Platform.OS === 'android') {
      setShow(false);
    }
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />

      <Text style={ styles.checkEmailText }>{strings.addBirthdayText}</Text>
      <Text style={ styles.resetText }>{strings.notDisplayText}</Text>

      <Tooltip popover={ <Text style={ { color: colors.themeColor, fontSize: 14 } }>{strings.birthdatText}</Text> }
            backgroundColor={ colors.parrotColor }
            height={ hp('30%') }
            width={ wp('75%') }
            overlayColor={ 'transparent' }
            skipAndroidStatusBar= {true}>
        <Text style={ styles.whyAskingText } >{strings.whyAskingText}</Text>
      </Tooltip>

      {/* Date.parse(dateValue) */}

      <View style={ styles.matchFeeTxt }>
        <Text style={ styles.dateText } onPress={showDatepicker}>{monthNames[dateValue.getMonth()]} {dateValue.getDate()} , {dateValue.getFullYear()}</Text>
      </View>

      <TCButton
        title={ strings.continueCapTitle }
        onPress={ async () => {
          const user = await Utility.getStorage('userInfo');

          const userBirthday = {
            ...user,
            birthday: dateValue,
          }

          await Utility.setStorage('userInfo', userBirthday);
          navigation.navigate('ChooseGenderScreen');
        } }
        extraStyle={ { marginTop: 50 } }
      />
      {show && <RNDateTimePicker
          testID="dateTimePicker"
          is24Hour={ true }
          display="default"
          onChange={ onChange }
          textColor="white"
          value={dateValue}
          mode={mode}
          maximumDate={new Date()}
          // style={ {
          //   position: 'absolute', left: 0, right: 0, bottom: 10,
          // } }
        />}

    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
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
    flexDirection: 'column',
  },
  matchFeeTxt: {
    height: 40,
    width: wp('90%'),
    alignSelf: 'center',
    justifyContent: 'center',
    // alignItems:'center',
    marginTop: 30,
    fontSize: wp('3.8%'),

    color: 'black',

    backgroundColor: colors.offwhite,

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
    fontFamily: fonts.RRegular,
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
