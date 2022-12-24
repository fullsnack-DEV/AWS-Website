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
  Alert,
  FlatList,
  TextInput,
  Dimensions,
  Keyboard,
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
import {
  getHitSlop,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {searchAddress, searchCityState} from '../../../../api/External';

let entity = {};
export default function CreateMemberProfileTeamForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const [loading, setloading] = useState(false);
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
    searchAddress(searchText).then((response) => {
      console.log('search address:=>', response);
      setLocationData(response.results);
    });
  }, [searchText]);

  useEffect(() => {
    searchCityState(searchText).then((response) => {
      setCityData(response.predictions);
    });
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
      Alert.alert(strings.addressValidation);
      return false;
    }
    return true;
  }, [city, country, location, postalCode, state]);

  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext)
      .then((response) => {
        setloading(false);
        if (response?.payload?.user_id && response?.payload?.group_id) {
          navigation.navigate('MembersProfileScreen', {
            memberID: response.payload.user_id,
            whoSeeID: response.payload.group_id,
            groupID: authContext.entity.uid,
          });

          setTimeout(() => {
            Alert.alert(
              format(strings.profileCreated, authContext.entity.role),
              '',
              [
                {
                  text: strings.okTitleText,
                  onPress: () => {},
                },
              ],
              {cancelable: false},
            );
          }, 10);
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const createMember = () => {
    if (validation()) {
      setloading(true);
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
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
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
  const locationString = () => {
    let str = '';
    if (city) {
      str += `${city}, `;
    }
    if (state) {
      str += `${state}, `;
    }
    if (country) {
      str += `${country}, `;
    }
    return str;
  };

  const renderCityStateCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setCity(item?.terms?.[0]?.value ?? '');
        setState(item?.terms?.[1]?.value ?? '');
        setCountry(item?.terms?.[2]?.value ?? '');
        setVisibleCityModal(false);
        setCityData([]);
        setLocationData([]);
      }}>
      <Text style={styles.cityList}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        const pCode = item.address_components.filter((obj) =>
          obj.types.some((p) => p === 'postal_code'),
        );
        setPostalCode(pCode.length && pCode[0].long_name);
        setLocation(item.formatted_address);
        setVisibleLocationModal(false);
      }}>
      <Text style={styles.cityList}>{item.formatted_address}</Text>
    </TouchableOpacity>
  );

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
          <TCLable title={strings.jerseyNumberPlaceholder.toUpperCase()} />
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
          <TCLable title={strings.writeNotesPlaceholder.toUpperCase()} />
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
          onPressCityPopup={() => setVisibleCityModal(true)}
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
        onBackdropPress={() => {
          setVisibleLocationModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleLocationModal(false);
          setCityData([]);
          setLocationData([]);
        }}
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
            height: Dimensions.get('window').height / 1.15,
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
              onPress={() => {
                setVisibleLocationModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
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
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.addressSearchPlaceHolder}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {locationData.length > 0 && (
              <FlatList
                data={locationData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
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
            height: Dimensions.get('window').height / 1.15,
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
              onPress={() => {
                setVisibleCityModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
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
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={(cityData || []).filter((obj) => obj.terms.length === 3)}
              renderItem={renderCityStateCountryItem}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Keyboard.dismiss}
            />
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
    width: widthPercentageToDP('100%'),
  },

  searchImg: {
    alignSelf: 'center',
    height: heightPercentageToDP('4%'),

    resizeMode: 'contain',
    width: widthPercentageToDP('4%'),
    tintColor: colors.lightBlackColor,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: widthPercentageToDP('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4.5%'),
    paddingLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: widthPercentageToDP('10%'),
    width: widthPercentageToDP('80%'),
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: widthPercentageToDP('70%'),
    margin: widthPercentageToDP('4%'),
    textAlignVertical: 'center',
  },
});
