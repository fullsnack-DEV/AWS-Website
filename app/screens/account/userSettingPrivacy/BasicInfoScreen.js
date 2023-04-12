/* eslint-disable no-nested-ternary */
/* eslint-disable default-case */
import React, {useState, useLayoutEffect, useContext, useEffect} from 'react';
import {StyleSheet, Alert, SafeAreaView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {getUserDetails, updateUserProfile} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import * as Utility from '../../../utils/index';
import {getQBAccountType, QBupdateUser} from '../../../utils/QuickBlox';
import ScreenHeader from '../../../components/ScreenHeader';
import EditBasicInfoComponent from '../../../components/EditBasicInfoComponent';

export default function BasicInfoScreen({navigation}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (isFocused) {
      if (isFocused) {
        setloading(true);
        getUserDetails(authContext?.entity?.uid, authContext)
          .then((response) => {
            setloading(false);
            setUserInfo(response.payload);
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    }
  }, [authContext]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Form Validation
  const checkValidation = () => {
    if (userInfo.email) {
      if (!Utility.validateEmail(userInfo.email)) {
        Alert.alert(strings.appName, strings.validEmailValidation);
        return false;
      }
    }
    if (userInfo.first_name === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      return false;
    }
    if (userInfo.last_name === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
      return false;
    }
    if (userInfo.city && userInfo.state_abbr && userInfo.country === '') {
      Alert.alert(strings.appName, strings.locationvalidation);
      return false;
    }
    if (userInfo.height) {
      if (!userInfo.height.height_type) {
        Alert.alert(strings.appName, strings.heightValidation);
        return false;
      }
      if (userInfo.height.height <= 0 || userInfo.height.height >= 1000) {
        Alert.alert(strings.appName, strings.validHeightValidation);
        return false;
      }
    }
    if (userInfo.weight) {
      if (!userInfo.weight.weight_type) {
        Alert.alert(strings.appName, strings.weightValidation);
        return false;
      }
      if (userInfo.weight.weight <= 0 || userInfo.weight.weight >= 1000) {
        Alert.alert(strings.appName, strings.validWeightValidation);
        return false;
      }
    }

    if (
      userInfo.phone_numbers &&
      userInfo.phone_numbers[0]?.phone_number.length < 10
    ) {
      Alert.alert(strings.appName, strings.phoneNumberValidation);
      return false;
    }
    if (
      userInfo.phone_numbers &&
      !userInfo.phone_numbers[0]?.country_code.length
    ) {
      Alert.alert(strings.appName, strings.phoneCodeValidation);
      return false;
    }

    return true;
  };

  const onSavePress = () => {
    if (checkValidation()) {
      setloading(true);
      const bodyParams = {...userInfo};
      updateUserProfile(bodyParams, authContext)
        .then(async (response) => {
          await Utility.setAuthContextData(response.payload, authContext);
          const accountType = getQBAccountType(response?.payload?.entity_type);
          QBupdateUser(
            response?.payload?.user_id,
            response?.payload,
            accountType,
            response.payload,
            authContext,
          )
            .then(() => {
              setloading(false);
              navigation.goBack();
            })
            .catch((error) => {
              console.log('QB error : ', error);
              setloading(false);
              navigation.goBack();
            });
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.appName, e.messages);
          }, 0.1);
          setloading(false);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.basicinfotitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.update}
        onRightButtonPress={() => {
          onSavePress();
        }}
        containerStyle={styles.headerRow}
      />

      <ActivityLoader visible={loading} />
      <EditBasicInfoComponent
        userInfo={userInfo}
        containerStyle={{paddingTop: 31}}
        setUserInfo={(obj) => {
          setUserInfo(obj);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingLeft: 10,
    paddingTop: 8,
    paddingRight: 15,
    paddingBottom: 12,
  },
});
