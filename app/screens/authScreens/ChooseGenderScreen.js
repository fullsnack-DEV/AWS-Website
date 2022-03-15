import React, {useContext, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigationState} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Tooltip} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import * as Utility from '../../utils/index';
import TCButton from '../../components/TCButton';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {updateUserProfile} from '../../api/Users';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';

export default function ChooseGenderScreen({navigation}) {
  const authContext = useContext(AuthContext);
  console.log('authContextauthContext', authContext);
  const [selected, setSelected] = useState(
    authContext?.entity?.obj?.gender
      ? (authContext?.entity?.obj?.gender === 'male' && 0) ||
          (authContext?.entity?.obj?.gender === 'female' && 1) ||
          (authContext?.entity?.obj?.gender === 'other' && 2)
      : 0,
  );
  const [loading, setLoading] = useState(false);
  const routes = useNavigationState((state) => state);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            const routeObj = routes?.routes?.[routes?.index] ?? {};
            const routeName =
              routeObj?.state?.routes?.[routeObj?.state?.index]?.name;

            if (routeName === 'AddBirthdayScreen') {
              navigation.pop(2);
            } else {
              navigation.navigate('AddBirthdayScreen');
            }
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 15,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation,selected]);
  const RenderRadio = ({isSelected, onRadioPress}) => (
    <View
      style={{
        flex: 0.1,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          borderColor: colors.whiteColor,
          height: 22,
          width: 22,
          borderWidth: 1,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onRadioPress}>
        {isSelected && (
          <View
            style={{
              height: 13,
              width: 13,
              borderRadius: 50,
              backgroundColor: colors.whiteColor,
            }}></View>
        )}
      </TouchableOpacity>
    </View>
  );

  const updateProfile = async (params, callback) => {
    setLoading(true);
    updateUserProfile(params, authContext)
      .then(async (userResoponse) => {
        const userData = userResoponse?.payload;
        const entity = {...authContext?.entity};
        entity.auth.user = userData;
        entity.obj = userData;
        await Utility.setStorage('loggedInEntity', {...entity});
        await Utility.setStorage('authContextEntity', {...entity});
        await Utility.setStorage('authContextUser', {...userData});
        await authContext.setUser({...userData});
        await authContext.setEntity({...entity});
        setLoading(false);
        callback();
      })
      .catch(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <Text style={styles.checkEmailText}>{strings.addGenderText}</Text>
      <Text style={styles.resetText}>{strings.notDisplayGenderText}</Text>

      <Tooltip
        popover={
          <Text style={{color: colors.themeColor, fontSize: 14}}>
            {strings.genderText}
          </Text>
        }
        backgroundColor={colors.parrotColor}
        height={hp('22%')}
        width={wp('75%')}
        overlayColor={'transparent'}
        skipAndroidStatusBar={true}>
        <Text style={styles.whyAskingText}>{strings.whyAskingGenderText}</Text>
      </Tooltip>

      <View style={{marginTop: 40, marginLeft: 20}}>
        <View style={styles.radioButtonView}>
          <RenderRadio
            isSelected={selected === 0}
            onRadioPress={() => setSelected(0)}
          />
          <Text style={styles.radioText}>{strings.maleRadioText}</Text>
        </View>
        <View style={styles.radioButtonView}>
          <RenderRadio
            isSelected={selected === 1}
            onRadioPress={() => setSelected(1)}
          />
          <Text style={styles.radioText}>{strings.femaleRadioText}</Text>
        </View>
        <View style={styles.radioButtonView}>
          <RenderRadio
            isSelected={selected === 2}
            onRadioPress={() => setSelected(2)}
          />
          <Text style={styles.radioText}>{strings.otherRadioText}</Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 100,
          // backgroundColor: colors.redColor,
        }}>
        <Text style={styles.canNotChangeGender}>
          {strings.canNotChangeGender}
        </Text>
      </View>
      <TCButton
        title={strings.continueCapTitle}
        onPress={async () => {
          let gender = {};
          if (selected === 0) gender = 'male';
          else if (selected === 1) gender = 'female';
          else if (selected === 2) gender = 'other';
          updateProfile({gender}, () => {
            navigation.navigate('ChooseLocationScreen');
          });
        }}
        extraStyle={{bottom: hp('4%'), position: 'absolute'}}
      />
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
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 15,
    marginTop: 20,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
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
  canNotChangeGender: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 25,
    marginRight: 25,
    textAlign: 'left',
  },
});
