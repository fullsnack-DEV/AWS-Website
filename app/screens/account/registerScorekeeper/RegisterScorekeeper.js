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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import ImagePicker from 'react-native-image-crop-picker';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import { getSportsList } from '../../../api/Games';
import AuthContext from '../../../auth/context';
import uploadImages from '../../../utils/imageAction';
import TCInnerLoader from '../../../components/TCInnerLoader';
import { getUserDetails } from '../../../api/Users';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThinDivider from '../../../components/TCThinDivider';

const MAX_CERTIFICATE_UPLOAD = 5;
export default function RegisterScorekeeper({ navigation }) {
  const authContext = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [scorekeeperData, setScorekeeperData] = useState([]);
  const [sportList, setSportList] = useState([]);
  const [sportsSelection, setSportsSelection] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [sports, setSports] = useState('');
  const [certificate, setCertificate] = useState([{ title: '' }]);
  const [description, onChangeText] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [languagesName, setLanguagesName] = useState('');

  const [imageUploadingLoader, setImageUploadingLoader] = useState(null);
  const selectedLanguage = [];
  const [validationError, setError] = useState(null);
  useEffect(() => {
    getSportsList(authContext).then((res) => {
      const sport = [];
      res.payload.map((item) => sport.push({
        label: item?.sport_name,
        value: item?.sport_name.toLowerCase(),
      }))
      setSportList([...sport]);
    })
    getUserDetails(authContext?.entity?.uid, authContext).then((res) => {
      setScorekeeperData(res?.payload?.scorekeeper_data)
    });
    const language = [
      { language: 'English', id: 1 },
      { language: 'English(Canada)', id: 2 },
      { language: 'English(Singapore)', id: 3 },
      { language: 'English(UK)', id: 4 },
      { language: 'English(US)', id: 5 },
      { language: 'Deutsch', id: 6 },
      { language: 'Italiano', id: 7 },
      { language: 'Korean', id: 8 },
    ];

    const arr = [];
    for (const tempData of language) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);
  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      })
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  const addMore = () => {
    setCertificate([...certificate, {}]);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderItem = ({ item, index }) => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.addCertificateView}>
          <TextInput
          placeholder={strings.titleOrDescriptionText}
          style={{
            ...styles.certificateDescription,
            borderWidth: validationError?.certificate === index ? 1 : 0,
            borderColor: colors.redDelColor,
          }}
          onChangeText={(text) => {
            const certi = certificate;
            certi[index] = {
              ...certi[index],
              title: text,
            }
            setCertificate([...certi])
          }}
          value={certificate?.[index]?.title}/>
        </View>
        {/* eslint-disable-next-line no-mixed-operators */}
        {/* {(item?.url || item?.title) ? ( */}
        <TouchableOpacity onPress={() => {
          if (certificate?.length === 1) {
            setCertificate([{}]);
          } else if (index !== (certificate?.length - 1)) {
            const certiUrl = certificate;
            certiUrl.splice(index, 1);
            setCertificate([...certiUrl]);
          }
        }}>
        </TouchableOpacity>
        {/* ) : null} */}
        {!item?.url && (
          <TouchableOpacity onPress={() => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true,
              maxFiles: 10,
            }).then((pickImages) => {
              setImageUploadingLoader(index);
              const certiUrl = certificate;
              certiUrl[index] = { ...certiUrl[index], url: pickImages?.sourceURL };
              setCertificate([...certiUrl])
              uploadImages([pickImages], authContext).then((responses) => {
                certiUrl[index] = {
                  ...certiUrl[index],
                  url: responses?.[0].fullImage ?? '',
                  thumbnail: responses?.[0].thumbnail ?? '',
                };
                setCertificate([...certiUrl])
              }).catch(() => {
                certiUrl.splice(index, 1);
                setCertificate([...certiUrl]);
              }).finally(() => {
                setTimeout(() => setImageUploadingLoader(null), 1500);
                if (certificate?.length < MAX_CERTIFICATE_UPLOAD) {
                  addMore();
                }
              })
            });
          }} style={styles.addCertificateButton}>
            <Text style={styles.addCertificateText} numberOfLines={1}>
              {strings.addCertificateTitle}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {item?.url && (
        <View style={{
          padding: 15, alignSelf: 'flex-start',
        }}>
          <View>
            <FastImage
                resizeMode={FastImage.resizeMode.cover}
                  source={{ uri: certificate?.[index]?.url }}
                  style={{ width: 195, height: 150, borderRadius: 10 }}
              />

            <TouchableOpacity style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              height: 22,
              width: 22,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              right: -10,
              top: -5,
            }}
                                  onPress={() => {
                                    const certi = certificate;
                                    delete certi[index].url;
                                    delete certi[index].thumbnail;
                                    setCertificate([...certi]);
                                  }}
                >
              <Image
                      source={images.menuClose}
                      style={{
                        zIndex: 100, tintColor: colors.whiteColor, height: 15, width: 15,
                      }}
                  />
            </TouchableOpacity>

            {index === imageUploadingLoader && (
              <View style={{
                alignSelf: 'center',
                position: 'absolute',
                height: 150,
                width: 195,
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.7)',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
                <TCInnerLoader visible={index === imageUploadingLoader} />
                <Text style={{
                  fontFamily: fonts.RLight, fontSize: 20, color: colors.yellowColor, marginLeft: 5,
                }}>Uploading...</Text>
              </View>
            )}

          </View>
        </View>
      )}
    </View>
  );
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
        style={ styles.listItem }
        onPress={ () => {
          isIconCheckedOrNot({ item, index });
        } }>
      <View style={{
 padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
      }}>
        <Text style={ styles.languageList }>{item.language}</Text>
        <View style={ styles.checkbox }>
          {languages[index].isChecked ? (
            <Image
                source={ images.orangeCheckBox }
                style={ styles.checkboxImg }
              />
          ) : (
            <Image source={ images.uncheckWhite } style={ styles.checkboxImg } />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const checkValidation = () => {
    if (!sports) {
      setError({ sports: 'Enter Sports' })
      Alert.alert('Towns Cup', 'Sports cannot be blank');
      return false;
    }

    const findCertiTitleIndex = certificate?.findIndex((item) => item?.title && (!item?.thumbnail || !item?.url))
    if (findCertiTitleIndex !== -1) {
      setError({ certificate: findCertiTitleIndex })
      Alert.alert('Towns Cup', 'Add certificate')
      return false;
    }

    const findIndex = certificate?.findIndex((item) => !item?.title && (item?.thumbnail || item?.url))
    if (findIndex !== -1) {
      setError({ certificate: findIndex })
      Alert.alert('Towns Cup', 'Add title for certificate')
      return false;
    }
    setError(null);
    const isExist = scorekeeperData?.filter((item) => item?.sport_name?.toLowerCase() === sports?.toLowerCase());
    if (isExist?.length) {
      Alert.alert('Towns Cup', `You are already registrated as a scorekeeper in ${sports}`);
      return false;
    }
    return true
  };
  const renderSports = ({ item }) => (
    <TouchableWithoutFeedback
          style={ styles.listItem }
          onPress={ () => setSportsSelection(item?.value) }>
      <View style={{
          padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
      }}>
        <Text style={ styles.languageList }>{item.value}</Text>
        <View style={ styles.checkbox }>
          {sportsSelection === item?.value ? (
            <Image
                    source={ images.radioSelectYellow }
                    style={ styles.checkboxImg }
                />
            ) : (
              <Image source={ images.radioUnselect } style={ styles.checkboxImg } />
            )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <TCKeyboardView>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
        </View>
        <Text style={styles.LocationText}>
          {strings.sportsEventsTitle}
          <Text style={styles.mendatory}> {strings.star}</Text>
        </Text>
        {/* <RNPickerSelect
        placeholder={{
          label: strings.selectSportPlaceholder,
          value: null,
        }}
        items={sportList}
        onValueChange={(value) => {
          setSports(value);
        }}
        useNativeAndroidPickerStyle={false}
        // eslint-disable-next-line no-sequences
        style={{
          ...(Platform.OS === 'ios'
            ? { ...styles.inputIOS }
            : { ...styles.inputAndroid },
          { ...styles }),
        }}
        value={sports}
        Icon={() => (
          <Image source={images.dropDownArrow} style={styles.downArrow} />
        )}
      /> */}
        <TouchableOpacity onPress={ () => setVisibleSportsModal(true) }>
          <View style={ styles.searchView }>
            <TextInput
                style={ styles.searchTextField }
                placeholder={ strings.selectSportPlaceholder }
                value={sports}
                editable={ false }
                pointerEvents="none"/>
          </View>
        </TouchableOpacity>
        <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={styles.LocationText}>{strings.descriptionText}</Text>
        </View>
        <TextInput
        style={styles.descriptionTxt}
        onChangeText={(text) => onChangeText(text)}
        value={description}
        multiline
        textAlignVertical={'top'}
        numberOfLines={4}
        placeholder={strings.descriptionScorekeeperPlaceholder}
      />

        <Text style={styles.LocationText}>{strings.certificateTitle}</Text>
        <Text style={styles.certificateSubText}>
          {strings.certificateSubTitle}
        </Text>

        <FlatList
        scrollEnabled={false}
        data={certificate}
        renderItem={renderItem}
      />
        <Text style={ styles.LocationText }>
          {strings.languageTitle}
          <Text style={ styles.smallTxt }> {strings.opetionalText} </Text>
        </Text>

        <TouchableOpacity onPress={ toggleModal }>
          <View style={ styles.searchView }>
            <TextInput
            style={ styles.searchTextField }
            placeholder={ strings.languagePlaceholder }
            value={languagesName}
            editable={ false }
            pointerEvents="none"/>
          </View>
        </TouchableOpacity>
        {!imageUploadingLoader && (
          <TouchableOpacity
              onPress={() => {
                const isValid = checkValidation();
                if (isValid) {
                  let bodyParams = {};
                  const scorekeeper_data = [];
                  bodyParams.sport_name = sports.charAt(0).toUpperCase() + sports.slice(1);
                  bodyParams.descriptions = description;
                  const languageList = [];
                  if (selectedLanguages?.length) selectedLanguages.map((item) => languageList.push({ language_name: item }))
                  bodyParams.language = languageList;
                  bodyParams.certificates = certificate;
                  scorekeeper_data[0] = bodyParams;
                  bodyParams = { scorekeeper_data };
                  navigation.navigate('RegisterScorekeeperForm2', { bodyParams, scorekeeperData });
                }
              }}>
            <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.nextButton}>
              <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <Modal
        isVisible={ isModalVisible }
        backdropColor="black"
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        backdropOpacity={ 0 }
        style={ {
 marginLeft: 0, backgroundColor: 'rgba(0,0,0,0.5)', marginRight: 0, marginBottom: 0,
        } }>
          <View
          style={ {
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
          } }>
            <View style={{
 flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between', alignItems: 'center',
            }}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Image source={images.cancelImage} style={styles.closeButton}/>
              </TouchableOpacity>
              <Text
            style={ {
              alignSelf: 'center',
              marginVertical: 20,
              fontSize: 16,
              fontFamily: fonts.RBold,
              color: colors.lightBlackColor,
            } }>
                Languages
              </Text>
              <TouchableOpacity onPress={() => {
                for (const temp of languages) {
                  if (temp.isChecked) {
                    selectedLanguage.push(temp.language);
                  }
                }
                setSelectedLanguages(selectedLanguage);
                toggleModal();
              }}>
                <Text
                  style={ {
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
            <View style={ styles.separatorLine } />
            <FlatList
                ItemSeparatorComponent={() => <TCThinDivider/>}
                data={ languages }
                keyExtractor={(item, index) => index.toString()}
                renderItem={ renderLanguage }
          />
          </View>
        </Modal>

        <Modal
            isVisible={ visibleSportsModal }
            backdropColor="black"
            onBackdropPress={() => setVisibleSportsModal(false)}
            onRequestClose={() => setVisibleSportsModal(false)}
            backdropOpacity={ 0 }
            style={ {
              marginLeft: 0, backgroundColor: 'rgba(0,0,0,0.5)', marginRight: 0, marginBottom: 0,
            } }>
          <View
              style={ {
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
              } }>
            <View style={{
              flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between', alignItems: 'center',
            }}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setVisibleSportsModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton}/>
              </TouchableOpacity>
              <Text
                  style={ {
                    alignSelf: 'center',
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    color: colors.lightBlackColor,
                  } }>
                Sports
              </Text>
              <TouchableOpacity onPress={() => {
                setSports(sportsSelection);
                setVisibleSportsModal(false);
              }}>
                <Text
                    style={ {
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
            <View style={ styles.separatorLine } />
            <FlatList
                ItemSeparatorComponent={() => <TCThinDivider/>}
                data={ sportList }
                keyExtractor={(item, index) => index.toString()}
                renderItem={ renderSports }
            />
          </View>
        </Modal>
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  certificateSubText: {
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginTop: 8,
    paddingLeft: 15,
    textAlign: 'left',
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },

  addCertificateView: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginTop: 12,
    marginBottom: 12,
    width: wp('92%'),
    alignSelf: 'center',
  },
  addCertificateButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.userPostTimeColor,
    borderRadius: 6,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginTop: '5%',
    paddingHorizontal: 5,
  },
  addCertificateText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,

    fontSize: 12,
  },

  certificateDescription: {
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 18,
    marginVertical: 10,
  },
  mendatory: {
    color: 'red',
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
  checkbox: {
  },
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
  LocationText: {
    marginTop: hp('2%'),
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,
  },
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
    // fontFamily: fonts.RBold,
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
