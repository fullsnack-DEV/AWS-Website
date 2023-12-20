/* eslint-disable default-case */
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import React, {useState, useEffect, useCallback, useContext} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {format} from 'react-string-format';
import ImagePicker from 'react-native-image-crop-picker';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TCKeyboardView from '../../components/TCKeyboardView';
import Verbs from '../../Constants/Verbs';
import {patchGroup} from '../../api/Groups';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';

import LocationModal from '../../components/LocationModal/LocationModal';
import LanguagesListModal from '../account/registerPlayer/modals/LanguagesListModal';
import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';
import AddressLocationModal from '../../components/AddressLocationModal/AddressLocationModal';
import {getGroupSportName} from '../../utils/sportsActivityUtils';
import uploadImages from '../../utils/imageAction';

export default function EditInfoModalGroup({
  visible,
  onClose,
  groupDetails,
  isEditable,
}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [minAgeValue, setMinAgeValue] = useState([]);
  const [maxAgeValue, setMaxAgeValue] = useState([]);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showOfficeAddressModal, setShowOfficeAddressModal] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [imagesPick, setImagesPick] = useState(false);

  const [jerseyImages, setJerseyImages] = useState(
    groupData?.jersey_images ?? [],
  );

  const updateLanguageList = useCallback(() => {
    const arr = Utility.languageList.map((item) => {
      if (groupData.language?.length > 0) {
        if (groupData.language.includes(item.language)) {
          return {
            ...item,
            isChecked: true,
          };
        }
      }
      return {
        ...item,
        isChecked: false,
      };
    });
    setLanguages(arr);
  }, [groupData.language]);

  useEffect(() => {
    if (isFocused) {
      updateLanguageList();
    }
  }, [isFocused, updateLanguageList]);

  useEffect(() => {
    if (languages.length > 0) {
      let name = '';
      languages.forEach((item) => {
        if (item.isChecked) {
          name += name ? `, ${item.language}` : item.language;
        }
      });

      setLanguageName(name);
    }
  }, [languages]);

  useEffect(() => {
    if (isFocused && groupDetails?.group_id) {
      setGroupData({...groupDetails});
      if (groupDetails.entity_type === Verbs.entityTypeClub) {
        setSelectedSports(groupDetails.sports);
      }
    }
  }, [isFocused, groupDetails]);

  useEffect(() => {
    const minAgeArray = [];
    let maxAgeArray = [];

    for (let i = 1; i <= 120; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      minAgeArray.push(dataSource);
    }

    for (let i = groupData.min_age ?? 1; i <= 120; i++) {
      const dataSource = {
        label: `${i}`,
        value: i,
      };
      maxAgeArray.push(dataSource);
    }
    if (groupData.min_age === 0) {
      maxAgeArray = [];
    }
    setMinAgeValue(minAgeArray);
    setMaxAgeValue(maxAgeArray);
  }, [groupData.min_age]);

  const checkValidation = () => {
    if (!(Verbs.sportType in groupData) && groupData.sport === '') {
      Alert.alert(strings.alertmessagetitle, strings.sportcannotbeblank);
      return false;
    }
    if (groupData.registration_fee >= 1000) {
      Alert.alert(strings.alertmessagetitle, strings.membershipRegister);
      return false;
    }
    if (groupData.membership_fee >= 1000) {
      Alert.alert(strings.alertmessagetitle, strings.membershipFeeNotBigger);
      return false;
    }

    return true;
  };

  const onUpdateButtonClicked = () => {
    if (checkValidation()) {
      setloading(true);
      const groupProfile = {...groupData};
      groupProfile.language = selectedLanguages;

      if (imagesPick) {
        const imageArray = [];

        imageArray.push({path: jerseyImages});

        uploadImages(imageArray, authContext)
          .then((responses) => {
            const attachments = responses.map((item) => ({
              type: 'image',
              url: item.fullImage,
              thumbnail: item.thumbnail,
            }));

            setGroupData({
              ...groupData,
              jersey_images: [...groupData.jersey_images, attachments[0].url],
            });

            groupProfile.jersey_images = [
              ...groupProfile.jersey_images,
              attachments[0].url,
            ];
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
            setloading(false);
          });
      }

      patchGroup(groupData.group_id, groupProfile, authContext)
        .then(async (response) => {
          setloading(false);
          if (response && response.status === true) {
            await Utility.setAuthContextData(response.payload, authContext);
            onClose();
          } else {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, strings.defaultError);
            }, 0.1);
          }
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const handleSelectLocationOptions = (currentLocation) => {
    const obj = {
      city: currentLocation.city,
      state: currentLocation.state_full,
      state_abbr: currentLocation.state,
      country: currentLocation.country,
    };

    setGroupData({...groupData, ...obj});
  };

  const handleLanguageSelection = (lang) => {
    const newList = languages.map((item) => ({
      ...item,
      isChecked: item.id === lang.id ? !item.isChecked : item.isChecked,
    }));
    setLanguages([...newList]);
  };

  const handleOfficeAddresOptions = (address = {}) => {
    setGroupData({
      ...groupData,
      mail_street_address: address.formattedAddress,
    });
    setCity(address.city);
    setState(address.state);
    setCountry(address.country);
  };

  const setCityandPostal = (street, code) => {
    const address = `${street} ${city} ${state} ${country} ${code}`;
    setGroupData({...groupData, mail_street_address: address});
  };

  const removeImages = (item) => {
    const originalArray = groupData.jersey_images;

    const modifedArray = originalArray.filter((i) => i !== item);
    setGroupData({
      ...groupData,
      jersey_images: modifedArray,
    });
  };

  const openImagePicker = (width = 400, height = 400) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
    }).then((data) => {
      // 1 means profile, 0 - means background
      setJerseyImages(data.path);
      setImagesPick(true);
      setGroupData({
        ...groupData,
        jersey_images: groupData?.jersey_images
          ? [...groupData.jersey_images, data.path]
          : [data.path],
      });
    });
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={onClose}
      title={
        isEditable
          ? format(strings.editOption, strings.basicInfoText)
          : strings.basicInfoText
      }
      isRightIconText
      headerRightButtonText={isEditable ? strings.done : strings.updateText}
      modalType={ModalTypes.style1}
      onRightButtonPress={() => {
        onUpdateButtonClicked();
      }}
      containerStyle={{flex: 1, padding: 0}}
      leftIconPress={() => onClose()}>
      <View style={{flex: 1}}>
        <ActivityLoader visible={loading} />
        <TCKeyboardView>
          <BottomSheetScrollView style={{marginHorizontal: 15, paddingTop: 20}}>
            <View style={{marginBottom: 35}}>
              <Text style={styles.labelText}>
                {strings.sportsTitleText.toUpperCase()}
              </Text>
              {groupData.entity_type === Verbs.entityTypeTeam ? (
                <Text
                  style={[
                    styles.labelText,
                    {marginBottom: 0, fontFamily: fonts.RRegular},
                  ]}>
                  {getGroupSportName(groupData, authContext.sports)}
                </Text>
              ) : null}

              {groupData.entity_type === Verbs.entityTypeClub ? (
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => setVisibleSportsModal(true)}>
                  <Text
                    style={[
                      styles.labelText,
                      {marginBottom: 0, fontFamily: fonts.RRegular},
                    ]}>
                    {getGroupSportName(groupData, authContext.sports)}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View style={{marginBottom: 35}}>
              <Text style={styles.labelText}>
                {strings.homeCityTitle.toUpperCase()}
              </Text>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setVisibleLocationModal(true)}>
                <Text
                  style={[
                    styles.labelText,
                    {marginBottom: 0, fontFamily: fonts.RRegular},
                  ]}>{`${groupData.city}, ${
                  groupData.state_abbr ?? groupData.state
                }, ${groupData.country}`}</Text>
              </Pressable>
            </View>

            <View style={{marginBottom: 35}}>
              <Text style={styles.labelText}>
                {strings.membersgender.toUpperCase()}
              </Text>
              {groupData.entity_type === Verbs.entityTypeTeam ? (
                <Text
                  style={[
                    styles.labelText,
                    {marginBottom: 0, fontFamily: fonts.RRegular},
                  ]}>
                  {groupData.gender
                    ? groupData.gender[0].toUpperCase() +
                      groupData.gender.slice(1)
                    : '--'}
                </Text>
              ) : null}

              {groupData.entity_type === Verbs.entityTypeClub ? (
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => setShowGenderModal(true)}>
                  <Text
                    style={[
                      styles.labelText,
                      {marginBottom: 0, fontFamily: fonts.RRegular},
                    ]}>
                    {groupData.gender
                      ? groupData.gender[0].toUpperCase() +
                        groupData.gender.slice(1)
                      : '--'}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View style={{marginBottom: 35}}>
              <Text style={styles.labelText}>
                {strings.membersage.toUpperCase()}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{flex: 1}}>
                  <RNPickerSelect
                    placeholder={{
                      label: strings.minPlaceholder,
                      value: null,
                    }}
                    items={minAgeValue}
                    onValueChange={(value) => {
                      setGroupData({...groupData, min_age: value});
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: [
                        styles.inputContainer,
                        {marginRight: 7, backgroundColor: colors.lightGrey},
                      ],
                      inputAndroid: [
                        styles.inputContainer,
                        {marginRight: 7, backgroundColor: colors.lightGrey},
                      ],
                    }}
                    value={groupData.min_age ?? 1}
                    Icon={() => (
                      <Image
                        source={images.dropDownArrow}
                        style={styles.downArrow}
                      />
                    )}
                  />
                </View>

                <View style={{flex: 1}}>
                  <RNPickerSelect
                    placeholder={{
                      label: strings.maxPlaceholder,
                      value: 0,
                    }}
                    items={maxAgeValue}
                    onValueChange={(value) => {
                      setGroupData({...groupData, max_age: value});
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: [
                        styles.inputContainer,
                        {marginLeft: 8, backgroundColor: colors.lightGrey},
                      ],
                      inputAndroid: [
                        styles.inputContainer,
                        {marginLeft: 8, backgroundColor: colors.lightGrey},
                      ],
                    }}
                    value={groupData.max_age ?? 70}
                    Icon={() => (
                      <Image
                        source={images.dropDownArrow}
                        style={styles.downArrow}
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={{marginBottom: 35}}>
              <Text style={styles.labelText}>
                {strings.languages.toUpperCase()}
              </Text>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowLanguageModal(true)}>
                <Text
                  style={[
                    styles.labelText,
                    {marginBottom: 0, fontFamily: fonts.RRegular},
                  ]}>
                  {languageName}
                </Text>
              </Pressable>
            </View>

            <View style={{marginBottom: 100}}>
              <Text style={styles.labelText}>
                {strings.jerseyText.toUpperCase()}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}>
                {groupData?.jersey_images?.map((item, index) => (
                  <>
                    <View
                      key={index}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => removeImages(item)}
                        hitSlop={Utility.getHitSlop(5)}
                        style={{
                          height: 16,
                          width: 16,
                          borderRadius: 100,
                          backgroundColor: colors.veryLightGray,
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          top: 5,
                          zIndex: 100,
                          right: 20,
                        }}>
                        <Image
                          tintColor={colors.whiteColor}
                          source={images.crossImage}
                          style={{
                            height: 12,
                            width: 12,
                          }}
                        />
                      </TouchableOpacity>

                      <Image
                        source={{uri: item}}
                        style={{
                          height: 100,
                          width: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                          marginRight: 15,
                        }}
                      />
                    </View>
                  </>
                ))}

                <TouchableOpacity
                  onPress={() => openImagePicker()}
                  style={{
                    height: 100,
                    width: 100,
                    marginVertical: 10,
                    backgroundColor: colors.lightGrey,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={images.plus}
                      style={{
                        resizeMode: 'contain',
                        height: 24,
                        width: 24,
                        marginBottom: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fonts.RBold,
                        lineHeight: 24,
                      }}>
                      {strings.uplaodButtonText}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {groupData.entity_type === Verbs.entityTypeClub ? (
              <View style={{marginBottom: 35}}>
                <Text style={styles.labelText}>
                  {strings.officeAddress.toUpperCase()}
                </Text>
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => setShowOfficeAddressModal(true)}>
                  <Text
                    style={[
                      styles.labelText,
                      {marginBottom: 0, fontFamily: fonts.RRegular},
                    ]}>
                    {groupData.office_address}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </BottomSheetScrollView>
        </TCKeyboardView>

        <LocationModal
          visibleLocationModal={visibleLocationModal}
          title={strings.homeCityTitleText}
          setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
          onLocationSelect={handleSelectLocationOptions}
          placeholder={strings.searchByCity}
        />

        <AddressLocationModal
          visibleLocationModal={showOfficeAddressModal}
          setVisibleAddressModalhandler={() => setShowOfficeAddressModal(false)}
          onAddressSelect={handleOfficeAddresOptions}
          handleSetLocationOptions={handleOfficeAddresOptions}
          onDonePress={(street, code) => setCityandPostal(street, code)}
        />

        <SportListMultiModal
          isVisible={visibleSportsModal}
          closeList={() => setVisibleSportsModal(false)}
          title={strings.sportsTitleText}
          onNext={(sports = []) => {
            setSelectedSports(sports);
            setGroupData({...groupData, sports: [...sports]});
            setVisibleSportsModal(false);
          }}
          selectedSports={selectedSports}
        />

        <LanguagesListModal
          isVisible={showLanguageModal}
          closeList={() => {
            updateLanguageList();
            setShowLanguageModal(false);
          }}
          languageList={languages}
          onSelect={handleLanguageSelection}
          onApply={() => {
            setShowLanguageModal(false);
            const list = [];
            languages.forEach((item) => {
              if (item.isChecked) {
                list.push(item.language);
              }
            });
            setSelectedLanguages([...list]);
          }}
        />

        <CustomModalWrapper
          isVisible={showGenderModal}
          closeModal={() => setShowGenderModal(false)}
          modalType={ModalTypes.style1}
          title={strings.membersgender}>
          <FlatList
            data={Utility.groupMemberGenderItems}
            keyExtractor={(item) => item.value}
            renderItem={({item}) => (
              <Pressable
                style={styles.row}
                onPress={() => {
                  setGroupData({...groupData, gender: item.value});
                  setShowGenderModal(false);
                }}>
                <View>
                  <Text
                    style={[
                      styles.labelText,
                      {fontFamily: fonts.RMedium, marginBottom: 0},
                    ]}>
                    {item.label}
                  </Text>
                </View>
                <View style={{width: 22, height: 22, alignItems: 'center'}}>
                  <Image
                    source={
                      groupData.gender === item.value
                        ? images.radioCheckYellow
                        : images.radioUnselect
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </Pressable>
            )}
          />
        </CustomModalWrapper>
      </View>
    </CustomModalWrapper>
  );
}
const styles = StyleSheet.create({
  downArrow: {
    height: 6,
    top: 18,
    right: 15,
    resizeMode: 'contain',
    width: 12,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  inputContainer: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
