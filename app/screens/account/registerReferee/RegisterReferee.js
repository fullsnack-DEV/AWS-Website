import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
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

import RNPickerSelect from 'react-native-picker-select';
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

export default function RegisterReferee({ navigation }) {
  const authContext = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refereesData, setRefereesData] = useState([]);
  const [sportList, setSportList] = useState([]);
  const [sports, setSports] = useState('');
  const [certificate, setCertificate] = useState([{ title: '' }]);
  const [description, onChangeText] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
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
      setRefereesData(res?.payload?.referee_data)
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
          <Text style={styles.delete}>{strings.deleteTitle}</Text>
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
                addMore();
              })
            });
          }} style={styles.addCertificateButton}>
            <Text style={styles.addCertificateText}>
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
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({ item, index });
      }}>
      <View>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          {languages[index].isChecked ? (
            <Image
              source={images.checkWhiteLanguage}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
        <View style={styles.shortSeparatorLine}></View>
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
    const isExist = refereesData?.filter((item) => item?.sport_name?.toLowerCase() === sports?.toLowerCase());
    if (isExist?.length) {
      Alert.alert('Towns Cup', `You are already registrated as a referee in ${sports}`);
      return false;
    }
    return true
  };

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
        <RNPickerSelect
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
      />

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
        numberOfLines={4}
        placeholder={strings.descriptionRefereePlaceholder}
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
        <Text style={styles.LocationText}>{strings.languageTitle}</Text>
        <View style={styles.searchView}>
          <TouchableOpacity onPress={toggleModal}>
            <TextInput
            style={ styles.searchTextField }
            placeholder={ strings.languagePlaceholder }
            value={ selectedLanguages?.join(' , ')?.toString() ?? ''}
            editable={ false }
            pointerEvents="none"></TextInput>
          </TouchableOpacity>
        </View>

        <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        backdropOpacity={0}
        style={{ marginLeft: 0, marginRight: 0, marginBottom: 0 }}>
          <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 2,
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
          }}>
            <Text
            style={{
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 20,
              fontSize: 16,
              fontFamily: fonts.RBold,
              color: colors.lightBlackColor,
            }}>
              Languages
            </Text>
            <View style={styles.separatorLine}></View>
            <FlatList
            data={languages}
            keyExtractor={(item, i) => i.toString()}
            renderItem={renderLanguage}
            style={{ marginBottom: '25%' }}
          />
            <View
            style={{
              width: '100%',
              height: '25%',
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,

              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
            }}>
              <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}>
                <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.languageApplyButton}>
                  <Text style={styles.nextButtonText}>{strings.applyTitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {!imageUploadingLoader && (
          <TouchableOpacity
              onPress={() => {
                const isValid = checkValidation();
                if (isValid) {
                  let bodyParams = {};
                  const referee_data = [];
                  bodyParams.sport_name = sports.charAt(0).toUpperCase() + sports.slice(1);
                  bodyParams.descriptions = description;
                  const languageList = [];
                  if (selectedLanguages?.length) selectedLanguages.map((item) => languageList.push({ language_name: item }))
                  bodyParams.language = languageList;
                  bodyParams.certificates = certificate;
                  referee_data[0] = bodyParams;
                  bodyParams = { referee_data };
                  navigation.navigate('RegisterRefereeForm2', { bodyParams, refereesData });
                }
              }}>
            <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.nextButton}>
              <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  LocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginTop: hp('2%'),
    paddingLeft: 15,
    textAlign: 'left',
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

  descriptionTxt: {
    height: 120,
    // alignSelf: 'center',
    width: wp('92%'),
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 12,
    alignSelf: 'center',
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

  downArrow: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',

    right: 25,
    tintColor: colors.grayColor,
    top: 22,
    width: 18,
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
    width: '35%',
  },
  addCertificateText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,

    fontSize: 12,
  },
  delete: {
    alignSelf: 'flex-end',
    color: colors.fbTextColor,
    marginRight: 15,
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
  languageApplyButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('5%'),
    width: '90%',
  },
  shortSeparatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('90%'),
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  checkboxImg: {
    width: wp('5.5%'),

    // paddingLeft: wp('25%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    // tintColor: colors.grayColor,
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp('5%'),
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
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    height: 40,
    width: wp('80%'),
  },
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: 16,
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: 16,
    marginTop: 12,
    paddingHorizontal: 15,
    width: wp('92%'),
  },
});
