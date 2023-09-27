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
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {format} from 'react-string-format';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
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
import {createEvent} from '../../../api/Schedule';
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
  countNumberOfWeeks,
  getRoundedDate,
} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';
import uploadImages from '../../../utils/imageAction';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  ModalTypes,
} from '../../../Constants/GeneralConstants';
import {getSportList} from '../../../utils/sportsActivityUtils';
import SportsListModal from '../registerPlayer/modals/SportsListModal';
import AddressWithMapModal from '../../../components/AddressWithMap/AddressWithMapModal';
import CurrencyModal from '../../../components/CurrencyModal/CurrencyModal';
import GroupList from '../../../components/Schedule/GroupEvent/GroupList';
import GroupIcon from '../../../components/GroupIcon';

export default function CreateEventScreen({navigation, route}) {
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPosted, setEventPosted] = useState({
    value: 1,
    text: strings.scheduleAndPostText,
  });
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
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState({});
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const see = 'see';
  const join = 'join';
  const posted = 'posted';
  const invite = 'invite';

  const indexOne = 0;
  const indexTwo = 1;
  const indexThree = 2;

  const [whoOption, setWhoOption] = useState();
  const [whoCanJoinOption, setWhoCanJoinOption] = useState({
    text: strings.everyoneRadio,
    value: 0,
  });

  const [whoCanSeeOption, setWhoCanSeeOption] = useState({
    text: strings.everyoneRadio,
    value: 0,
  });

  const [whoCanInviteOption, setWhoCanInviteOption] = useState({
    text: strings.attendeeRadioText,
    value: 0,
  });

  const [sportsData, setSportsData] = useState([]);
  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);

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
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [mapcoordinate, setMapCoordinate] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currency, setSelectedCurrency] = useState('');

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

  const renderWhoCan = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        if (whoOption === see) {
          setWhoCanSeeOption(item);
        } else if (whoOption === join) {
          setWhoCanJoinOption(item);
        } else if (whoOption === invite) {
          setWhoCanInviteOption(item);
        } else {
          setEventPosted(item);
        }
        setVisibleWhoModal(false);
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}>
        <Text style={styles.languageList}>{item.text}</Text>
        <View style={styles.checkbox}>
          {(whoOption === see && whoCanSeeOption.value === item?.value) ||
          (whoOption === join && whoCanJoinOption.value === item?.value) ||
          (whoOption === posted && eventPosted.value === item?.value) ||
          (whoOption === invite && whoCanInviteOption.value === item?.value) ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
    const cropCircle = false;
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((data) => {
      setBackgroundThumbnail(data.path);
      setBackgroundImageChanged(true);
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
    // if (!backgroundThumbnail) {
    //   Alert.alert(strings.appName, 'Please choose event featured image.');
    //   return false;
    // }
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

    // if (!locationDetail?.venue_name || locationDetail?.venue_name?.length < 1) {
    //   Alert.alert(strings.appName, strings.enterVenueNameValidation);
    //   return false;
    // }
    // if (
    //   !locationDetail?.venue_detail ||
    //   locationDetail?.venue_detail?.length < 1
    // ) {
    //   Alert.alert(strings.appName, strings.enterVenueDescriptionValidation);
    //   return false;
    // }

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
    eventDescription,
    eventEndDateTime,
    eventStartDateTime,
    eventTitle,
    maxAttendees,
    minAttendees,
    selectedSport.sport,
  ]);

  const createEventDone = (data) => {
    const arr = [...data];
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole =
      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';

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

    if (rule) {
      arr[0].rrule = rule;
    }

    createEvent(entityRole, uid, arr, authContext)
      .then((response) => {
        setTimeout(() => {
          setloading(false);
          navigation.navigate('ScheduleScreen', {
            event: response.payload[0],
          });
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, e.messages);
      });
  };

  const onDonePress = () => {
    if (checkValidation()) {
      setloading(true);
      const entity = authContext.entity;
      const entityRole =
        entity.role === Verbs.entityTypeUser
          ? Verbs.entityTypeUsers
          : Verbs.entityTypeGroups;
      const data = [
        {
          title: eventTitle,
          descriptions: eventDescription,
          allDay: toggle,
          start_datetime: getTCDate(eventStartDateTime),
          end_datetime: getTCDate(eventEndDateTime),
          is_recurring: selectWeekMonth !== Verbs.eventRecurringEnum.Never,
          repeat: selectWeekMonth,
          untilDate: getTCDate(eventUntilDateTime),
          blocked: is_Blocked,
          selected_sport: selectedSport,
          who_can_invite: {
            ...whoCanInviteOption,
          },
          who_can_see: {
            ...whoCanSeeOption,
          },
          who_can_join: {
            ...whoCanJoinOption,
          },
          event_posted_at: eventPosted,
          event_fee: {
            value: Number(eventFee),
            currency_type: Verbs.usd,
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
                authContext.entity.obj.user_id ||
                authContext.entity.obj.group_id,
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
        },
      ];

      if (whoCanSeeOption.value === 2) {
        const checkedGroup = groupsSeeList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === Verbs.entityTypeUser) {
          data[0].who_can_see.group_ids = resultOfIds;
        } else {
          data[0].who_can_see.group_ids = [authContext.entity.uid];
        }
      }

      if (whoCanJoinOption.value === 2) {
        const checkedGroup = groupsJoinList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === Verbs.entityTypeUser) {
          data[0].who_can_join.group_ids = resultOfIds;
        } else {
          data[0].who_can_join.group_ids = [authContext.entity.uid];
        }
      }

      if (backgroundImageChanged) {
        const imageArray = [];
        imageArray.push({path: backgroundThumbnail});
        uploadImages(imageArray, authContext)
          .then((responses) => {
            const attachments = responses.map((item) => ({
              type: 'image',
              url: item.fullImage,
              thumbnail: item.thumbnail,
            }));

            let bgInfo = attachments[0];
            if (attachments.length > 1) {
              bgInfo = attachments[1];
            }
            data[0].background_thumbnail = bgInfo.thumbnail;
            data[0].background_full_image = bgInfo.url;
            setBackgroundImageChanged(false);
            createEventDone(data);
          })
          .catch((e) => {
            setTimeout(() => {
              console.log(e);
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          });
      } else {
        createEventDone(data);
      }
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

  const handleBackPress = () => {
    Alert.alert(
      strings.areYouSureQuitCreateEvent,
      '',
      [
        {
          text: strings.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: strings.quit,
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getOptions = () => {
    if (
      authContext.entity.role === Verbs.entityTypeUser ||
      authContext.entity.role === Verbs.entityTypePlayer
    ) {
      if (whoOption === see) {
        return [
          {
            text: strings.everyoneTitleText,
            value: 0,
          },
          {
            text: strings.followingAndFollowers,
            value: 2,
          },
          {
            text: strings.following,
            value: 3,
          },
          {
            text: strings.onlymeTitleText,
            value: 1,
          },
        ];
      }

      if (whoOption === join) {
        return [
          {
            text: strings.everyoneTitleText,
            value: 0,
          },
          {
            text: strings.followingAndFollowers,
            value: 2,
          },
          {
            text: strings.following,
            value: 3,
          },
          {
            text: strings.inviteOnly,
            value: 1,
          },
          {
            text: strings.onlymeTitleText,
            value: 1,
          },
          // strings.everyoneTitleText,
          // strings.followingAndFollowers,
          // strings.following,
          // strings.inviteOnly,
          // strings.onlymeTitleText,
        ];
      }

      if (whoOption === invite) {
        return [
          {
            text: strings.attendeeRadioText,
            value: 0,
          },
          {
            text: strings.onlymeTitleText,
            value: 1,
          },
        ];
      }
    }
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      authContext.entity.role === Verbs.entityTypeClub
    ) {
      if (whoOption === see) {
        return [
          {text: strings.everyoneTitleText, value: 0},
          {text: strings.followerTitleText, value: 3},
          {text: strings.membersTitle, value: 2},
          {
            text: format(strings.onlyAccount, authContext.entity.role),
            value: 1,
          },
        ];
      }

      if (whoOption === join) {
        return [
          {text: strings.everyoneTitleText, value: 0},
          {text: strings.followerTitleText, value: 3},
          {text: strings.membersTitle, value: 2},
          {
            text: format(strings.onlyOrganizer, authContext.entity.role),
            value: 1,
          },
        ];
      }

      if (whoOption === invite) {
        return [
          {text: strings.attendeeRadioText, value: 0},
          {text: format(strings.onlyOption, authContext.entity.role), value: 1},
        ];
      }
    }
    return [];
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.createAnEvent}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          onDonePress();
        }}
        // loading={loading}
      />
      <ActivityLoader visible={loading} />

      <TCKeyboardView>
        <ScrollView bounces={false} nestedScrollEnabled={true}>
          <View style={{paddingTop: 10, paddingHorizontal: 10}}>
            <EventBackgroundPhoto
              isEdit={!!backgroundThumbnail}
              isPreview={false}
              imageURL={
                backgroundThumbnail
                  ? {uri: backgroundThumbnail}
                  : images.backgroundGrayPlceholder
              }
              containerStyle={{marginBottom: 35}}
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
              {/* <TCProfileView
                type="medium"
                name={
                  authContext.entity.obj.group_name ??
                  authContext.entity.obj.full_name
                }
                image={
                  authContext.entity.obj.thumbnail
                    ? {uri: authContext.entity.obj.thumbnail}
                    : images.teamPH
                }
                alignSelf={'flex-start'}
                marginTop={10}
              /> */}
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
              containerStyle={{position: 'relative', marginBottom: 35}}
              headerTextStyle={{fontSize: 16}}
              title={strings.place}
              isRequired={true}>
              <EventVenueTogglebtn
                offline={is_Offline}
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

                  {/* <TCTouchableLabel
                    placeholder={strings.addressPlaceholder}
                    title={searchLocation}
                    showShadow={false}
                    showNextArrow={false}
                    onPress={() => {
                      setVisibleLocationModal(true);
                    }}
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      backgroundColor: colors.textFieldBackground,
                    }}
                  /> */}
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

              <EventMonthlySelection
                title={strings.repeat}
                dataSource={[
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
                  setSelectWeekMonth(value);
                }}
                titleStyle={{color: colors.userPostTimeColor}}
              />
              {selectWeekMonth !== Verbs.eventRecurringEnum.Never && (
                <EventTimeSelectItem
                  title={strings.until}
                  toggle={!toggle}
                  date={
                    eventUntilDateTime
                      ? moment(eventUntilDateTime).format('ll')
                      : moment(new Date()).format('ll')
                  }
                  time={
                    eventUntilDateTime
                      ? moment(eventUntilDateTime).format('h:mm a')
                      : moment(new Date()).format('h:mm a')
                  }
                  containerStyle={{marginBottom: 12}}
                  onDatePress={() => setUntilDateVisible(!untilDateVisible)}
                />
              )}
            </EventItemRender>

            <EventItemRender
              containerStyle={{marginTop: -40, marginBottom: 10}}
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
                  style={styles.eventFeeStyle}
                  // placeholder={'0'}
                  keyboardType={'decimal-pad'}
                  onChangeText={(value) => setEventFee(value)}
                  value={`${eventFee}`}
                  textAlignVertical={'center'}
                  placeholderTextColor={colors.userPostTimeColor}
                />
                <Text style={styles.currencyStyle}>
                  {currency || strings.defaultCurrency}
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
                {strings.readPaymentPolicyText}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.RBold,
                  marginTop: 16,
                }}>
                {strings.additionalRefundPolicy}
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
              <Text style={styles.subTitleText}>
                {strings.eventMayBeCancelledByOrganizerText}
              </Text>
              <NumberOfAttendees
                onChangeMinText={setMinAttendees}
                onChangeMaxText={setMaxAttendees}
                min={minAttendees}
                max={maxAttendees}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(see);
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanSeeOption.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>

              {whoCanSeeOption.value === indexThree &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsSeeList}
                  onCheck={(index) => {
                    groupsSeeList[index].isSelected =
                      !groupsSeeList[index].isSelected;
                    setGroupsSeeList([...groupsSeeList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsSeeList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsSeeList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null}
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanJoin}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(join);
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanJoinOption.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>

              {whoCanJoinOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsJoinList}
                  onCheck={(index) => {
                    groupsJoinList[index].isSelected =
                      !groupsJoinList[index].isSelected;
                    setGroupsJoinList([...groupsJoinList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsJoinList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsJoinList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null}
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanInvite}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption(invite);
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanInviteOption.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>

              {whoCanInviteOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser ? (
                <GroupList
                  list={groupsSeeList}
                  onCheck={(index) => {
                    groupsSeeList[index].isSelected =
                      !groupsSeeList[index].isSelected;
                    setGroupsSeeList([...groupsSeeList]);
                  }}
                  onAllPress={(isAllSelected) => {
                    const newList = groupsSeeList.map((item) => ({
                      ...item,
                      isSelected: !isAllSelected,
                    }));
                    setGroupsSeeList([...newList]);
                  }}
                  containerStyle={{marginTop: 20}}
                />
              ) : null}
            </View>

            <View style={styles.containerStyle}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.checkboxPost}
                  onPress={() => {
                    if (eventPosted.value === indexTwo) {
                      setEventPosted({
                        value: 0,
                        text: strings.scheduleOnlyText,
                      });
                    } else {
                      setEventPosted({
                        value: 1,
                        text: strings.scheduleAndPostText,
                      });
                    }
                  }}>
                  <Image
                    source={
                      eventPosted.value === 1
                        ? images.yellowCheckBox
                        : images.uncheckWhite
                    }
                    style={styles.checkboxPostImg}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <Text style={[styles.allDayText, {flex: 1, flexWrap: 'wrap'}]}>
                  {strings.eventPostCreate}
                </Text>
              </View>
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
        onNext={(sport) => {
          setSelectedSport(sport);
          setVisibleSportsModal(false);
        }}
        rightButtonText={strings.apply}
      />

      <CustomModalWrapper
        isVisible={visibleWhoModal}
        closeModal={() => setVisibleWhoModal(false)}
        modalType={ModalTypes.style2}
        title={whoOption === join ? strings.whoCanJoin : strings.whoCanSee}
        containerStyle={{
          padding: 15,
          marginBottom: Platform.OS === 'ios' ? 35 : 0,
        }}
        ratio={0.5}>
        <FlatList
          data={getOptions()}
          renderItem={renderWhoCan}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </CustomModalWrapper>

      <ActionSheet
        ref={actionSheet}
        // title={'News Feed Post'}
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
        ref={actionSheetWithDelete}
        // title={'News Feed Post'}
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
  checkboxPostImg: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    marginTop: 5,
  },
  checkboxPost: {
    left: wp(0),
    marginRight: 10,
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  availableSubHeader: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  checkboxImg: {
    width: wp('5.5%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    position: 'absolute',
    right: wp(0),
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
  textInputDropStyle: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  dropContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 5,
    width: wp('94%'),
    height: 40,
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignItems: 'center',
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
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },

  downArrowWhoCan: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
    right: 15,
  },
  eventFeeStyle: {
    width: '82%',
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
    alignSelf: 'center',
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
