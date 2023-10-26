import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import ToggleSwitch from 'toggle-switch-react-native';
import * as RNLocalize from 'react-native-localize';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {localize_language} from '../../../utils/constant';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {patchPlayer} from '../../../api/Users';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {setAuthContextData} from '../../../utils';

export default function LanguageSettingScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [visibleLanguageModal, setVisibleLanguageModal] = useState(false);

  const [languagesData] = useState(localize_language);
  const [languageSelection, setLanguageSelection] = useState({});
  const [confirmLanguage, setConfirmLanguage] = useState(
    authContext.entity.obj.language_setting ?? localize_language[0],
  );

  const [isEnabled, setIsEnabled] = useState(
    authContext.entity.obj.device_language ?? false,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const saveUser = () => {
    setloading(true);
    const params = {
      language_setting: confirmLanguage,
      device_language: isEnabled,
    };
    patchPlayer(params, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          await setAuthContextData(response.payload, authContext);
          if (isEnabled) {
            strings.setLanguage(RNLocalize.getLocales()[0].languageCode);
          } else {
            strings.setLanguage(confirmLanguage.code);
          }
          navigation.goBack();
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        title={strings.appLanguage}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={saveUser}
        containerStyle={styles.headerRow}
      />
      <ActivityLoader visible={loading} />
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <View>
            <Text style={styles.label}>{strings.useDeviceLangTitle}</Text>
          </View>

          <ToggleSwitch
            isOn={isEnabled}
            onToggle={() => {
              setIsEnabled(!isEnabled);
            }}
            onColor={colors.greenColorCard}
            offColor={colors.userPostTimeColor}
          />
        </View>
        <Text style={styles.label}>{strings.appLanguage}</Text>
        <TouchableOpacity
          style={{opacity: isEnabled ? 0.3 : 1}}
          disabled={isEnabled}
          onPress={() => setVisibleLanguageModal(true)}>
          <View style={styles.searchView}>
            <Text style={styles.languageTextStyle}>{confirmLanguage.name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <CustomModalWrapper
        isVisible={visibleLanguageModal}
        closeModal={() => setVisibleLanguageModal(false)}
        modalType={ModalTypes.style1}
        title={strings.languages}
        containerStyle={{paddingHorizontal: 30}}
        headerRightButtonText={strings.apply}
        onRightButtonPress={() => {
          setVisibleLanguageModal(false);
          setConfirmLanguage(languageSelection);
        }}>
        <FlatList
          data={languagesData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <>
              <Pressable
                style={styles.listItem}
                onPress={() => {
                  setLanguageSelection(item);
                }}>
                <Text style={styles.languageTextStyle}>{item.name}</Text>
                <View style={styles.checkbox}>
                  {languageSelection?.name === item?.name ? (
                    <Image
                      source={images.radioCheckYellow}
                      style={styles.checkboxImg}
                    />
                  ) : (
                    <Image
                      source={images.radioUnselect}
                      style={styles.checkboxImg}
                    />
                  )}
                </View>
              </Pressable>
              <View style={styles.separatorLine} />
            </>
          )}
        />
      </CustomModalWrapper>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingLeft: 10,
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 14,
  },
  container: {
    paddingTop: 28,
    paddingLeft: 20,
    paddingRight: 15,
  },
  searchView: {
    padding: 12,
    marginTop: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayBackground,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginTop: 17,
    marginBottom: 20,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  languageTextStyle: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
});
