import React, {useContext, useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Tooltip} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';

export default function ChooseGenderScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [selected, setSelected] = useState(
    authContext?.entity?.obj?.gender
      ? (authContext?.entity?.obj?.gender === Verbs.male && 0) ||
          (authContext?.entity?.obj?.gender === Verbs.female && 1) ||
          (authContext?.entity?.obj?.gender === strings.other && 2)
      : 0,
  );

  const navigateToChooseLocationScreen = useCallback(
    (genderParam) => {
      navigation.navigate('ChooseLocationScreen', {
        signupInfo: {
          ...route.params.signupInfo,
          gender: genderParam,
        },
      });
    },
    [navigation, route.params.signupInfo],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          testID={'next-signupGender-button'}
          style={styles.nextButtonStyle}
          onPress={async () => {
            let gender = {};
            if (selected === 0) gender = Verbs.male;
            else if (selected === 1) gender = Verbs.female;
            else if (selected === 2) gender = strings.other;
            navigateToChooseLocationScreen(gender);
          }}>
          {strings.next}
        </Text>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selected, navigateToChooseLocationScreen]);

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

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <FastImage style={styles.background} source={images.loginBg} />
      <View style={{flex: 1}}>
        <View style={styles.genderTextContainer}>
          <Text style={styles.checkEmailText}>{strings.addGenderText}</Text>
          <Text style={styles.resetText}>{strings.notDisplayGenderText}</Text>
        </View>

        <Tooltip
          popover={
            <Text
              style={{
                color: colors.signUpTextColor,
                fontSize: 14,
                fontFamily: fonts.RRegular,
                flex: 1,
                padding: 15,
              }}>
              {strings.genderText}
            </Text>
          }
          backgroundColor={colors.parrotColor}
          height={153}
          width={305}
          overlayColor={'transparent'}
          skipAndroidStatusBar={true}
          containerStyle={{
            left: 25,
            padding: 0,
          }}>
          <Text style={styles.whyAskingText}>
            {strings.whyAskingGenderText}
          </Text>
        </Tooltip>

        <View
          style={{
            marginTop: 50,
            marginLeft: 25,
            marginRight: 25,
          }}>
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
      </View>
      <SafeAreaView>
        <View
          style={{
            bottom: 16,
          }}>
          <Text style={styles.canNotChangeGender}>
            {strings.canNotChangeGender}
          </Text>
        </View>
      </SafeAreaView>
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
    marginLeft: 25,
    marginTop: Platform.OS === 'ios' ? 40 + 25 : 25,
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 15,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    textAlign: 'left',
  },
  canNotChangeGender: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'left',
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
  genderTextContainer: {
    marginTop: 25,
  },
});
