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
  Alert,
  TextInput,
  Platform,
  Pressable,
  BackHandler,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {format} from 'react-string-format';
import {RRule} from 'rrule';
import AuthContext from '../../../auth/context';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import EventMapView from '../../../components/Schedule/EventMapView';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import EventVenueTogglebtn from '../../../components/Schedule/EventVenueTogglebtn';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import TCProfileView from '../../../components/TCProfileView';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import {
  deleteConfirmation,
  getRoundedDate,
  getJSDate,
  getDayFromDate,
  countNumberOfWeekFromDay,
  countNumberOfWeeks,
  getTCDate,
  ordinal_suffix_of,
} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';
import Verbs from '../../../Constants/Verbs';
import AddressLocationModal from '../../../components/AddressLocationModal/AddressLocationModal';
import ScreenHeader from '../../../components/ScreenHeader';
import SportsListModal from '../registerPlayer/modals/SportsListModal';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {getSportList} from '../../../utils/sportsActivityUtils';
import CurrencyModal from '../../../components/CurrencyModal/CurrencyModal';
import TCFormProgress from '../../../components/TCFormProgress';

export default function EditEventScreen({navigation, route}) {
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [eventData, setEventData] = useState({});
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPosted, setEventPosted] = useState({});
  const [minAttendees, setMinAttendees] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [eventFee, setEventFee] = useState('');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    strings.defaultCurrency,
  );
  const [refundPolicy, setRefundPolicy] = useState('');
  const [canEditRefundPolicy, setCanRefundEditPolicy] = useState(true);
  const [toggle] = useState(route.params?.data?.allDay);
  const eventOldStartDateTime = route.params?.data?.start_datetime;
  const eventOldEndDateTime = route.params?.data?.end_datetime;
  const eventOldUntilDateTime = route.params?.data?.untilDate;
  const [eventStartDateTime, setEventStartdateTime] = useState(new Date());
  const [eventEndDateTime, setEventEnddateTime] = useState(new Date());
  const [eventUntilDateTime, setEventUntildateTime] = useState(new Date());
  const [searchLocation, setSearchLocation] = useState('');
  const [locationDetail, setLocationDetail] = useState({});
  const [is_Blocked, setIsBlocked] = useState(false);
  const [loading, setloading] = useState(false);
  const [is_Offline, setIsOffline] = useState(false);
  const [onlineUrl, setOnlineUrl] = useState('');
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [visibleWhoCanPostModal, setVisibleWhoCanPostModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState({});

  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [whoOption] = useState('');
  const [whoCanJoinOption, setWhoCanJoinOption] = useState({});

  const [whoCanSeeOption, setWhoCanSeeOption] = useState({});

  const [whoCanPost, setWhoCanPost] = useState({});

  const [whoCanInviteOption, setWhoCanInviteOption] = useState({});

  const [sportsData, setSportsData] = useState([]);
  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');
  const [backgroundThumbnail, setBackgroundThumbnail] = useState('');
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);
  const venueInputRef = useRef();
  const refundPolicyInputRef = useRef();
  const [canOrganizerEdit, setCanOrganizerEdit] = useState(true);
  const [snapPoints, setSnapPoints] = useState([]);
  const [actualStartDate, setActualStartDate] = useState(new Date());
  const [actualEndDate, setActualEndtDate] = useState(new Date());
  const [occurance, setOccurance] = useState(0);

  useEffect(() => {
    if (isFocused) {
      if (route.params?.data) {
        const data = {...route.params.data};

        setEventData(data);
        setEventTitle(data.title);
        setActualStartDate(data?.actual_startdatetime);
        setActualEndtDate(data?.actual_enddatetime);
        setEventDescription(data.descriptions);
        setOccurance(data?.repeat ?? 0);
        setEventPosted({...data.event_posted_at});
        setMinAttendees(data.min_attendees ?? '');
        setMaxAttendees(data.max_attendees ?? '');
        setEventFee(
          data.event_fee.value === 'NaN' ? '0' : data.event_fee.value,
        );
        setRefundPolicy(data.refund_policy ?? '');

        setEventStartdateTime(getJSDate(data.start_datetime));
        setEventEnddateTime(getJSDate(data.end_datetime));
        setEventUntildateTime(getJSDate(data.untilDate));
        setSearchLocation(data.location.location_name);
        setLocationDetail({...data.location});
        setIsBlocked(data.blocked);
        setIsOffline(data.is_Offline);
        setOnlineUrl(data?.online_url);
        setSelectedSport(data?.selected_sport);
        setWhoCanJoinOption({...data?.who_can_join});
        setWhoCanSeeOption({...data?.who_can_see});
        setWhoCanPost({...data?.who_can_post});
        setWhoCanInviteOption({...data?.who_can_invite});
        setSelectWeekMonth(data.repeat);
        setBackgroundThumbnail(data.background_thumbnail);
        setSelectedCurrency(data.event_fee?.currency_type);
        if (
          data &&
          typeof data.refund_policy === 'string' &&
          data.refund_policy.trim() === ''
        ) {
          setCanRefundEditPolicy(true);
        } else {
          setCanRefundEditPolicy(false);
        }

        const goingList =
          data?.going?.length > 0
            ? data.going.filter((item) => item !== data.owner_id)
            : [];

        if (goingList.length > 0) {
          setCanOrganizerEdit(false);
        }
        setTimeout(() => {
          Alert.alert('', strings.moreThanOneOrganizerJoinText, [
            {text: strings.OkText},
          ]);
        }, 1000);
      }
    }
  }, [isFocused, route.params?.data]);

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
      setLocationDetail({
        ...locationDetail,
        latitude: route.params.locationDetail.lat,
        longitude: route.params.locationDetail.lng,
      });
      setSearchLocation(route.params.locationName);
    }
  }, [isFocused, route.params, locationDetail]);

  useEffect(() => {
    const list = getSportList(authContext.sports);
    setSportsData(list);
  }, [authContext.sports]);

  useEffect(() => {
    // setloading(true);

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
        } else if (whoOption === post) {
          setWhoCanPost(item);
        } else {
          setEventPosted(item);
        }
        setVisibleWhoCanPostModal(false);
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
          (whoOption === invite && whoCanInviteOption.value === item?.value) ||
          (whoOption === post && whoCanPost.value === item?.value) ? (
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
            Alert.alert(
              'This feature is not available (on this device / in this context)',
            );
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
                console.log(e);
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
    if (!selectedSport?.sport) {
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
    selectedSport,
  ]);

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
            if (route.params?.comeName === 'EventScreen') {
              navigation.navigate('EventScreen', {
                screen: 'EventScreen',
              });
            } else {
              navigation.goBack();
            }
          },
        },
      ],
      {cancelable: false},
    );
  });
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

  const onDonePress = () => {
    if (checkValidation()) {
      // setloading(true);
      const entity = authContext.entity;
      const entityRole = entity.role === 'user' ? 'users' : 'groups';

      const data = {
        ...eventData,
        title: eventTitle,
        descriptions: eventDescription,
        background_thumbnail: eventData.background_thumbnail,
        background_full_image: eventData.background_full_image,
        allDay: toggle,
        is_recurring: selectWeekMonth !== Verbs.eventRecurringEnum.Never,
        repeat: selectWeekMonth,
        blocked: is_Blocked,
        selected_sport: selectedSport,
        who_can_see: {
          ...whoCanSeeOption,
        },
        who_can_join: {
          ...whoCanJoinOption,
        },
        who_can_post: {
          ...whoCanPost,
        },
        event_posted_at: eventPosted,
        event_fee: {
          value: eventFee,
          currency_type: selectedCurrency,
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
      };

      data.start_datetime = eventOldStartDateTime;
      data.new_start_datetime = getTCDate(eventStartDateTime);
      data.end_datetime = eventOldEndDateTime;
      data.new_end_datetime = getTCDate(eventEndDateTime);
      data.untilDate = eventOldUntilDateTime;
      data.new_untilDate = eventData.untilDate;

      // navigation.navigate('EditEventScreen2');

      navigation.navigate('EditEventScreen2', {
        createEventData: data,
        backgroundImageChangedFlag: backgroundImageChanged,
        backgroundThumbnailFlag: backgroundThumbnail,
        eventStartDateTimeflag: eventStartDateTime,
        selectWeekMonthFlag: selectWeekMonth,
        groupsSeeListFlag: groupsSeeList,
        groupsJoinListFlag: groupsJoinList,
        eventUntilDateTimeflag: eventUntilDateTime,
      });
    }
  };

  const onSelectAddress = (_location) => {
    setLocationDetail({
      ...locationDetail,
      latitude: _location.latitude,
      longitude: _location.longitude,
    });
    setSearchLocation(_location.formattedAddress);
  };

  const see = 'see';
  const join = 'join';
  const posted = 'posted';
  const invite = 'invite';
  const post = 'post';

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
            text: strings.followerTitleText,
            value: 2,
          },
          {
            text: strings.oraganizerOnly,
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
            text: strings.followersRadio,
            value: 3,
          },
          {
            text: strings.invited,
            value: 4,
          },
          {
            text: strings.oraganizerOnly,
            value: 1,
          },
          // strings.everyoneTitleText,
          // strings.followingAndFollowers,
          // strings.following,
          // strings.,
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
            text: strings.oraganizerOnly,
            value: 1,
          },
          // strings.attendeeRadioText,
          // strings.onlymeTitleText
        ];
      }
      if (whoOption === post) {
        return [
          {
            text: strings.everyoneRadio,
            value: 0,
          },
          {
            text: strings.attendeeRadioText,
            value: 1,
          },
          {
            text: strings.oraganizerOnly,
            value: 2,
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
          {text: strings.oraganizerOnly, value: 1},
        ];
      }

      if (whoOption === join) {
        return [
          {text: strings.everyoneTitleText, value: 0},
          {text: strings.followerTitleText, value: 3},
          {text: strings.membersTitle, value: 2},
          {text: strings.invited, value: 4},
          {text: strings.oraganizerOnly, value: 1},
        ];
      }

      if (whoOption === invite) {
        return [
          {text: strings.attendeeRadioText, value: 0},
          {text: strings.oraganizerOnly, value: 1},
        ];
      }
    }
    return [];
  };

  const getRecurringEventsByOccurrence = (eventObject) => {
    const ruleObj = RRule.parseString(eventObject?.rrule);

    ruleObj.dtstart = getJSDate(eventObject.start_datetime);
    ruleObj.count = eventObject?.occurrence;
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

    return dates;
  };

  const getEndDateWhenOccurenceChange = (occr) => {
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

    eventData.rrule = rule;
    eventData.occurrence = occr;

    getRecurringEventsByOccurrence(eventData);
  };

  // const getTheEndDate = (eData) => {
  //   getRecurringEventsByOccurrence(eData);
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.editEvent}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() => {
          onDonePress();
        }}
      />

      <TCFormProgress totalSteps={2} curruentStep={1} />
      <ActivityLoader visible={loading} />

      <TCKeyboardView>
        <ScrollView bounces={false} nestedScrollEnabled={true}>
          <View style={{width: '110%', paddingTop: 10, alignSelf: 'center'}}>
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
          <View style={{paddingHorizontal: 10}}>
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
              value={eventDescription}
              containerStyle={{marginBottom: 35}}
            />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.organizerTitle}
              </Text>
              <TCProfileView
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
              />
            </View>

            <EventItemRender
              containerStyle={{position: 'relative', marginBottom: 35}}
              headerTextStyle={{fontSize: 16}}
              title={strings.place}>
              <EventVenueTogglebtn
                offline={is_Offline}
                firstTabTitle={strings.offline}
                secondTabTitle={strings.online}
                onFirstTabPress={() =>
                  canOrganizerEdit ? setIsOffline(true) : {}
                }
                onSecondTabPress={() =>
                  canOrganizerEdit ? setIsOffline(false) : {}
                }
              />
              {is_Offline ? (
                <>
                  <TextInput
                    placeholder={strings.venueNamePlaceholder}
                    style={[styles.textInputStyle, {marginBottom: 10}]}
                    onChangeText={(value) => {
                      setLocationDetail({...locationDetail, venue_name: value});
                    }}
                    value={locationDetail?.venue_name}
                    // multiline={multiline}
                    textAlignVertical={'center'}
                    placeholderTextColor={colors.userPostTimeColor}
                    editable={canOrganizerEdit}
                  />

                  <TCTouchableLabel
                    placeholder={strings.addressPlaceholder}
                    title={searchLocation}
                    showShadow={false}
                    showNextArrow={true}
                    onPress={() => {
                      if (canOrganizerEdit) setVisibleLocationModal(true);
                    }}
                    style={{
                      width: '98%',
                      alignSelf: 'center',
                      backgroundColor: colors.textFieldBackground,
                    }}
                  />
                  <EventMapView
                    region={{
                      latitude: locationDetail.latitude,
                      longitude: locationDetail.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    coordinate={{
                      latitude: locationDetail.latitude,
                      longitude: locationDetail.longitude,
                    }}
                  />
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
                      value={locationDetail?.venue_detail}
                      multiline={true}
                      textAlignVertical={'center'}
                      placeholderTextColor={colors.userPostTimeColor}
                      editable={canOrganizerEdit}
                    />
                  </Pressable>

                  <AddressLocationModal
                    visibleLocationModal={visibleLocationModal}
                    setVisibleAddressModalhandler={() =>
                      setVisibleLocationModal(false)
                    }
                    onAddressSelect={onSelectAddress}
                    handleSetLocationOptions={onSelectAddress}
                    onDonePress={() => {}}
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
                    editable={canOrganizerEdit}
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
                onDatePress={() =>
                  canOrganizerEdit ? setStartDateVisible(!startDateVisible) : {}
                }
                labelStyle={
                  canOrganizerEdit ? {} : {color: colors.placeHolderColor}
                }
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
                onDatePress={() =>
                  canOrganizerEdit ? setEndDateVisible(!endDateVisible) : {}
                }
                labelStyle={
                  canOrganizerEdit ? {} : {color: colors.placeHolderColor}
                }
              />
              <Pressable
                style={{
                  opacity: 0.3,
                }}
                pointerEvents="none">
                <EventMonthlySelection
                  title={strings.repeat}
                  dataSource={[
                    {
                      label: strings.never,
                      value: Verbs.eventRecurringEnum.Never,
                    },
                    {
                      label: strings.daily,
                      value: Verbs.eventRecurringEnum.Daily,
                    },
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
              </Pressable>
              <Pressable
                style={{
                  opacity: 0.3,
                }}
                pointerEvents="none">
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
                    getEndDateWhenOccurenceChange(value);
                  }}
                  editable={canOrganizerEdit}
                />
              </Pressable>
            </EventItemRender>

            {eventData?.occurrence !== 0 ? (
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
                  {strings.from}
                  {moment(getJSDate(actualStartDate)).format(
                    'MMMM DD, YYYY',
                  )}{' '}
                  {strings.to}{' '}
                  {moment(getJSDate(actualEndDate)).format('MMMM DD, YYYY')}
                </Text>
              </View>
            ) : null}

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
                    textDecorationColor: '#000',
                  }}>
                  {Intl.DateTimeFormat()
                    ?.resolvedOptions()
                    .timeZone.split('/')
                    .pop()}
                </Text>
              </TouchableOpacity>
            </View>

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
                  onChangeText={(value) => {
                    if (value >= 0 || value < 0) {
                      setEventFee(value);
                    }
                  }}
                  value={eventFee}
                  textAlignVertical={'center'}
                  placeholderTextColor={colors.userPostTimeColor}
                  editable={canOrganizerEdit}
                />
                <Text style={styles.currencyStyle}>{selectedCurrency}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  canOrganizerEdit ? setShowCurrencyModal(true) : {}
                }>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.RRegular,
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
                style={styles.detailsContainer}
                onPress={() => {
                  if (canOrganizerEdit) refundPolicyInputRef.current.focus();
                }}>
                <TextInput
                  ref={refundPolicyInputRef}
                  placeholder={strings.additionalRefundPolicy}
                  style={styles.detailsInputStyle}
                  onChangeText={(value) => setRefundPolicy(value)}
                  value={refundPolicy}
                  multiline={true}
                  textAlignVertical={'center'}
                  placeholderTextColor={colors.userPostTimeColor}
                  editable={canEditRefundPolicy}
                />
              </Pressable>
              {/* <Text style={[styles.subTitleText, {marginTop: 0}]}>
                Attendees must be refunded if the event is canceled or
                rescheduled. Read payment policy for more information.
              </Text> */}
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.numberOfAttend}
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
        title={whoOption === 'join' ? strings.whoCanJoin : strings.whoCanSee}
        containerStyle={{
          padding: 15,
          marginBottom: Platform.OS === 'ios' ? 35 : 0,
        }}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([contentHeight, contentHeight]);
          }}>
          <FlatList
            data={getOptions()}
            renderItem={renderWhoCan}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </CustomModalWrapper>

      <CurrencyModal
        isVisible={showCurrencyModal}
        closeList={() => setShowCurrencyModal(false)}
        currency={selectedCurrency}
        onNext={(item) => {
          setSelectedCurrency(item);
          setShowCurrencyModal(false);
        }}
      />

      <CustomModalWrapper
        isVisible={visibleWhoCanPostModal}
        closeModal={() => setVisibleWhoCanPostModal(false)}
        modalType={ModalTypes.style2}
        title={whoOption === join ? strings.whoCanJoin : strings.whoCanSee}
        containerStyle={{
          padding: 15,
          marginBottom: Platform.OS === 'ios' ? 35 : 0,
        }}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([contentHeight, contentHeight]);
          }}>
          <FlatList
            data={getOptions()}
            renderItem={renderWhoCan}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </CustomModalWrapper>

      <ActionSheet
        ref={actionSheet}
        // title={'NewsFeed Post'}
        options={[strings.camera, strings.album, strings.cancelTitle]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
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
