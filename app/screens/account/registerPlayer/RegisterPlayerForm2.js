import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import {patchPlayer} from '../../../api/Users';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TCThinDivider from '../../../components/TCThinDivider';
import TCFormProgress from '../../../components/TCFormProgress';
import TCGradientButton from '../../../components/TCGradientButton';
import {languageList} from '../../../utils';

export default function RegisterPlayerForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languagesName, setLanguagesName] = useState('');
  const [languages, setLanguages] = useState([]);
  const selectedLanguage = [];
  useEffect(() => {
    const arr = [];
    for (const tempData of languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);
  };

  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      });
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  const renderLanguage = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          {languages[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const doneOnPress = () => {
    setloading(true);
    const bodyParams = {...route?.params?.bodyParams};
    bodyParams.descriptions = description;
    bodyParams.is_published = true;
    bodyParams.type = 'player';
    bodyParams.currency_type = authContext?.entity?.obj?.currency_type;
    bodyParams.language = selectedLanguages;
    const auth = {
      ...authContext?.entity?.obj,
      sport_setting: {},
    };

    let registerdPlayerData = authContext?.entity?.obj?.registered_sports || [];

    if (
      authContext?.entity?.obj?.registered_sports?.some(
        (obj) =>
          obj.sport === bodyParams.sport &&
          obj.sport_type === bodyParams.sport_type,
      )
    ) {
      registerdPlayerData = authContext?.entity?.obj?.registered_sports.map(
        (item) =>
          item.sport === bodyParams.sport &&
          item.sport_type === bodyParams.sport_type
            ? {
                ...item,
                is_published: true,
              }
            : item,
      );
    } else {
      registerdPlayerData.push(bodyParams);
    }

    const body = {
      ...auth,
      registered_sports: registerdPlayerData,
    };

    console.log('body', body);
    console.log('body params', bodyParams);
    console.log('body registerdPlayerData', registerdPlayerData);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register player response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          Alert.alert(
            `${Utility.getSportName(bodyParams, authContext)} added to Playing`,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('AccountScreen', {
                    createdSportName: route?.params?.bodyParams?.sport,
                    sportType: route?.params?.bodyParams?.sport_type,
                  });
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      })
      .catch(() => setloading(false));
  };

  return (
    <View style={{flex: 1}} keyboardShouldPersistTaps="never">
      <TCFormProgress totalSteps={2} curruentStep={2} />
      <KeyboardAwareScrollView>
        <ScrollView>
          <ActivityLoader visible={loading} />

          <Text style={styles.LocationText}>{strings.languageText}</Text>
          <TouchableOpacity testID="choose-language" onPress={toggleModal}>
            <View style={styles.searchView}>
              <TextInput
                style={styles.searchTextField}
                placeholder={strings.languagePlaceholder}
                value={languagesName}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.LocationText}>
              {strings.descriptionTextDetails}
            </Text>
          </View>
          <TextInput
            testID="register-player-description"
            style={styles.descriptionTxt}
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
            textAlignVertical={'top'}
            numberOfLines={4}
            maxLength={1000}
            placeholder={strings.descriptionTextDetails}
          />
          <View style={{flex: 1}} />
        </ScrollView>
      </KeyboardAwareScrollView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
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
              hitSlop={Utility.getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
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
              Languages
            </Text>
            <TouchableOpacity
              onPress={() => {
                for (const temp of languages) {
                  if (temp.isChecked) {
                    selectedLanguage.push(temp.language);
                  }
                }
                setSelectedLanguages(selectedLanguage);
                toggleModal();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={languages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLanguage}
          />
        </View>
      </Modal>
      <TCGradientButton
        isDisabled={languagesName === ''}
        title={strings.doneTitle}
        style={{marginBottom: 30}}
        onPress={doneOnPress}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  LocationText: {
    marginTop: hp('3%'),
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,
  },
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  descriptionTxt: {
    height: 120,
    fontSize: wp('3.8%'),
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 5,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    fontSize: wp('3.8%'),
    width: wp('80%'),
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
  checkbox: {},
});
