import React, {useState, useContext, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';

import * as Utility from '../../utils/index';
import {updateUserProfile} from '../../api/Users';
import AuthContext from '../../auth/context';
import DataSource from '../../Constants/DataSource';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCLabel from '../../components/TCLabel';
import Header from '../../components/Home/Header';
import Verbs from '../../Constants/Verbs';

export default function CurrencySettingScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const [curruency, setCurruency] = useState(
    authContext.entity.obj.currency_type ?? Verbs.usd,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const updateCurrency = (currencyType) => {
    setloading(true);
    const body = {
      currency_type: currencyType,
    };
    updateUserProfile(body, authContext)
      .then(async (response) => {
        const currentEntity = {
          ...authContext.entity,
          obj: response.payload,
        };
        authContext.setEntity({...currentEntity});
        Utility.setStorage('authContextEntity', {...currentEntity});

        setloading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderCurrencyType = ({item}) => (
    <TouchableOpacity
      onPress={() => setCurruency(item?.value)}
      style={{
        paddingHorizontal: 25,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text>{item.label}</Text>
      <Image
        source={
          curruency === item?.value
            ? images.radioCheckYellow
            : images.radioUnselect
        }
        style={{height: 22, width: 22}}
      />
    </TouchableOpacity>
  );
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
            {strings.currencyText}
          </Text>
        }
        rightComponent={
          <TouchableOpacity onPress={() => updateCurrency(curruency)}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RMedium,
                color: colors.lightBlackColor,
              }}>
              {strings.done}
            </Text>
          </TouchableOpacity>
        }
      />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: colors.writePostSepratorColor,
        }}
      />
      <>
        <ActivityLoader visible={loading} />

        <TCLabel title={strings.curruencyType} />
        <FlatList
          style={{marginTop: 5}}
          data={DataSource.CurrencyType}
          renderItem={renderCurrencyType}
        />
        <View style={{flex: 1}} />
      </>
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
});
