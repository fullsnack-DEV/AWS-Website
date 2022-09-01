import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as RNLocalize from 'react-native-localize';

import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop, setStorage} from '../../../utils';
import {localize_language} from '../../../utils/constant';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {patchPlayer} from '../../../api/Users';

export default function LanguageSettingScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [visibleLanguageModal, setVisibleLanguageModal] = useState(false);

  const [languagesData] = useState(localize_language);
  const [languageSelection, setLanguageSelection] = useState(
    authContext.entity.auth.user?.language_setting ?? localize_language[0],
  );
  const [confirmLanguage, setConfirmLanguage] = useState(
    authContext.entity.auth.user?.language_setting ?? localize_language[0],
  );

  const [isEnabled, setIsEnabled] = useState(
    authContext.entity.auth.user?.device_language ?? false,
  );

  const toggleSwitch = () => setIsEnabled(!isEnabled);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          onPress={() => {
            setloading(true);
            patchPlayer(
              {language_setting: confirmLanguage, device_language: isEnabled},
              authContext,
            )
              .then(async (response) => {
                if (response.status === true) {
                  setloading(false);
                  const entity = authContext.entity;
                  entity.auth.user = response.payload;
                  entity.obj = response.payload;
                  authContext.setEntity({...entity});
                  authContext.setUser(response.payload);
                  await setStorage('authContextUser', response.payload);
                  await setStorage('authContextEntity', {...entity});
                  if (isEnabled) {
                    strings.setLanguage(
                      RNLocalize.getLocales()[0].languageCode,
                    );
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
          }}
          style={styles.saveButtonStyle}>
          {strings.save}
        </Text>
      ),
    });
  }, [authContext, confirmLanguage, isEnabled, navigation]);

  const renderLanguages = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setLanguageSelection(item);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.name}</Text>
        <View style={styles.checkbox}>
          {languageSelection?.name === item?.name ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <ActivityLoader visible={loading} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.switchContainer}>
            <Text style={styles.titleColor}>{strings.useDeviceLangTitle}</Text>
            <Switch
              trackColor={{
                false: colors.grayColor,
                true: colors.themeColor,
              }}
              thumbColor={colors.whiteColor}
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{marginRight: 15, marginTop: 15}}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              marginLeft: 15,
              marginTop: 15,
            }}>
            {strings.appLanguage}
          </Text>
          <TouchableOpacity
            disabled={isEnabled}
            onPress={() => setVisibleLanguageModal(true)}>
            <View style={styles.searchView}>
              <Text style={styles.languageTextStyle}>
                {confirmLanguage.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        isVisible={visibleLanguageModal}
        onBackdropPress={() => setVisibleLanguageModal(false)}
        onRequestClose={() => setVisibleLanguageModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleLanguageModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Sports
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}
              onPress={() => {
                setConfirmLanguage(languageSelection);
                setTimeout(() => {
                  setVisibleLanguageModal(false);
                }, 300);
              }}>
              {strings.apply}
            </Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={languagesData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLanguages}
          />
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 12,
    height: 42,
    width: wp('92%'),
    alignItems: 'center',
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('100%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  saveButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
  },
  titleColor: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginTop: 15,
  },
  languageTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
