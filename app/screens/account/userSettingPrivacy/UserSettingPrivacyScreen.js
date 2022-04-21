import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  
} from 'react-native';

import firebase from '@react-native-firebase/app';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';

export default function UserSettingPrivacyScreen({navigation}) {
  const authContext = useContext(AuthContext);

  const [userSetting, setUserSetting] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getUserSettingMenu = useCallback(() => {
    checkUserIsRegistratedOrNotWithFirebase(authContext.entity.obj.email)
      .then(async (providerData) => {
        if (providerData.includes('password')) {
          setUserSetting([
            {key: 'Profile', id: 1},
            {key: 'Sports Activities', id: 2},
            {key: 'Currency', id: 3},
            {key: 'Change Password', id: 4},
            {key: 'Deactivate Account', id: 5},
            {key: 'Terminate Account', id: 6},

            // {key: 'Privacy Setting',id:3}
          ]);
        } else {
          setUserSetting([
            {key: 'Profile', id: 1},
            {key: 'Sports Activities', id: 3},
            {key: 'Currency', id: 3},
            // {key: 'Privacy Setting',id:3}
          ]);
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  }, [authContext.entity.obj.email]);

  useEffect(() => {
    getUserSettingMenu();
  }, [getUserSettingMenu]);

  const checkUserIsRegistratedOrNotWithFirebase = (email) =>
    new Promise((resolve, reject) => {
      firebase
        .auth()
        .fetchSignInMethodsForEmail(email)
        .then((isAccountThereInFirebase) => {
          if (isAccountThereInFirebase?.length > 0) {
            resolve(isAccountThereInFirebase);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });

  const handleOpetions = async (opetions) => {
    if (opetions === 'Profile') {
      navigation.navigate('PersonalInformationScreen');
    } else if (opetions === 'Sports Activities') {
      console.log('click on sport setting');
      navigation.navigate('SportActivityScreen');
    } else if (opetions === 'Change Password') {
      navigation.navigate('ChangePasswordScreen');
    } else if (opetions === 'Currency') {
      navigation.navigate('CurrencySettingScreen');
    } else if (opetions === 'Privacy Setting') {
      // groupOpetionActionSheet.show();
    } else if (opetions === 'Deactivate Account') {
      navigation.navigate('DeactivateAccountScreen');
    } else if (opetions === 'Terminate Account') {
      navigation.navigate('TerminateAccountScreen');
    }
  };

  const renderMenu = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === 'Currency' && authContext?.entity?.obj?.currency_type && (
          <Text style={styles.currencyTypeStyle}>
            {authContext?.entity?.obj?.currency_type}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
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
            Settings
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
      <ScrollView style={styles.mainContainer}>
        <FlatList
          data={userSetting}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
});
