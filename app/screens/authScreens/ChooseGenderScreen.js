import React, {
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  // eslint-disable-next-line react-native/split-platform-components,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Tooltip} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';

export default function ChooseGenderScreen({navigation, route}) {
  const [currentLocation, setCurrentLocation] = useState();
  const authContext = useContext(AuthContext);
  const [selected, setSelected] = useState(
    authContext?.entity?.obj?.gender
      ? (authContext?.entity?.obj?.gender === Verbs.male && 0) ||
          (authContext?.entity?.obj?.gender === Verbs.female && 1) ||
          (authContext?.entity?.obj?.gender === strings.other && 2)
      : 0,
  );
  const [loading, setLoading] = useState(false);
  const navigateToChooseLocationScreen = useCallback(
    (genderParam) => {
      setLoading(false);
      navigation.navigate('ChooseLocationScreen', {
        signupInfo: {
          ...route?.params?.signupInfo,
          gender: genderParam,
          location: currentLocation,
        },
      });
    },
    [currentLocation, navigation, route?.params?.signupInfo],
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
  useEffect(() => {
    setLoading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((location) => {
        setCurrentLocation(location);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

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
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
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
          <Text style={styles.whyAskingText}>
            {strings.whyAskingGenderText}
          </Text>
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
      </View>
      <SafeAreaView>
        <View
          style={{
            // flex: 1,
            // justifyContent: 'flex-end',
            // marginBottom: 100,
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
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
});
