import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  View,
} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { useIsFocused } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';
import * as Utility from '../../utils/index';
import { updateUserProfile } from '../../api/Users';
import AuthContext from '../../auth/context';
import DataSource from '../../Constants/DataSource';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCLabel from '../../components/TCLabel';

export default function CurrencySettingScreen({ navigation }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const [curruency, setCurruency] = useState(authContext.entity.obj.currency_type ?? 'CAD');

  useEffect(() => {
    if (isFocused) {
      console.log('Called', authContext);
    }
  }, []);

  const updateCurrency = (currencyType) => {
    setloading(true);
    const body = {
      currency_type: currencyType,
    }
    updateUserProfile(body, authContext).then(async (response) => {
      const currentEntity = {
        ...authContext.entity, obj: response.payload,
      }
      authContext.setEntity({ ...currentEntity })
      Utility.setStorage('authContextEntity', { ...currentEntity })

      setloading(false);
      navigation.goBack()
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, 'Currency updated sucessfully');
      }, 10);
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e);
      }, 10);
    })
  }
  return (
    <>
      <ActivityLoader visible={ loading } />

      <TCLabel title={strings.curruencyType}/>
      <RNPickerSelect
              placeholder={{}}
              items={DataSource.CurrencyType}
              onValueChange={(value) => {
                setCurruency(value)
              }}
              useNativeAndroidPickerStyle={false}
              // eslint-disable-next-line no-sequences
              style={{ ...(Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid), ...styles }}
              value={curruency}
              Icon={() => (
                <Image source={images.dropDownArrow} style={styles.downArrow} />
              )}
            />
      <View style={{ flex: 1 }} />
      <TouchableOpacity
            onPress={() => {
              updateCurrency(curruency)
            }}>
        <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.nextButton}>
          <Text style={styles.nextButtonText}>{strings.doneTitle}</Text>
        </LinearGradient>
      </TouchableOpacity>

    </>
  );
}
const styles = StyleSheet.create({

  downArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 25,
    width: 12,
  },
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },

  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 25,
    marginTop: wp('12%'),
    width: '90%',
  },

  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },

});
