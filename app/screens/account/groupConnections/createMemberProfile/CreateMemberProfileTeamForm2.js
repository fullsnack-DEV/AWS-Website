import React, {
  useState,
  useLayoutEffect,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Alert,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import {format} from 'react-string-format';
import {createMemberProfile} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCFormProgress from '../../../../components/TCFormProgress';
import LocationView from '../../../../components/LocationView';
import {getHitSlop, showAlert} from '../../../../utils';
import {
  searchAddressPredictions,
  searchCityState,
  searchNearByCityState,
} from '../../../../api/External';
import locationModalStyles from '../../../../Constants/LocationModalStyle';
import {
  getPlaceNameFromPlaceID,
  getGeocoordinatesWithPlaceName,
} from '../../../../utils/location';
import Verbs from '../../../../Constants/Verbs';

let entity = {};
export default function CreateMemberProfileTeamForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const [loading, setLoading] = useState(false);
  const [playerStatus, setPlayerStatus] = useState([]);
  const [joinTCCheck, setJoinTCCheck] = useState(true);
  const [postalCode, setPostalCode] = useState();
  const [location, setLocation] = useState();
  const [visibleCityModal, setVisibleCityModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();

  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [nearbyCities, setNearbyCities] = useState([]);
  const [locationFetch, setLocationFetch] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();

  const [groupMemberDetail, setGroupMemberDetail] = useState({
    is_player: true,
    is_coach: false,
    is_parent: false,
    is_others: false,
  });
  const [positions, setPositions] = useState([
    {
      id: 0,
      position: '',
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => createMember()}>
          {strings.done}
        </Text>
      ),
    });
  }, [
    navigation,
    groupMemberDetail,
    positions,
    navigation,
    location,
    city,
    state,
    country,
    postalCode,
  ]);

  useEffect(() => {
    if (searchText.length >= 3) {
      if (visibleLocationModal) {
        searchAddressPredictions(searchText)
          .then((response) => {
            console.log('search address:=>', response);
            setLocationData(response.predictions);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
        searchCityState(searchText)
          .then((response) => {
            setNoData(false);
            setCityData(response.predictions);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
    } else {
      setNoData(true);
      setCityData([]);
      setLocationData([]);
    }
  }, [searchText]);

  const addPosition = () => {
    const obj = {
      id: positions.length === 0 ? 0 : positions.length,
      code: '',
      number: '',
    };
    setPositions([...positions, obj]);
  };

  const validation = useCallback(() => {
    if (
      !city?.length ||
      !state?.length ||
      !country?.length ||
      !postalCode?.length ||
      !location?.length
    ) {
      showAlert(strings.addressValidation);
      return false;
    }
    return true;
  }, [city, country, location, postalCode, state]);

  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext)
      .then((response) => {
        setLoading(false);
        if (response.payload.user_id && response.payload.group_id) {
          navigation.navigate('MembersProfileScreen', {
            from: 'CreateMemberProfileTeamForm2',
            memberID: response.payload.user_id,
            whoSeeID: response.payload.group_id,
            groupID: authContext.entity.uid,
          });

          setTimeout(() => {
            showAlert(format(strings.profileCreated, authContext.entity.role));
          }, 10);
        }
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          showAlert(e.message);
        }, 10);
      });
  };
  const createMember = () => {
    if (validation()) {
      setLoading(true);
      let bodyParams = {is_invite: joinTCCheck};
      if (route.params.form1.full_image) {
        const imageArray = [];

        imageArray.push({path: route.params.form1.full_image});
        uploadImages(imageArray, authContext)
          .then((responses) => {
            const attachments = responses.map((item) => ({
              type: 'image',
              url: item.fullImage,
              thumbnail: item.thumbnail,
            }));

            bodyParams = {
              ...route.params.form1,
              ...groupMemberDetail,
              full_image: attachments[0].url,
              thumbnail: attachments[0].thumbnail,
              street_address: location,
              city,
              state_abbr: state,
              country,
              postal_code: postalCode,
            };

            console.log('BODY PARAMS:', bodyParams);
            createProfile(bodyParams);
          })
          .catch((e) => {
            setLoading(false);
            setTimeout(() => {
              showAlert(e.message);
            }, 10);
          });
      } else {
        bodyParams = {
          ...route.params.form1,
          ...groupMemberDetail,
          street_address: location,
          city,
          state_abbr: state,
          country,
          postal_code: postalCode,
        };

        console.log('BODY PARAMS:', bodyParams);
        createProfile(bodyParams);
      }
    }
  };
  const renderPosition = ({item, index}) => (
    <TCTextField
      value={item.position}
      clearButtonMode="always"
      onChangeText={(text) => {
        const tempPosition = [...positions];
        tempPosition[index].position = text;
        setPositions(tempPosition);
        const filteredPosition = positions.filter(
          (obj) => ![null, undefined, ''].includes(obj),
        );
        setGroupMemberDetail({
          ...groupMemberDetail,
          positions: filteredPosition.map((e) => e.position),
        });
      }}
      placeholder={strings.positionPlaceholder}
      keyboardType={'default'}
      style={{marginBottom: 10}}
    />
  );
  const locationString = () =>
    [city, state, country].filter((v) => v).join(', ');

  const toggleCityModal = () => {
    if (!visibleCityModal) {
      setLoading(true);
      setUserDeniedLocPerm(false);
      setSearchText('');
      setCityData([]);
      getGeocoordinatesWithPlaceName(Platform.OS)
        .then((_location) => {
          setLocationFetch(true);
          if (_location.position) {
            setCurrentLocation(_location);
            getNearbyCityData(
              _location.position.coords.latitude,
              _location.position.coords.longitude,
              100,
            );
          } else {
            setLoading(false);
            setCurrentLocation(null);
            setVisibleCityModal(!visibleCityModal);
          }
        })
        .catch((e) => {
          setLoading(false);
          setLocationFetch(true);
          if (e.name === Verbs.gpsErrorDeined) {
            setCurrentLocation(null);
            setUserDeniedLocPerm(true);
          } else {
            setTimeout(() => {
              Alert.alert(
                strings.alertmessagetitle,
                `${e.message}(Location fetch`,
              );
            }, 10);
          }
          setVisibleCityModal(!visibleCityModal);
        });
    } else {
      setVisibleCityModal(!visibleCityModal);
    }
  };

  const renderAdressItem = ({item}) => (
    <Pressable onPress={() => onSelectAddress(item)}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>{item.description}</Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderLocationItem = ({item}) => (
    <Pressable onPress={() => onSelectLocation(item)}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>{item.description}</Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocationItem = ({item}) => (
    <Pressable
      onPress={() => {
        onSelectNearByLocation(item);
      }}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>
          {[item.city, item.state, item.country].filter((v) => v).join(', ')}
        </Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocation = () => {
    let renderData;
    if (currentLocation && currentLocation.city) {
      renderData = (
        <Pressable onPress={() => onSelectCurrentLocation()}>
          <View style={locationModalStyles.listItemCurrentLocation}>
            <Text style={locationModalStyles.cityText}>
              {[
                currentLocation?.city,
                currentLocation?.state,
                currentLocation?.country,
              ]
                .filter((v) => v)
                .join(', ')}
            </Text>
            <Text style={locationModalStyles.curruentLocationText}>
              {strings.currentLocationText}
            </Text>
          </View>
          <View style={locationModalStyles.itemSeprater} />
        </Pressable>
      );
    } else {
      renderData = <View />;
    }
    return renderData;
  };

  const getNearbyCityData = (lat, long, radius) => {
    searchNearByCityState(radius, lat, long)
      .then((response) => {
        const list = response.filter(
          (obj) =>
            !(
              obj.city === currentLocation?.city &&
              obj.country === currentLocation?.country
            ),
        );
        setNearbyCities(list);
        setLoading(false);
        setVisibleCityModal(!visibleCityModal);
      })
      .catch((e) => {
        setLoading(false);
        setNearbyCities([]);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `${e.message}(getNearbyCityData),${lat},${long},${radius}`,
          );
        }, 10);
        setVisibleCityModal(!visibleCityModal);
      });
  };

  const onSelectAddress = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setLoading(false);
      if (_location) {
        setCity(_location.city);
        setState(_location.state);
        setCountry(_location.country);
        setPostalCode(_location.postalCode);
        setLocation(_location.address);
      }
      setVisibleLocationModal(false);
    });
  };

  const onSelectLocation = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setLoading(false);
      if (_location) {
        setCity(_location.city);
        setState(_location.state);
        setCountry(_location.country);
      }
      toggleCityModal();
    });
  };

  const onSelectCurrentLocation = async () => {
    setCity(currentLocation?.city);
    setState(currentLocation?.state);
    setCountry(currentLocation?.country);

    toggleCityModal();
  };

  const onSelectNoCurrentLocation = async () => {
    if (userDeniedLocPerm) {
      Alert.alert(
        strings.locationSettingTitleText,
        strings.locationSettingText,
        [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.settingsTitleText,
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(strings.noGpsErrorMsg, '', [
        {
          text: strings.OkText,
          style: 'cancel',
        },
      ]);
    }
  };

  const onSelectNearByLocation = async (item) => {
    setCity(item.city);
    setState(item.state);
    setCountry(item.country);

    toggleCityModal();
  };

  return (
    <>
      <TCFormProgress totalSteps={2} curruentStep={2} />
      <TCKeyboardView>
        <ActivityLoader visible={loading} />
        <TCLable title={strings.roles.toUpperCase()} />
        <View style={styles.mainCheckBoxContainer}>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.player}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_player: !groupMemberDetail.is_player,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_player
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.coach}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_coach: !groupMemberDetail.is_coach,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_coach
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.parent}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_parent: !groupMemberDetail.is_parent,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_parent
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.othersText}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_others: !groupMemberDetail.is_others,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_others
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TCLable title={strings.positionPlaceholder.toUpperCase()} />
          <FlatList
            data={positions}
            renderItem={renderPosition}
            keyExtractor={(item, index) => index.toString()}
            style={{marginTop: 10}}></FlatList>
        </View>
        {positions.length < 5 && (
          <TCMessageButton
            title={strings.addPosition}
            width={120}
            alignSelf="center"
            marginTop={15}
            onPress={() => addPosition()}
            borderColor={colors.whiteColor}
            color={colors.lightBlackColor}
          />
        )}
        <View>
          <TCLable
            title={strings.jerseyNumberPlaceholder.toUpperCase()}
            style={{marginBottom: 12}}
          />
          <TCTextField
            value={groupMemberDetail.jersey_number}
            onChangeText={(text) =>
              setGroupMemberDetail({...groupMemberDetail, jersey_number: text})
            }
            placeholder={strings.jerseyNumberPlaceholder}
            keyboardType={'number-pad'}
          />
        </View>

        <TCLable title={strings.status.toUpperCase()} />
        <View style={styles.mainCheckBoxContainer}>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>
              {strings.injuredPlaceholder}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (playerStatus.indexOf(strings.injuredPlaceholder) !== -1) {
                  const i = playerStatus.indexOf(strings.injuredPlaceholder);
                  playerStatus.splice(i, 1);
                } else {
                  playerStatus.push(strings.injuredPlaceholder);
                }
                setPlayerStatus(playerStatus);
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  status: playerStatus,
                });
              }}>
              <Image
                source={
                  playerStatus.indexOf(strings.injuredPlaceholder) !== -1
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>
              {strings.longTermAwayPlaceholder}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (
                  playerStatus.indexOf(strings.longTermAwayPlaceholder) !== -1
                ) {
                  const i = playerStatus.indexOf(
                    strings.longTermAwayPlaceholder,
                  );
                  playerStatus.splice(i, 1);
                } else {
                  playerStatus.push(strings.longTermAwayPlaceholder);
                }
                setPlayerStatus(playerStatus);
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  status: playerStatus,
                });
              }}>
              <Image
                source={
                  playerStatus.some(
                    (el) => el === strings.longTermAwayPlaceholder,
                  )
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>
              {strings.suspendedPlaceholder}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (playerStatus.indexOf(strings.suspendedPlaceholder) !== -1) {
                  const i = playerStatus.indexOf(strings.suspendedPlaceholder);
                  playerStatus.splice(i, 1);
                } else {
                  playerStatus.push(strings.suspendedPlaceholder);
                }
                setPlayerStatus(playerStatus);
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  status: playerStatus,
                });
              }}>
              <Image
                source={
                  playerStatus.some((el) => el === strings.suspendedPlaceholder)
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TCLable
            title={strings.writeNotesPlaceholder.toUpperCase()}
            style={{marginBottom: 12}}
          />
          <TCTextField
            value={groupMemberDetail.note}
            height={100}
            multiline={true}
            onChangeText={(text) =>
              setGroupMemberDetail({...groupMemberDetail, note: text})
            }
            placeholder={strings.notesPlaceholder}
            keyboardType={'default'}
          />
        </View>

        <LocationView
          onPressVisibleLocationPopup={() => setVisibleLocationModal(true)}
          onChangeLocationText={(text) => setLocation(text)}
          locationText={location}
          onChangePostalCodeText={(text) => setPostalCode(text)}
          postalCodeText={postalCode}
          locationString={locationString()}
          onPressCityPopup={() => toggleCityModal()}
        />

        <View style={{flexDirection: 'row', margin: 15}}>
          <TouchableOpacity
            onPress={() => {
              setJoinTCCheck(!joinTCCheck);
            }}>
            <Image
              source={
                // item.join_membership_acceptedadmin === false
                joinTCCheck ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>
            {strings.sentEmailInvitation}
          </Text>
        </View>
        <View style={{marginBottom: 30}} />
      </TCKeyboardView>

      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => setVisibleLocationModal(false)}
        onRequestClose={() => setVisibleLocationModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          <View style={locationModalStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModalStyles.headerText}>
              {strings.address}
            </Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModalStyles.closeButton}
                onPress={() => setVisibleLocationModal(false)}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModalStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModalStyles.separatorLine} />
          <View>
            <View style={locationModalStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModalStyles.searchTextInput}
                placeholder={strings.searchForAddress}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {noData && searchText.length > 0 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.enter3CharText}
              </Text>
            )}

            {locationData.length > 0 && (
              <FlatList
                style={{marginTop: 10}}
                data={locationData}
                renderItem={renderAdressItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => setVisibleCityModal(false)}
        onRequestClose={() => setVisibleCityModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          <View style={locationModalStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModalStyles.headerText}>
              {strings.cityStateCountryTitle}
            </Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModalStyles.closeButton}
                onPress={() => setVisibleCityModal(false)}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModalStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModalStyles.separatorLine} />
          <View>
            <View style={locationModalStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModalStyles.searchTextInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {noData && searchText.length > 0 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.enter3CharText}
              </Text>
            )}
            {noData &&
              searchText.length === 0 &&
              nearbyCities.length >= 0 &&
              cityData.length === 0 && (
                <FlatList
                  style={[
                    locationModalStyles.nearbycitiesflatlist,
                    {marginTop: 25},
                  ]}
                  data={nearbyCities}
                  renderItem={renderCurrentLocationItem}
                  ListHeaderComponent={renderCurrentLocation}
                  keyExtractor={(index) => index.toString()}
                  onScroll={Keyboard.dismiss}
                />
              )}
            {noData &&
              searchText.length === 0 &&
              locationFetch &&
              !currentLocation && (
                <Pressable
                  style={styles.noLocationViewStyle}
                  onPress={() => onSelectNoCurrentLocation()}>
                  <View>
                    <Text style={locationModalStyles.currentLocationTextStyle}>
                      {strings.currentLocationText}
                    </Text>
                  </View>
                  <View style={locationModalStyles.itemSeprater} />
                  <Text
                    style={[
                      locationModalStyles.currentLocationTextStyle,
                      {marginTop: 15},
                    ]}>
                    {strings.noLocationText}
                  </Text>
                </Pressable>
              )}
            {cityData.length > 0 && (
              <FlatList
                style={{marginTop: 10}}
                data={cityData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 25,
    marginBottom: 10,
    marginRight: 15,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 15,
  },

  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
