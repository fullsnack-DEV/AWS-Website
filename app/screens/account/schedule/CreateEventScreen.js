/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  TextInput,
  Platform,
  Pressable,
  BackHandler,
  // Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {format} from 'react-string-format';
import {RRule} from 'rrule';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {getCountry} from 'country-currency-map';
import {getGeocoordinatesWithPlaceName} from '../../../utils/location';
import AuthContext from '../../../auth/context';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import EventMapView from '../../../components/Schedule/EventMapView';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
// import TCProfileView from '../../../components/TCProfileView';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import EventVenueTogglebtn from '../../../components/Schedule/EventVenueTogglebtn';
import TCKeyboardView from '../../../components/TCKeyboardView';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import {
  deleteConfirmation,
  getTCDate,
  ordinal_suffix_of,
  getDayFromDate,
  countNumberOfWeekFromDay,
  getRoundedDate,
  getJSDate,
} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';

import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';

import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../../../Constants/GeneralConstants';
import {getSportList} from '../../../utils/sportsActivityUtils';
import SportsListModal from '../registerPlayer/modals/SportsListModal';
import AddressWithMapModal from '../../../components/AddressWithMap/AddressWithMapModal';
import CurrencyModal from '../../../components/CurrencyModal/CurrencyModal';
import GroupIcon from '../../../components/GroupIcon';
import TCFormProgress from '../../../components/TCFormProgress';

export default function CreateEventScreen({navigation, route}) {
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();
  const whoCanseePost = useRef();

  const authContext = useContext(AuthContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [minAttendees, setMinAttendees] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [eventFee, setEventFee] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [toggle] = useState(false);
  const [eventStartDateTime, setEventStartdateTime] = useState(
    getRoundedDate(5),
  );
  const [eventEndDateTime, setEventEnddateTime] = useState(
    moment(getRoundedDate(5)).add(5, 'm').toDate(),
  );
  const [eventUntilDateTime, setEventUntildateTime] =
    useState(eventEndDateTime);
  const [searchLocation, setSearchLocation] = useState('');
  const [locationDetail, setLocationDetail] = useState({
    latitude: 0.0,
    longitude: 0.0,
  });
  const [is_Blocked, setIsBlocked] = useState(false);
  const [is_Offline, setIsOffline] = useState(true);
  const [onlineUrl, setOnlineUrl] = useState('');
  const [loading, setloading] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [selectedSport, setSelectedSport] = useState({});
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const indexOne = 0;

  const [sportsData, setSportsData] = useState([]);

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState(
    Verbs.eventRecurringEnum.Never,
  );
  const [backgroundThumbnail, setBackgroundThumbnail] = useState();
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);
  const venueInputRef = useRef();
  const refundPolicyInputRef = useRef();
  const [mapRegion, setMapRegion] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });
  const [mapcoordinate, setMapCoordinate] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currency, setSelectedCurrency] = useState('');

  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);
  const [occurance, setOccurance] = useState(0);
  const [endDateOfOcuuredEvent, setEndDateOfOccuredEvent] = useState();

  useEffect(() => {
    if (isFocused && !mapcoordinate.longitude) {
      getGeocoordinatesWithPlaceName(Platform.OS)
        .then((location) => {
          if (location.position) {
            const obj = {
              latitude: location.position.coords.latitude,
              longitude: location.position.coords.longitude,
            };

            setMapRegion((prevProps) => ({...prevProps, ...obj}));
            setMapCoordinate((prevProps) => ({...prevProps, ...obj}));
            setSearchLocation(location.formattedAddress ?? '');
          }
        })
        .catch((e) => {
          if (e.name === Verbs.gpsErrorDeined) {
            Alert.alert('', Verbs.gpsErrorDeined);
          } else {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          }
        });
    }
  }, [isFocused]);

  useEffect(() => {
    const currencyObj = getCountry(authContext.entity.obj.country);
    if (currencyObj && !currency) {
      setSelectedCurrency(currencyObj.currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.entity.obj.country]);
  const handleStartDatePress = (date) => {
    const startDateTime = toggle ? new Date(date).setHours(0, 0, 0, 0) : date;
    setEventStartdateTime(startDateTime);
    let endDateTime = eventEndDateTime;
    const unitDate = eventUntilDateTime;

    if (endDateTime.getTime() <= startDateTime.getTime()) {
      endDateTime = toggle
        ? date.setHours(23, 59, 59, 0)
        : moment(startDateTime).add(5, 'm').toDate();
    }

    setEventEnddateTime(endDateTime);

    if (!unitDate || endDateTime.getTime() > unitDate.getTime()) {
      setEventUntildateTime(moment(endDateTime).add(5, 'm').toDate());
    }

    setStartDateVisible(!startDateVisible);
  };

  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
    setUntilDateVisible(false);
  };

  const handleEndDatePress = (date) => {
    if (date < eventStartDateTime) {
      Alert.alert('', 'End date & time should be greater than start date.');
      return;
    }
    const endDateTime = toggle ? date.setHours(23, 59, 59, 0) : date;
    const unitDate = eventUntilDateTime;
    setEventEnddateTime(endDateTime);
    if (!unitDate || endDateTime.getTime() > unitDate.getTime()) {
      setEventUntildateTime(moment(endDateTime).add(5, 'm').toDate());
    }

    setEndDateVisible(!endDateVisible);
  };

  const handleUntilDatePress = (date) => {
    setEventUntildateTime(toggle ? date.setHours(23, 59, 59, 0) : date);
    setUntilDateVisible(!untilDateVisible);
  };

  useEffect(() => {
    if (isFocused && route.params?.locationName) {
      setLocationDetail({...route.params.locationDetail});
      setSearchLocation(route.params.locationName);
    }
  }, [isFocused, route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (route.params.comeName) {
        setloading(true);
        getGeocoordinatesWithPlaceName(Platform.OS)
          .then((location) => {
            setloading(false);
            if (location.position) {
              const obj = {
                ...locationDetail,
                latitude: location.position.coords.latitude,
                longitude: location.position.coords.longitude,
              };
              setLocationDetail(obj);
              setSearchLocation(location.formattedAddress);
            }
          })
          .catch((e) => {
            setloading(false);
            if (e.message !== strings.userdeniedgps) {
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, e.message);
              }, 10);
            }
          });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [route.params.comeName, locationDetail, navigation]);

  useEffect(() => {
    const list = getSportList(authContext.sports);
    setSportsData(list);
  }, [authContext.sports]);

  useEffect(() => {
    setloading(true);
    getGroups(authContext)
      .then((response) => {
        const {teams, clubs} = response.payload;

        const groups = [...teams, ...clubs].map((obj) => ({
          ...obj,
          isSelected: false,
        }));
        setGroupsSeeList([...groups]);
        setGroupsJoinList([...groups]);

        setloading(false);
      })
      .catch(() => {
        setloading(false);
      });
  }, [authContext]);

  const onBGImageClicked = () => {
    setTimeout(() => {
      if (backgroundThumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  const openImagePicker = (width = 680, height = 300) => {
    setloading(true);
    const cropCircle = false;
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((data) => {
      setBackgroundThumbnail(data.path);
      setBackgroundImageChanged(true);
      setloading(false);
    });
  };

  const deleteImage = () => {
    setBackgroundThumbnail();
    setBackgroundImageChanged(false);
  };

  const openCamera = (width = 680, height = 300) => {
    // check(PERMISSIONS.IOS.CAMERA)
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
    )
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert(strings.thisFeaturesNotAvailable);
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.CAMERA).then(() => {
              ImagePicker.openCamera({
                width,
                height,
                cropping: true,
              })
                .then((data) => {
                  setBackgroundThumbnail(data.path);
                  setBackgroundImageChanged(true);
                })
                .catch((e) => {
                  console.log(e);
                });
            });
            break;
          case RESULTS.LIMITED:
            break;
          case RESULTS.GRANTED:
            ImagePicker.openCamera({
              width,
              height,
              cropping: true,
            })
              .then((data) => {
                setBackgroundThumbnail(data.path);
                setBackgroundImageChanged(true);
              })
              .catch((e) => {
                console.log('error', e);
              });
            break;
          case RESULTS.BLOCKED:
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const checkValidation = useCallback(() => {
    if (eventTitle === '') {
      Alert.alert(strings.appName, strings.eventTitleValidation);
      return false;
    }
    if (!selectedSport.sport) {
      Alert.alert(strings.appName, strings.chooseSportText);
      return false;
    }
    if (eventDescription === '') {
      Alert.alert(strings.appName, strings.eventDescriptionValidation);
      return false;
    }
    if (eventStartDateTime === '') {
      Alert.alert(strings.appName, strings.eventStartDateValidation);
      return false;
    }
    if (eventEndDateTime === '') {
      Alert.alert(strings.appName, strings.eventEndDateValidation);
      return false;
    }

    if (is_Offline) {
      if (!locationDetail?.venue_name) {
        Alert.alert(strings.appName, strings.enterVenueNameValidation);
        return false;
      }
    } else if (!onlineUrl) {
      Alert.alert(strings.appName, strings.enterVenueUrlValidation);
      return false;
    }
    if (
      !locationDetail?.venue_detail ||
      locationDetail?.venue_detail?.length < 1
    ) {
      Alert.alert(strings.appName, strings.enterVenueDescriptionValidation);
      return false;
    }

    if (Number(minAttendees) > 0 && Number(maxAttendees) > 0) {
      if (Number(minAttendees) === 0) {
        Alert.alert(strings.appName, strings.enterValidAttendee);
        return false;
      }
      if (Number(maxAttendees) === 0) {
        Alert.alert(strings.appName, strings.enterValidMaxAtendeeValidation);
        return false;
      }
      if (Number(minAttendees) > Number(maxAttendees)) {
        Alert.alert(strings.appName, strings.enterValidAtendeeValidation);
        return false;
      }
    }

    return true;
  }, [
    eventTitle,
    selectedSport.sport,
    eventDescription,
    eventStartDateTime,
    eventEndDateTime,
    is_Offline,
    onlineUrl,
    locationDetail?.venue_detail,
    locationDetail?.venue_name,
    minAttendees,
    maxAttendees,
  ]);

  const onDonePress = () => {
    if (checkValidation()) {
      const entity = authContext.entity;
      const entityRole =
        entity.role === Verbs.entityTypeUser
          ? Verbs.entityTypeUsers
          : Verbs.entityTypeGroups;
      const data = {
        title: eventTitle,
        descriptions: eventDescription,
        allDay: toggle,
        start_datetime: getTCDate(eventStartDateTime),
        end_datetime: getTCDate(eventEndDateTime),
        is_recurring: selectWeekMonth !== Verbs.eventRecurringEnum.Never,
        repeat: selectWeekMonth,
        // untilDate: getTCDate(eventUntilDateTime),
        blocked: is_Blocked,
        selected_sport: selectedSport,

        event_fee: {
          value: `${parseFloat(eventFee).toFixed(2)}`,
          currency_type: currency,
        },
        refund_policy: refundPolicy,
        min_attendees: Number(minAttendees),
        max_attendees: Number(maxAttendees),
        entity_type:
          authContext.entity.role === Verbs.entityTypeUser
            ? Verbs.entityTypePlayer
            : authContext.entity.role,
        participants: [
          {
            entity_id:
              authContext.entity.obj.user_id || authContext.entity.obj.group_id,
            entity_type: entityRole,
          },
        ],

        location: {
          location_name: searchLocation,
          latitude: locationDetail.latitude,
          longitude: locationDetail.longitude,
          venue_name: locationDetail.venue_name,
          venue_detail: locationDetail.venue_detail,
        },
        online_url: onlineUrl,
        is_Offline,
        occurrence: occurance,
        tzid: Intl.DateTimeFormat()?.resolvedOptions().timeZone,
      };

      navigation.navigate('CreateEventScreen2', {
        createEventData: data,
        backgroundImageChangedFlag: backgroundImageChanged,
        backgroundThumbnailFlag: backgroundThumbnail,
        eventStartDateTimeflag: eventStartDateTime,
        selectWeekMonthFlag: selectWeekMonth,
        groupsSeeListFlag: groupsSeeList,
        groupsJoinListFlag: groupsJoinList,
      });
    }
  };

  const onSelectAddress = (_location) => {
    setLocationDetail({
      ...locationDetail,
      latitude: _location.coordinate.latitude,
      longitude: _location.coordinate.longitude,
    });
    setMapCoordinate(_location.coordinate);
    setMapRegion(_location.region);
    setSearchLocation(_location.addressforMap);
  };

  const handleBackPress = useCallback(() => {
    Alert.alert(
      strings.areYouWantToUnsavedChanges,
      '',
      [
        {
          text: strings.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: strings.discardText,
          onPress: () => {
            if (route.params?.comeName === 'LocalHomeScreen') {
              navigation.navigate('App', {
                screen: 'LocalHome',
              });
            } else {
              navigation.navigate('App', {
                screen: 'Schedule',
              });
            }
          },
        },
      ],
      {cancelable: false},
    );
  }, [navigation, route.params?.comeName]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const getRecurringEventsByOccurrence = (eventObject) => {
    const ruleObj = RRule.parseString(eventObject.rrule);

    ruleObj.dtstart = getJSDate(eventObject.start_datetime);
    ruleObj.count = eventObject.occurrence;
    // ruleObj.tzid = eventObject.tzid;
    const rule = new RRule(ruleObj);

    const duration = eventObject.end_datetime - eventObject.start_datetime;

    let dates = rule.all();

    dates = dates.map((RRItem) => {
      const newEvent = {};
      newEvent.start_datetime = Math.round(new Date(RRItem) / 1000);
      newEvent.end_datetime = newEvent.start_datetime + duration;
      // eslint-disable-next-line no-param-reassign
      RRItem = newEvent;
      return RRItem;
    });

    const lastEvent = dates[dates.length - 1];

    setEndDateOfOccuredEvent(
      moment(getJSDate(lastEvent.end_datetime)).format('MMMM DD, YYYY'),
    );
    return dates;
  };

  const getTheEndDate = (occr) => {
    let rule;
    if (selectWeekMonth === Verbs.eventRecurringEnum.Daily) {
      rule = 'FREQ=DAILY';
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.Weekly) {
      rule = 'FREQ=WEEKLY';
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.WeekOfMonth) {
      rule = `FREQ=MONTHLY;BYDAY=${getDayFromDate(eventStartDateTime)
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks(eventStartDateTime)}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.DayOfMonth) {
      rule = `FREQ=MONTHLY;BYMONTHDAY=${eventStartDateTime.getDate()}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.WeekOfYear) {
      rule = `FREQ=YEARLY;BYDAY=${getDayFromDate(eventStartDateTime)
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks(eventStartDateTime)}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.DayOfYear) {
      rule = `FREQ=YEARLY;BYMONTHDAY=${eventStartDateTime.getDate()};BYMONTH=${eventStartDateTime.getMonth()}`;
    }

    const eventObj = {
      rrule: rule,
      occurrence: occr,
      tzid: Intl.DateTimeFormat()?.resolvedOptions().timeZone,
      start_datetime: getTCDate(eventStartDateTime),
      end_datetime: getTCDate(eventEndDateTime),
    };

    getRecurringEventsByOccurrence(eventObj);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.createAnEvent}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
        isRightIconText
        rightButtonText={strings.next}
        onRightButtonPress={() => {
          onDonePress();
        }}
        // loading={loading}
      />

      <TCFormProgress totalSteps={2} curruentStep={1} />
      <ActivityLoader visible={loading} />

      <TCKeyboardView>
        <ScrollView bounces={false} nestedScrollEnabled={true}>
          <View
            style={{
              paddingTop: 10,
              width: '100%',
            }}>
            <EventBackgroundPhoto
              isEdit={!!backgroundThumbnail}
              isPreview={false}
              imageURL={
                backgroundThumbnail
                  ? {uri: backgroundThumbnail}
                  : images.backgroundGrayPlceholder
              }
              containerStyle={{
                marginBottom: 35,
                width: '100%',
                alignSelf: 'center',
              }}
              onPress={() => onBGImageClicked()}
            />
          </View>
          <View style={{paddingHorizontal: 15}}>
            <EventTextInputItem
              title={strings.title}
              isRequired={true}
              placeholder={strings.titlePlaceholder}
              onChangeText={(text) => {
                setEventTitle(text);
              }}
              value={eventTitle}
              containerStyle={{marginBottom: 35}}
            />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.sportCreateEvent}{' '}
                <Text style={{color: colors.darkThemeColor}}> *</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleSportsModal(true);
                }}>
                <TextInput
                  placeholder={strings.sportPlaceholder}
                  style={styles.textInputStyle}
                  pointerEvents={'none'}
                  editable={false}
                  // onChangeText={onChangeText}
                  value={selectedSport.sport_name}
                  textAlignVertical={'center'}
                  placeholderTextColor={colors.userPostTimeColor}
                />
              </TouchableOpacity>
            </View>
            <EventTextInputItem
              title={strings.description}
              isRequired={true}
              placeholder={strings.aboutPlaceholder}
              onChangeText={(text) => {
                setEventDescription(text);
              }}
              multiline={true}
              numberOfLines={5}
              value={eventDescription}
              containerStyle={{marginBottom: 35}}
            />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.organizerTitle}
              </Text>

              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <GroupIcon
                  imageUrl={authContext.entity.obj.thumbnail}
                  groupName={
                    authContext.entity.obj.group_name ??
                    authContext.entity.obj.full_name
                  }
                  entityType={authContext.entity.role}
                  containerStyle={{width: 30, height: 30, borderWidth: 1}}
                  textstyle={{fontSize: 10, marginTop: 1}}
                  placeHolderStyle={{
                    width: 12,
                    height: 12,
                    bottom: -2,
                    right: -2,
                  }}
                />
                <View style={{flex: 1, marginLeft: 8}}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 15,
                      color: colors.lightBlackColor,
                      fontFamily: fonts.RBold,
                    }}
                    numberOfLines={1}>
                    {authContext.entity.obj.group_name ??
                      authContext.entity.obj.full_name}
                  </Text>
                </View>
              </View>
            </View>

            <EventItemRender
              containerStyle={{
                position: 'relative',
                marginBottom: 35,
              }}
              headerTextStyle={{fontSize: 16}}
              title={strings.place}
              isRequired={true}>
              <EventVenueTogglebtn
                offline={is_Offline}
                reducewidth={true}
                firstTabTitle={strings.offline}
                secondTabTitle={strings.online}
                onFirstTabPress={() => setIsOffline(true)}
                onSecondTabPress={() => setIsOffline(false)}
              />
              {is_Offline ? (
                <>
                  <TextInput
                    placeholder={strings.venueNamePlaceholder}
                    style={[styles.textInputStyle, {marginBottom: 10}]}
                    onChangeText={(value) => {
                      setLocationDetail({...locationDetail, venue_name: value});
                    }}
                    value={locationDetail.venue_name}
                    textAlignVertical={'center'}
                    placeholderTextColor={colors.userPostTimeColor}
                  />

                  <Pressable
                    style={styles.textInputStyle}
                    onPress={() => {
                      setVisibleLocationModal(true);
                    }}>
                    <Text style={styles.label}>{searchLocation}</Text>
                  </Pressable>

                  <EventMapView region={mapRegion} coordinate={mapcoordinate} />
                  <Pressable
                    style={styles.detailsContainer}
                    onPress={() => {
                      venueInputRef.current.focus();
                    }}>
                    <TextInput
                      ref={venueInputRef}
                      placeholder={strings.venueDetailsPlaceholder}
                      style={styles.detailsInputStyle}
                      onChangeText={(value) => {
                        setLocationDetail({
                          ...locationDetail,
                          venue_detail: value,
                        });
                      }}
                      value={locationDetail.venue_detail}
                      multiline={true}
                      textAlignVertical={'top'}
                      placeholderTextColor={colors.userPostTimeColor}
                    />
                  </Pressable>

                  <AddressWithMapModal
                    visibleLocationModal={visibleLocationModal}
                    setVisibleAddressModalhandler={() =>
                      setVisibleLocationModal(false)
                    }
                    onAddressSelect={(location) => {
                      onSelectAddress(location);
                    }}
                    existedregion={mapRegion}
                    existedcoordinates={mapcoordinate}
                    mapAddress={searchLocation}
                  />
                </>
              ) : (
                <>
                  <TextInput
                    placeholder={strings.onlineUrl}
                    style={styles.textInputStyle}
                    onChangeText={(value) => {
                      setOnlineUrl(value);
                    }}
                    value={onlineUrl}
                    textAlignVertical={'center'}
                    placeholderTextColor={colors.userPostTimeColor}
                  />
                </>
              )}
            </EventItemRender>

            <EventItemRender
              title={strings.timeTitle}
              isRequired={true}
              headerTextStyle={{marginBottom: 15, fontSize: 16}}>
              <EventTimeSelectItem
                title={strings.starts}
                toggle={!toggle}
                date={
                  eventStartDateTime
                    ? moment(eventStartDateTime).format('ll')
                    : moment(new Date()).format('ll')
                }
                time={
                  eventStartDateTime
                    ? moment(eventStartDateTime).format('h:mm a')
                    : moment(new Date()).format('h:mm a')
                }
                onDatePress={() => {
                  setStartDateVisible(!startDateVisible);
                }}
              />
              <EventTimeSelectItem
                title={strings.ends}
                toggle={!toggle}
                date={
                  eventEndDateTime
                    ? moment(eventEndDateTime).format('ll')
                    : moment(new Date()).format('ll')
                }
                time={
                  eventEndDateTime
                    ? moment(eventEndDateTime).format('h:mm a')
                    : moment(new Date()).format('h:mm a')
                }
                containerStyle={{marginBottom: 8}}
                onDatePress={() => setEndDateVisible(!endDateVisible)}
              />

              <EventMonthlySelection
                title={strings.repeat}
                dataSource={[
                  {
                    label: strings.never,
                    value: Verbs.eventRecurringEnum.Never,
                  },
                  {label: strings.daily, value: Verbs.eventRecurringEnum.Daily},
                  {
                    label: strings.weeklyText,
                    value: Verbs.eventRecurringEnum.Weekly,
                  },
                  {
                    label: format(
                      strings.monthlyOnText,
                      `${countNumberOfWeekFromDay(
                        eventStartDateTime,
                      )} ${getDayFromDate(eventStartDateTime)}`,
                    ),
                    value: Verbs.eventRecurringEnum.WeekOfMonth,
                  },
                  {
                    label: format(
                      strings.monthlyOnDayText,
                      ordinal_suffix_of(eventStartDateTime.getDate()),
                    ),
                    value: Verbs.eventRecurringEnum.DayOfMonth,
                  },
                  {
                    label: format(
                      strings.yearlyOnText,
                      `${countNumberOfWeekFromDay(
                        eventStartDateTime,
                      )} ${getDayFromDate(eventStartDateTime)}`,
                    ),
                    value: Verbs.eventRecurringEnum.WeekOfYear,
                  },
                  {
                    label: format(
                      strings.yearlyOnDayText,
                      ordinal_suffix_of(eventStartDateTime.getDate()),
                    ),
                    value: Verbs.eventRecurringEnum.DayOfYear,
                  },
                ]}
                placeholder={strings.never}
                value={selectWeekMonth}
                onValueChange={(value) => {
                  if (value === strings.never) {
                    setEventUntildateTime(eventEndDateTime);
                  }
                  setSelectWeekMonth(value);
                }}
                titleStyle={{color: colors.userPostTimeColor}}
              />

              {selectWeekMonth !== Verbs.eventRecurringEnum.Never && (
                <View>
                  <EventMonthlySelection
                    title={strings.repeat}
                    dataSource={[
                      {
                        label: '3 Times',
                        value: 3,
                      },
                      {
                        label: '4 Times',
                        value: 4,
                      },
                      {
                        label: '5 Times',
                        value: 5,
                      },
                      {
                        label: '6 Times',
                        value: 6,
                      },
                      {
                        label: '7 Times',
                        value: 7,
                      },
                      {
                        label: '8 Times',
                        value: 8,
                      },
                      {
                        label: '9 Times',
                        value: 9,
                      },
                      {
                        label: '10 Times',
                        value: 10,
                      },
                      // {
                      //   label: '11 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '12 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '13 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },

                      // {
                      //   label: '14 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '15 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '16 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '17 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '18 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '19 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                      // {
                      //   label: '20 Times',
                      //   value: Verbs.eventRecurringEnum.Weekly,
                      // },
                    ]}
                    placeholder={strings.never}
                    value={occurance}
                    onValueChange={(value) => {
                      setOccurance(value);
                      getTheEndDate(value);

                      // if (value === strings.never) {
                      //   setEventUntildateTime(eventEndDateTime);
                      // }
                      // setSelectWeekMonth(value);
                    }}
                    titleStyle={{color: colors.userPostTimeColor}}
                  />
                </View>
              )}
            </EventItemRender>

            {occurance !== 0 && (
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                  marginTop: -10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: fonts.RRegular,
                  }}>
                  {strings.from}{' '}
                  {moment(eventStartDateTime).format('MMMM DD, YYYY')}{' '}
                  {strings.to} {endDateOfOcuuredEvent}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 20,
              }}>
              <Text>{strings.timezone} &nbsp;</Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(strings.timezoneAvailability);
                }}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                    textDecorationColor: colors.darkGrayColor,
                  }}>
                  {Intl.DateTimeFormat()
                    ?.resolvedOptions()
                    .timeZone.split('/')
                    .pop()}
                </Text>
              </TouchableOpacity>
            </View>

            <EventItemRender
              containerStyle={{
                marginTop: -40,
                marginBottom: 10,
              }}
              title={''}>
              <Text style={styles.availableSubHeader}>
                {strings.availableSubTitle}
              </Text>
              <BlockAvailableTabView
                blocked={is_Blocked}
                firstTabTitle={strings.blocked}
                secondTabTitle={strings.availableText}
                onFirstTabPress={() => setIsBlocked(true)}
                onSecondTabPress={() => setIsBlocked(false)}
                startGradientColor={colors.grayBackgroundColor}
                endGradientColor={colors.grayBackgroundColor}
                activeEventPricacy={styles.activeEventPricacy}
                inactiveEventPricacy={styles.inactiveEventPricacy}
                inactiveEventPrivacyText={styles.inactiveEventPrivacyText}
              />
            </EventItemRender>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.eventFeeTitle}
              </Text>
              <View style={[styles.feeContainer, {marginTop: 10}]}>
                <TextInput
                  value={eventFee}
                  style={styles.eventFeeStyle}
                  keyboardType="decimal-pad"
                  onChangeText={(value) => {
                    if (value >= 0 || value < 0) {
                      setEventFee(value);
                    }
                  }}
                />
                <Text style={styles.currencyStyle}>
                  {currency ?? strings.defaultCurrency}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowCurrencyModal(true)}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.RLight,
                    textDecorationLine: 'underline',
                    textAlign: 'right',
                    paddingHorizontal: 5,
                    marginTop: 5,
                    color: colors.lightBlackColor,
                  }}>
                  {strings.changeCurrency}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.refundPolicyTitle}
              </Text>
              <Text style={[styles.subTitleText, {marginTop: 10}]}>
                {strings.attendeesMustRefundedText}
              </Text>
              <Pressable
                onPress={() => {
                  refundPolicyInputRef.current.focus();
                }}
                style={styles.detailsContainer}>
                <TextInput
                  ref={refundPolicyInputRef}
                  placeholder={strings.additionalRefundPolicy}
                  style={styles.detailsInputStyle}
                  onChangeText={(value) => setRefundPolicy(value)}
                  value={refundPolicy}
                  multiline
                  textAlignVertical={'top'}
                  placeholderTextColor={colors.userPostTimeColor}
                />
              </Pressable>
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.numberOfAttend}
                {/* <Text style={styles.opetionalTextStyle}>{strings.optional}</Text> */}
              </Text>

              <NumberOfAttendees
                onChangeMinText={setMinAttendees}
                onChangeMaxText={setMaxAttendees}
                min={minAttendees}
                max={maxAttendees}
              />
            </View>

            <DateTimePickerView
              date={eventStartDateTime}
              visible={startDateVisible}
              onDone={handleStartDatePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={getRoundedDate(5)}
              minutesGap={5}
              mode={toggle ? 'date' : 'datetime'}
            />
            <DateTimePickerView
              date={eventEndDateTime}
              visible={endDateVisible}
              onDone={handleEndDatePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={moment(eventStartDateTime).add(5, 'm').toDate()}
              minutesGap={5}
              mode={toggle ? 'date' : 'datetime'}
            />
            <DateTimePickerView
              date={eventUntilDateTime}
              visible={untilDateVisible}
              onDone={handleUntilDatePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={moment(eventEndDateTime).add(5, 'm').toDate()}
              minutesGap={5}
              mode={toggle ? 'date' : 'datetime'}
            />
          </View>
        </ScrollView>
      </TCKeyboardView>

      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={strings.sportsTitleText}
        sportsList={sportsData}
        sport={selectedSport}
        onNext={(sports) => {
          const {sport_name, sport_type, sport} = sports;
          const selectedSportData = {sport_name, sport_type, sport};

          setSelectedSport(selectedSportData);
          setVisibleSportsModal(false);
        }}
        rightButtonText={strings.apply}
      />

      <ActionSheet
        ref={actionSheet}
        // title={'NewsFeed Post'}
        options={[strings.camera, strings.album, strings.cancelTitle]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === indexOne) {
            openCamera();
          } else if (index === 1) {
            openImagePicker(750, 348);
          }
        }}
      />

      <ActionSheet
        ref={whoCanseePost}
        // title={'NewsFeed Post'}
        options={[
          strings.everyoneText,
          strings.attendyText,
          strings.onlyOrganizer,
        ]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === indexOne) {
            openCamera();
          } else if (index === 1) {
            openImagePicker(750, 348);
          }
        }}
      />

      <ActionSheet
        ref={actionSheetWithDelete}
        // title={'NewsFeed Post'}
        options={[
          strings.camera,
          strings.album,
          strings.deleteTitle,
          strings.cancelTitle,
        ]}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            openCamera();
          } else if (index === 1) {
            openImagePicker(750, 348);
          } else if (index === 2) {
            deleteConfirmation(
              strings.appName,
              strings.deleteConfirmationText,
              () => deleteImage(),
            );
          }
        }}
      />
      <CurrencyModal
        isVisible={showCurrencyModal}
        closeList={() => setShowCurrencyModal(false)}
        selectedcurrency={currency}
        onNext={(item) => {
          setSelectedCurrency(item);
          setShowCurrencyModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  availableSubHeader: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  textInputStyle: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },

  detailsContainer: {
    backgroundColor: colors.textFieldBackground,
    marginTop: 10,
    borderRadius: 5,
    height: 100,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  detailsInputStyle: {
    padding: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  containerStyle: {
    marginBottom: 35,
  },
  headerTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    marginVertical: 3,
  },

  eventFeeStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    height: 40,
    textAlign: 'right',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  currencyStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
    marginRight: 15,
    textAlign: 'right',
  },
  feeContainer: {
    width: wp('92%'),
    padding: wp('1.5%'),
    height: 40,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  subTitleText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginTop: 10,
    lineHeight: 24,
  },
  activeEventPricacy: {
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.whiteColor,
  },
  inactiveEventPricacy: {
    paddingVertical: 2,
  },
  inactiveEventPrivacyText: {
    paddingVertical: hp('0.8'),
  },
});
