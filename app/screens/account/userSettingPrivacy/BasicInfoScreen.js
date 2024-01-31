import React, {useState, useLayoutEffect, useContext, useEffect} from 'react';
import {Alert, SafeAreaView, Text} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {getUserDetails, updateUserProfile} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import * as Utility from '../../../utils/index';
import ScreenHeader from '../../../components/ScreenHeader';
import EditBasicInfoComponent from '../../../components/EditBasicInfoComponent';
import AccountBasicInfoShimmer from '../../../components/shimmer/account/AccountBasicInfoShimmer';
import TCKeyboardView from '../../../components/TCKeyboardView';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {ModalTypes} from '../../../Constants/GeneralConstants';

export default function BasicInfoScreen({navigation}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isFocused) {
      if (isFocused) {
        setloading(true);
        getUserDetails(authContext.entity?.uid, authContext)
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
  }, [authContext, isFocused]);

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
      userInfo.phone_numbers[0]?.country_code &&
      userInfo.phone_numbers[0]?.country_code.length > 0
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
        .then((response) => {
          navigation.goBack();

          Utility.setAuthContextData(response.payload, authContext);
          setloading(false);
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
        rightButtonText={strings.updateText}
        onRightButtonPress={() => {
          onSavePress();
        }}
      />

      {loading ? (
        <AccountBasicInfoShimmer />
      ) : (
        <TCKeyboardView>
          <EditBasicInfoComponent
            userInfo={userInfo}
            containerStyle={{paddingTop: 31}}
            setUserInfo={(obj) => {
              const UpdatedObj = obj;

              if (obj?.phone_numbers?.length > 0) {
                UpdatedObj.phone_numbers = obj?.phone_numbers;
              } else {
                UpdatedObj.phone_numbers = userInfo?.phone_numbers;
              }

              setUserInfo(UpdatedObj);
            }}
            onPressInfoButton={() => {
              setShowInfo(true);
            }}
          />
        </TCKeyboardView>
      )}

      <CustomModalWrapper
        isVisible={showInfo}
        closeModal={() => setShowInfo(false)}
        modalType={ModalTypes.style2}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            color: colors.lightBlackColor,
            fontFamily: fonts.RRegular,
          }}>
          {strings.basicInfoModalText}
        </Text>
      </CustomModalWrapper>
    </SafeAreaView>
  );
}
