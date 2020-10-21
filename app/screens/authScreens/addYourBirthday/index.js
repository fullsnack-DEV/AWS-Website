import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Tooltip } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCButton from '../../../components/TCButton';
import * as Utility from '../../../utils/index';

import strings from '../../../Constants/String';
import styles from './style'

export default function AddBirthdayScreen({ navigation }) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const [dateValue, setDateValue] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {

  }, [])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
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
          style={ {
            position: 'absolute', left: 0, right: 0, bottom: 10,
          } }
        />}

    </View>
  );
}
