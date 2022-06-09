import React, {useContext, useEffect, useState} from 'react';
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
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import {getUserDetails} from '../../../api/Users';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop, getSportName, languageList} from '../../../utils';
import TCFormProgress from '../../../components/TCFormProgress';
import TCLabel from '../../../components/TCLabel';
import TCGradientButton from '../../../components/TCGradientButton';

export default function RegisterReferee({navigation}) {
  const authContext = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refereesData, setRefereesData] = useState([]);
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
    setSportList(authContext.sports);

    getUserDetails(authContext?.entity?.uid, authContext).then((res) => {
      setRefereesData(res?.payload?.referee_data);
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

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);

    for (const temp of languages) {
      if (temp.isChecked) {
        selectedLanguage.push(temp.language);
      }
    }
    setSelectedLanguages(selectedLanguage);
  };
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

  const checkValidation = () => {
    if (!sports) {
      Alert.alert(strings.appName, 'Sports cannot be blank');
      return false;
    }

    console.log('refereesData', refereesData);

    console.log('sports', sports);

    const isExist = refereesData?.filter((item) => item?.sport === sports);
    if (isExist?.length) {
      Alert.alert(
        strings.appName,
        `You are already registrated as a referee in ${sports}`,
      );
      return false;
    }
    return true;
  };
  const renderSports = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => setSportsSelection(item)}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportsSelection?.sport === item?.sport ? (
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
      const bodyParams = {
        sport: sportsSelection.sport,
        descriptions: description,
        is_active: true,
      };
      const languageData = [];
      if (selectedLanguages?.length) {
        selectedLanguages.map((item) =>
          languageData.push({language_name: item}),
        );
      }
      bodyParams.language = languageData;
      // bodyParams.certificates = certificate;

      console.log('Body::=>', bodyParams);

      navigation.navigate('RegisterRefereeForm2', {
        bodyParams,
      });
    }
  };

  return (
    <>
      <TCKeyboardView style={{flex: 1}}>
        <ScrollView>
          <TCFormProgress totalSteps={2} curruentStep={1} />

          <View>
            <TCLabel title={strings.whichSport} required={false} />
            <TouchableOpacity onPress={() => setVisibleSportsModal(true)}>
              <View style={styles.searchView}>
                <TextInput
                  style={styles.searchTextField}
                  placeholder={strings.selectSportPlaceholder}
                  value={getSportName(sportsSelection, authContext)}
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

          <View style={{marginBottom: 10}}>
            <TCLabel title={strings.describeSelf} required={false} />
            <TextInput
              style={styles.descriptionTxt}
              onChangeText={(text) => onChangeText(text)}
              value={description}
              multiline
              textAlignVertical={'top'}
              numberOfLines={4}
              placeholder={strings.descriptionRefereePlaceholder}
            />
          </View>
        </ScrollView>
      </TCKeyboardView>

      <SafeAreaView>
        <TCGradientButton
          isDisabled={sports === '' || selectedLanguages?.length <= 0}
          title={strings.nextTitle}
          style={{marginBottom: 5}}
          onPress={nextOnPress}
        />
      </SafeAreaView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          marginLeft: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginRight: 0,
          marginBottom: 0,
          marginTop: 0,
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
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
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
                setSports(sportsSelection?.sport);
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
    shadowOffset: {width: 0, height: 1},
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
