import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import { getSportsList } from '../../../api/Games';
import AuthContext from '../../../auth/context';
import { getUserDetails } from '../../../api/Users';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThinDivider from '../../../components/TCThinDivider';
import { languageList } from '../../../utils';
import TCFormProgress from '../../../components/TCFormProgress';
import TCLabel from '../../../components/TCLabel';
import TCGradientButton from '../../../components/TCGradientButton';

export default function RegisterScorekeeper({ navigation }) {
  const authContext = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [scorekeepersData, setScorekeepersData] = useState([]);
  const [sportList, setSportList] = useState([]);
  const [sports, setSports] = useState('');
  const [sportsSelection, setSportsSelection] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [description, onChangeText] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [languagesName, setLanguagesName] = useState('');

  const selectedLanguage = [];
  useEffect(() => {
    getSportsList(authContext).then((res) => {
      const sport = [];
      res.payload.map((item) => sport.push({
          label: item?.sport_name,
          value: item?.sport_name.toLowerCase(),
        }));
      setSportList([...sport]);
    });
    getUserDetails(authContext?.entity?.uid, authContext).then((res) => {
      setScorekeepersData(res?.payload?.scorekeeper_data);
    });

    const arr = [];
    for (const tempData of languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, [authContext]);
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const isIconCheckedOrNot = ({ item, index }) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);

    for (const temp of languages) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setSelectedLanguages(selectedLanguage);
  };
  const renderLanguage = ({ item, index }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({ item, index });
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

  const checkValidation = () => {
    if (!sports) {
      Alert.alert('Towns Cup', 'Sports cannot be blank');
      return false;
    }

    const isExist = scorekeepersData?.filter(
      (item) => item?.sport_name?.toLowerCase() === sports?.toLowerCase(),
    );
    if (isExist?.length) {
      Alert.alert(
        'Towns Cup',
        `You are already registrated as a scorekeeper in ${sports}`,
      );
      return false;
    }
    return true;
  };
  const renderSports = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => setSportsSelection(item?.value)}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.value}</Text>
        <View style={styles.checkbox}>
          {sportsSelection === item?.value ? (
            <Image
              source={images.radioSelectYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
  const nextOnPress = () => {
    const isValid = checkValidation();
    if (isValid) {
      let bodyParams = {};
      const scorekeeper_data = [];
      bodyParams.sport_name = sports.charAt(0).toUpperCase() + sports.slice(1);
      bodyParams.descriptions = description;
      const languageData = [];
      if (selectedLanguages?.length) {
        selectedLanguages.map((item) => languageData.push({ language_name: item }));
      }
      bodyParams.language = languageData;
      // bodyParams.certificates = certificate;
      scorekeeper_data[0] = bodyParams;
      bodyParams = { scorekeeper_data };
      console.log('Body::=>', bodyParams);

      navigation.navigate('RegisterScorekeeperForm2', {
        bodyParams,
        scorekeepersData,
      });
    }
  };

  return (
    <>
      <TCKeyboardView style={{ flex: 1 }}>
        <ScrollView>
          <TCFormProgress totalSteps={2} curruentStep={1} />

          <View>
            <TCLabel title={strings.whichSportScorekeeper} required={false} />
            <TouchableOpacity onPress={() => setVisibleSportsModal(true)}>
              <View style={styles.searchView}>
                <TextInput
                style={styles.searchTextField}
                placeholder={strings.selectSportPlaceholder}
                value={sports}
                editable={false}
                pointerEvents="none"
              />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TCLabel title={strings.whichLanguage} required={false} />
            <TouchableOpacity onPress={toggleModal}>
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
          </View>

          <View style={{ marginBottom: 10 }}>
            <TCLabel title={strings.describeSelf} required={false} />
            <TextInput
              style={styles.descriptionTxt}
              onChangeText={(text) => onChangeText(text)}
              value={description}
              multiline
              textAlignVertical={'top'}
              numberOfLines={4}
              placeholder={strings.descriptionScorekeeperPlaceholder}
            />
          </View>
        </ScrollView>
      </TCKeyboardView>

      <SafeAreaView>
        <TCGradientButton
            isDisabled={sports === '' || selectedLanguages?.length <= 0}
            title={strings.nextTitle}
            style={{ marginBottom: 5 }}
            onPress={nextOnPress}
          />
      </SafeAreaView>

      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        backdropOpacity={0}
        style={{
          marginLeft: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginRight: 0,
          marginBottom: 0,
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
            shadowOffset: { width: 0, height: 1 },
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

      <Modal
        isVisible={visibleSportsModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        backdropOpacity={0}
        style={{
          marginLeft: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginRight: 0,
          marginBottom: 0,
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
            shadowOffset: { width: 0, height: 1 },
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
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
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
            <TouchableOpacity
              onPress={() => {
                setSports(sportsSelection);
                setVisibleSportsModal(false);
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
            data={sportList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({

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
  checkbox: {},
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    height: 40,

    marginTop: 12,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
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

  listItem: {
    marginTop: 5,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
