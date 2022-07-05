/* eslint-disable default-case */
import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCLabel from '../../../components/TCLabel';
import Header from '../../../components/Home/Header';
import TCKeyboardView from '../../../components/TCKeyboardView';

export default function AccountInfoScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  // For activity indigator
  const [loading] = useState(false);
  const [userInfo] = useState(authContext.entity.obj);

  const [city, setCity] = useState(
    route?.params?.city ? route?.params?.city : authContext?.entity?.obj?.city,
  );
  const [state, setState] = useState(
    route?.params?.state
      ? route?.params?.state
      : authContext?.entity?.obj?.state_abbr,
  );
  const [country, setCountry] = useState(
    route?.params?.country
      ? route?.params?.country
      : authContext?.entity?.obj?.country,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, userInfo, city, state, country]);

  useEffect(() => {
    console.log('route?.params?.city', route?.params?.city);
    if (isFocused) {
      if (
        route?.params?.city &&
        route?.params?.state &&
        route?.params?.country
      ) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
      }
    }
  }, [
    isFocused,
    route?.params?.city,
    route?.params?.country,
    route?.params?.state,
  ]);

  // Form Validation

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text
            style={{
              fontSize: 16,
              color: colors.lightBlackColor,
              textAlign: 'center',
              fontFamily: fonts.RBold,
            }}>
            Account info
          </Text>
        }
      />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: colors.writePostSepratorColor,
        }}
      />
      <TCKeyboardView>
        <ActivityLoader visible={loading} />
        <TCLabel title={'E-mail'} />
        <TextInput
          placeholder={strings.emailPlaceHolder}
          style={{...styles.matchFeeTxt}}
          editable={false}
          value={userInfo.email}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChangePasswordScreen');
          }}>
          <TCLabel
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              textDecorationLine: 'underline',
            }}
            title={'Change password'}></TCLabel>
        </TouchableOpacity>
      </TCKeyboardView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
  matchFeeTxt: {
    alignSelf: 'center',
    borderRadius: 5,
    color: colors.lightBlackColor,
    fontSize: 16,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 12,
    width: wp('92%'),
  },
});
