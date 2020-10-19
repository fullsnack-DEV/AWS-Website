import React, { useEffect, useState } from 'react';
import {
  View, Text, Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Tooltip } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

import constants from '../../../config/constants';
import TCButton from '../../../components/TCButton';

import strings from '../../../Constants/String';
import styles from './style'

const {
  colors, PATH,
} = constants;

export default function AddBirthdayScreen({ navigation }) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const [dateValue, setDateValue] = useState(new Date());

  useEffect(() => {

  }, [])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateValue(currentDate);
  };

  return (
      <View style={ styles.mainContainer }>
          <Image style={ styles.background } source={ PATH.orangeLayer } />
          <Image style={ styles.background } source={ PATH.bgImage } />

          <Text style={ styles.checkEmailText }>{strings.addBirthdayText}</Text>
          <Text style={ styles.resetText }>{strings.notDisplayText}</Text>

          <Tooltip popover={ <Text style={ { color: colors.themeColor, fontSize: 14 } }>{strings.birthdatText}</Text> }
            backgroundColor={ colors.parrotColor }
            height={ hp('25%') }
            width={ wp('75%') }
            overlayColor={ 'transparent' }>
              <Text style={ styles.whyAskingText } >{strings.whyAskingText}</Text>
          </Tooltip>

          {/* Date.parse(dateValue) */}

          <View style={ styles.matchFeeTxt }>
              <Text style={ styles.dateText }>{monthNames[dateValue.getMonth()]} {dateValue.getDate()} , {dateValue.getFullYear()}</Text>
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

          <DateTimePicker
          testID="dateTimePicker"
          value={ dateValue }
          is24Hour={ true }
          display="default"
          onChange={ onChange }
          textColor="white"
          style={ {
            position: 'absolute', left: 0, right: 0, bottom: 10,
          } }
        />

      </View>
  );
}
