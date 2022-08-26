/* eslint-disable default-case */
/* eslint-disable no-dupe-else-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useLayoutEffect,
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
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import ActionSheet from 'react-native-actionsheet';

import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import AuthContext from '../../../auth/context';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import EventMapView from '../../../components/Schedule/EventMapView';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
// import EventSearchLocation from '../../../components/Schedule/EventSearchLocation';
import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import {createEvent} from '../../../api/Schedule';
import TCProfileView from '../../../components/TCProfileView';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getLocationNameWithLatLong} from '../../../api/External';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop, getNearDateTime, getSportName} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';
import uploadImages from '../../../utils/imageAction';

export default function CreateEventScreen({navigation, route}) {
  const eventPostedList = [
    {value: 0, text: 'Schedule only'},
    {value: 1, text: 'Schedule & posts'},
  ];
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPosted, setEventPosted] = useState({
    value: 0,
    text: 'Schedule only',
  });
  const [minAttendees, setMinAttendees] = useState();
  const [maxAttendees, setMaxAttendees] = useState();
  const [eventFee, setEventFee] = useState(0);
  const [refundPolicy, setRefundPolicy] = useState('');
  const [toggle] = useState(false);
  const [eventStartDateTime, setEventStartdateTime] = useState(
    toggle
      ? new Date().setDate(new Date().getDate() + 1)
      : getNearDateTime(new Date()),
  );

  const [eventEndDateTime, setEventEnddateTime] = useState(
    toggle
      ? new Date().setDate(new Date().getDate() + 1)
      : moment(eventStartDateTime).add(5, 'm').toDate(),
  );
  const [eventUntilDateTime, setEventUntildateTime] =
    useState(eventEndDateTime);
  const [searchLocation, setSearchLocation] = useState();
  const [locationDetail, setLocationDetail] = useState(null);
  const [is_Blocked, setIsBlocked] = useState(false);
  const [loading, setloading] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [sportsSelection, setSportsSelection] = useState();
  const [selectedSport, setSelectedSport] = useState();

  const [whoOpetion, setWhoOpetion] = useState();
  const [whoCanJoinOpetion, setWhoCanJoinOpetion] = useState({
    text: 'Everyone',
    value: 0,
  });
  const [whoCanSeeOpetion, setWhoCanSeeOpetion] = useState({
    text: 'Everyone',
    value: 0,
  });

  const [sportsData, setSportsData] = useState([]);
  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);

  const [isAll, setIsAll] = useState(false);

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('Never');
  const [backgroundThumbnail, setBackgroundThumbnail] = useState();
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);

  const whoCanJoinUser = [
    {text: 'Everyone', value: 0},
    {
      text: 'Followers',
      value: 1,
    },
    {text: 'Invited only', value: 2},
  ];
  const whoCanSeeUser = [
    {text: 'Everyone', value: 0},
    {
      text: 'Followers',
      value: 1,
    },
    {text: 'Only me', value: 2},
  ];
  const whoCanJoinGroup = [
    {text: 'Everyone', value: 0},
    {
      text: 'Follower',
      value: 1,
    },
    {
      text: 'Member',
      value: 2,
    },
    {text: 'Invite only', value: 3},
  ];
  const whoCanSeeGroup = [
    {text: 'Everyone', value: 0},
    {
      text: 'Follower',
      value: 1,
    },

    {
      text: 'Member',
      value: 2,
    },
    {text: 'Team only', value: 3},
  ];
  const countNumberOfWeekFromDay = () => {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = date;
    const givenDay = new Date().getDay();
    let numberOfDates = 0;
    while (startDate < endDate) {
      if (startDate.getDay() === givenDay) {
        numberOfDates++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    return ordinal_suffix_of(numberOfDates);
  };
  const countNumberOfWeeks = () => {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = date;
    const givenDay = new Date().getDay();
    let numberOfDates = 0;
    while (startDate < endDate) {
      if (startDate.getDay() === givenDay) {
        numberOfDates++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    return numberOfDates;
  };
  const getTodayDay = () => {
    const dt = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    return dt.format('dddd');
  };
  const handleStartDatePress = (date) => {
    console.log('Date::=>', new Date(new Date(date).getTime()));
    setEventStartdateTime(
      toggle ? new Date(date).setHours(0, 0, 0, 0) : new Date(date),
    );
    setEventEnddateTime(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : new Date(moment(date).add(5, 'm').toDate()),
    );
    setEventUntildateTime(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : new Date(moment(date).add(5, 'm').toDate()),
    );
    setStartDateVisible(!startDateVisible);
  };
  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
    setUntilDateVisible(false);
  };

  const handleEndDatePress = (date) => {
    let dateValue = new Date();
    if (toggle) {
      dateValue = `${moment(date).format('ddd MMM DD YYYY')} 11:59:59 PM`;
      console.log('Date Value :-', dateValue);
      setEventEnddateTime(new Date(dateValue));
      setEventUntildateTime(new Date(moment(dateValue).add(5, 'm').toDate()));
    } else {
      setEventEnddateTime(new Date(date));
      setEventUntildateTime(new Date(moment(date).add(5, 'm').toDate()));
    }
    setEndDateVisible(!endDateVisible);
  };

  const handleUntilDatePress = (date) => {
    setEventUntildateTime(date);
    setUntilDateVisible(!untilDateVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Are you sure you want to quit to create this event?',
              '',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Quit',
                  onPress: () => navigation.goBack(),
                },
              ],
              {cancelable: false},
            );
          }}>
          <Image source={images.backArrow} style={styles.backImageStyle} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{padding: 2, marginRight: 15}}
          onPress={onDonePress}>
          <Text>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    backgroundThumbnail,
    eventTitle,
    eventDescription,
    sportsSelection,
    selectedSport,
    maxAttendees,
    minAttendees,
    locationDetail,
    eventFee,
    refundPolicy,
    eventPosted,
    route?.params,
  ]);

  useEffect(() => {
    if (isFocused) {
      getSports();
      if (route?.params?.locationName) {
        console.log('route.params.locationName', route.params.locationName);
        setSearchLocation(route.params.locationName);
      }
    }
  }, [isFocused, route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (route.params.comeName) {
        Geolocation.getCurrentPosition(
          (position) => {
            const latValue = position.coords.latitude;
            const longValue = position.coords.longitude;
            const obj = {
              ...locationDetail,
              lat: latValue,
              lng: longValue,
            };
            setLocationDetail(obj);
            getLocationNameWithLatLong(latValue, longValue, authContext).then(
              (res) => {
                setSearchLocation(res.results[0].formatted_address);
              },
            );
          },
          (error) => {
            console.log('Error :-', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 10000,
          },
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [route.params.comeName]);

  useEffect(() => {
    setloading(true);
    // getGroups(authContext)
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

  const ordinal_suffix_of = (i) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return `${i}st`;
    }
    if (j === 2 && k !== 12) {
      return `${i}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${i}rd`;
    }
    return `${i}th`;
  };

  // eslint-disable-next-line no-unused-vars
  const convertDateToUTC = (date) => {
    const dt = new Date(date);
    return new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
  };

  const getSports = () => {
    let sportArr = [];
    authContext.sports.map((item) => {
      const filterFormat = item.format.filter(
        (obj) => obj.entity_type === 'team',
      );
      sportArr = [...sportArr, ...filterFormat];
      return null;
    });
    setSportsData([...sportArr]);
  };

  const renderSports = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSelectedSport(item);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
        }}>
        <Text style={styles.languageList}>
          {getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {selectedSport?.sport === item?.sport ? (
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

  const renderWhoCan = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        if (whoOpetion === 'see') {
          setWhoCanSeeOpetion(item);
        } else {
          setWhoCanJoinOpetion(item);
        }

        setTimeout(() => {
          setVisibleWhoModal(false);
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
        }}>
        <Text style={styles.languageList}>{item.text}</Text>
        <View style={styles.checkbox}>
          {(whoOpetion === 'see' && whoCanSeeOpetion.value === item?.value) ||
          (whoOpetion === 'join' && whoCanJoinOpetion.value === item?.value) ? (
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

  const renderEventPostedOpetions = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 15,

        marginRight: 15,
      }}>
      <TouchableOpacity
        onPress={() => {
          setEventPosted(item);
        }}>
        <Image
          source={
            eventPosted.value === item.value
              ? images.checkRoundOrange
              : images.radioUnselect
          }
          style={styles.radioButtonStyle}
        />
      </TouchableOpacity>
      <Text style={styles.eventPostedTitle}>{item.text}</Text>
    </View>
  );

  const renderSeeGroups = ({item, index}) => (
    <GroupEventItems
      eventImageSource={
        item.entity_type === 'team' ? images.teamPatch : images.clubPatch
      }
      eventText={item.group_name}
      groupImageSource={
        item.thumbnail
          ? {uri: item.thumbnail}
          : item.entity_type === 'team'
          ? images.teamPlaceholder
          : images.clubPlaceholder
      }
      checkBoxImage={
        item.isSelected ? images.orangeCheckBox : images.uncheckWhite
      }
      onCheckBoxPress={() => {
        groupsSeeList[index].isSelected = !groupsSeeList[index].isSelected;
        setGroupsSeeList([...groupsSeeList]);
        setIsAll(false);
      }}
    />
  );

  const renderJoinGroups = ({item, index}) => (
    <GroupEventItems
      eventImageSource={
        item.entity_type === 'team' ? images.teamPatch : images.clubPatch
      }
      eventText={item.group_name}
      groupImageSource={
        item.thumbnail
          ? {uri: item.thumbnail}
          : item.entity_type === 'team'
          ? images.teamPlaceholder
          : images.clubPlaceholder
      }
      checkBoxImage={
        item.isSelected ? images.orangeCheckBox : images.uncheckWhite
      }
      onCheckBoxPress={() => {
        groupsJoinList[index].isSelected = !groupsJoinList[index].isSelected;
        setGroupsJoinList([...groupsJoinList]);
        setIsAll(false);
      }}
    />
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

  const openImagePicker = (width = 400, height = 400) => {
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

  const openCamera = (width = 400, height = 400) => {
    check(PERMISSIONS.IOS.CAMERA)
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
                  Alert.alert(e);
                });
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
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
                Alert.alert(e);
              });
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
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
      Alert.alert(strings.appName, 'Please Enter Event Title.');
      return false;
    }
    if (sportsSelection === undefined) {
      Alert.alert(strings.appName, 'Please choose sport.');
      return false;
    }
    if (eventDescription === '') {
      Alert.alert(strings.appName, 'Please Enter Event Description.');
      return false;
    }
    if (eventStartDateTime === '') {
      Alert.alert(strings.appName, 'Please Select Event Start Date and Time.');
      return false;
    }
    if (eventEndDateTime === '') {
      Alert.alert(strings.appName, 'Please Select Event End Date and Time.');
      return false;
    }
    if (eventEndDateTime === '') {
      Alert.alert(strings.appName, 'Please Select Event End Date and Time.');
      return false;
    }
    if (!locationDetail?.venue_name || locationDetail?.venue_name?.length < 1) {
      Alert.alert(strings.appName, 'Please enter venue name.');
      return false;
    }
    if (
      !locationDetail?.venue_detail ||
      locationDetail?.venue_detail?.length < 1
    ) {
      Alert.alert(strings.appName, 'Please enter venue description.');
      return false;
    }

    if (Number(minAttendees) > 0 && Number(maxAttendees) > 0) {
      if (Number(minAttendees) === 0) {
        Alert.alert(
          strings.appName,
          'Please enter valid minimum attendees number(0 not allowed).',
        );
        return false;
      }
      if (Number(maxAttendees) === 0) {
        Alert.alert(
          strings.appName,
          'Please enter valid maximum attendees number(0 not allowed).',
        );
        return false;
      }
      if (Number(minAttendees) > Number(maxAttendees)) {
        Alert.alert(strings.appName, 'Please enter valid attendees number.');
        return false;
      }
    }

    return true;
  }, [
    eventDescription,
    eventEndDateTime,
    eventStartDateTime,
    eventTitle,
    locationDetail?.venue_detail,
    locationDetail?.venue_name,
    maxAttendees,
    minAttendees,
    sportsSelection,
  ]);

  const createEventDone = (data) => {
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole = entity.role === 'user' ? 'users' : 'groups';

    let rule = '';
    if (
      selectWeekMonth === 'Daily' ||
      selectWeekMonth === 'Weekly' ||
      selectWeekMonth === 'Monthly' ||
      selectWeekMonth === 'Yearly'
    ) {
      rule = selectWeekMonth.toUpperCase();
    } else if (
      selectWeekMonth ===
      `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`
    ) {
      rule = `MONTHLY;BYDAY=${getTodayDay()
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks()}`;
    } else if (
      selectWeekMonth ===
      `Monthly on ${ordinal_suffix_of(new Date().getDate())} day`
    ) {
      rule = `MONTHLY;BYMONTHDAY=${new Date().getDate()}`;
    }
    if (selectWeekMonth !== 'Never') {
      data[0].untilDate = Number(
        parseFloat(new Date(eventUntilDateTime).getTime() / 1000).toFixed(0),
      );
      data[0].rrule = `FREQ=${rule}`;
    }

    console.log('DADADADAD', data);

    createEvent(entityRole, uid, data, authContext)
      .then((response) => {
        console.log('Response :-', response);
        setTimeout(() => {
          setloading(false);
          navigation.navigate('ScheduleScreen');
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        console.log('Error ::--', e);
        Alert.alert('', e.messages);
      });
  };

  const onDonePress = () => {
    if (checkValidation()) {
      setloading(true);
      const entity = authContext.entity;
      const entityRole = entity.role === 'user' ? 'users' : 'groups';
      const data = [
        {
          title: eventTitle,
          descriptions: eventDescription,
          allDay: toggle,
          start_datetime: Number(
            parseFloat(
              new Date(convertDateToUTC(eventStartDateTime)).getTime() / 1000,
            ).toFixed(0),
          ),
          end_datetime: Number(
            parseFloat(
              new Date(convertDateToUTC(eventEndDateTime)).getTime() / 1000,
            ).toFixed(0),
          ),
          is_recurring: selectWeekMonth !== 'Never',
          blocked: is_Blocked,
          selected_sport: sportsSelection,
          who_can_see: {
            ...whoCanSeeOpetion,
          },
          who_can_join: {
            ...whoCanJoinOpetion,
          },
          event_posted_at: eventPosted,
          event_fee: {
            value: Number(eventFee),
            currency_type: strings.defaultCurrency,
          },
          refund_policy: refundPolicy,
          min_attendees: Number(minAttendees),
          max_attendees: Number(maxAttendees),
          entity_type:
            authContext.entity.role === 'user'
              ? 'player'
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
            latitude: locationDetail.lat,
            longitude: locationDetail.lng,
            venue_name: locationDetail.venue_name,
            venue_detail: locationDetail.venue_detail,
          },
        },
      ];

      if (whoCanSeeOpetion.value === 2) {
        const checkedGroup = groupsSeeList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === 'user') {
          data[0].who_can_see.group_ids = resultOfIds;
        } else {
          data[0].who_can_see.group_ids = [authContext.entity.uid];
        }
      }

      if (whoCanJoinOpetion.value === 2) {
        const checkedGroup = groupsJoinList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === 'user') {
          data[0].who_can_join.group_ids = resultOfIds;
        } else {
          data[0].who_can_join.group_ids = [authContext.entity.uid];
        }
      }

      console.log('create event', data);

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
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          });
      } else {
        createEventDone(data);
      }
    }
  };

  return (
    <>
      <ActivityLoader visible={loading} />

      <View style={styles.sperateLine} />
      <TCKeyboardView>
        <ScrollView bounces={false} nestedScrollEnabled={true}>
          <SafeAreaView>
            <EventBackgroundPhoto
              isEdit={!!backgroundThumbnail}
              isPreview={false}
              imageURL={
                backgroundThumbnail
                  ? {uri: backgroundThumbnail}
                  : images.backgroundGrayPlceholder
              }
              onPress={() => onBGImageClicked()}
            />
            <EventTextInputItem
              title={strings.title}
              isRequired={true}
              placeholder={strings.titlePlaceholder}
              onChangeText={(text) => {
                setEventTitle(text);
              }}
              value={eventTitle}
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
                  // onChangeText={onChangeText}
                  value={getSportName(sportsSelection, authContext)}
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
              // multiline={true}
              value={eventDescription}
            />

            <EventItemRender
              title={strings.timeTitle}
              isRequired={true}
              headerTextStyle={{marginBottom: 15}}>
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
                onDatePress={() => setStartDateVisible(!startDateVisible)}
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
                  {label: 'Daily', value: 'Daily'},
                  {label: 'Weekly', value: 'Weekly'},
                  {
                    label: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
                    value: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
                  },
                  {
                    label: `Monthly on ${ordinal_suffix_of(
                      new Date().getDate(),
                    )} day`,
                    value: `Monthly on ${ordinal_suffix_of(
                      new Date().getDate(),
                    )} day`,
                  },
                  {label: 'Yearly', value: 'Yearly'},
                ]}
                placeholder={'Never'}
                value={selectWeekMonth}
                onValueChange={(value) => {
                  setSelectWeekMonth(value);
                }}
              />
              {selectWeekMonth !== 'Never' && (
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

            <EventItemRender title={''}>
              <Text style={styles.availableSubHeader}>
                {strings.availableSubTitle}
              </Text>
              <BlockAvailableTabView
                blocked={is_Blocked}
                firstTabTitle={'Blocked'}
                secondTabTitle={'Available'}
                onFirstTabPress={() => setIsBlocked(true)}
                onSecondTabPress={() => setIsBlocked(false)}
              />
            </EventItemRender>

            <EventItemRender title={strings.place} isRequired={true}>
              <TextInput
                placeholder={'Venue name'}
                style={styles.textInputStyle}
                onChangeText={(value) => {
                  setLocationDetail({...locationDetail, venue_name: value});
                }}
                value={locationDetail?.venue_name}
                // multiline={multiline}
                textAlignVertical={'center'}
                placeholderTextColor={colors.userPostTimeColor}
              />

              <TCTouchableLabel
                placeholder={strings.searchHereText}
                title={searchLocation}
                showShadow={false}
                showNextArrow={true}
                onPress={() => {
                  navigation.navigate('SearchLocationScreen', {
                    comeFrom: 'CreateEventScreen',
                  });
                  navigation.setParams({comeName: null});
                }}
                style={{
                  width: '98%',
                  alignSelf: 'center',
                  backgroundColor: colors.textFieldBackground,
                }}
              />
              <EventMapView
                region={{
                  latitude: locationDetail ? locationDetail.lat : 0.0,
                  longitude: locationDetail ? locationDetail.lng : 0.0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                coordinate={{
                  latitude: locationDetail ? locationDetail.lat : 0.0,
                  longitude: locationDetail ? locationDetail.lng : 0.0,
                }}
              />
              <TextInput
                placeholder={'Details'}
                style={styles.detailsInputStyle}
                onChangeText={(value) => {
                  setLocationDetail({...locationDetail, venue_detail: value});
                }}
                value={locationDetail?.venue_detail}
                multiline={true}
                textAlignVertical={'center'}
                placeholderTextColor={colors.userPostTimeColor}
              />
            </EventItemRender>

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
                  authContext?.entity?.obj?.thumbnail
                    ? {uri: authContext?.entity?.obj?.thumbnail}
                    : images.teamPH
                }
                alignSelf={'flex-start'}
                marginTop={10}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanJoin}</Text>

              <TouchableOpacity
                onPress={() => {
                  setWhoOpetion('join');
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanJoinOpetion.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {whoCanJoinOpetion.value === 2 &&
              authContext.entity.role === 'user' && (
                <View>
                  <View style={styles.allStyle}>
                    <Text style={styles.titleTextStyle}>{strings.all}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsAll(!isAll);
                        const groups = groupsJoinList.map((obj) => ({
                          ...obj,
                          isSelected: !isAll,
                        }));
                        setGroupsJoinList([...groups]);
                      }}>
                      <Image
                        source={
                          isAll ? images.orangeCheckBox : images.uncheckWhite
                        }
                        style={styles.imageStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    scrollEnabled={false}
                    data={[...groupsJoinList]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{height: wp('4%')}} />
                    )}
                    renderItem={renderJoinGroups}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listStyle}
                  />
                </View>
              )}
            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.numberOfAttend}
                <Text style={styles.opetionalTextStyle}>{' opetional'}</Text>
              </Text>
              <Text style={styles.subTitleText}>
                The event may be canceled by the organizer if the minimum number
                of the attendees isn’t met.
              </Text>
              <NumberOfAttendees
                onChangeMinText={setMinAttendees}
                onChangeMaxText={setMaxAttendees}
                min={minAttendees}
                max={maxAttendees}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.eventFeeTitle}
              </Text>
              <View style={styles.feeContainer}>
                <TextInput
                  style={styles.eventFeeStyle}
                  placeholder={`${eventFee}`}
                  keyboardType={'decimal-pad'}
                  onChangeText={(value) => setEventFee(value)}
                  // value={eventFee}
                  textAlignVertical={'center'}
                  placeholderTextColor={colors.userPostTimeColor}
                />
                <Text style={styles.currencyStyle}>CAD</Text>
              </View>
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.refundPolicyTitle}
              </Text>
              <Text
                style={{fontSize: 14, fontFamily: fonts.RBold, marginTop: 15}}>
                {'Primary Refund Policy'}
              </Text>
              <Text style={[styles.subTitleText, {marginTop: 10}]}>
                Attendees must be refunded if the event is canceled or
                rescheduled.
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.RRegular,
                    textDecorationLine: 'underline',
                  }}>
                  {'\n'}Read payment policy for more information.
                </Text>
              </Text>
              <Text
                style={{fontSize: 14, fontFamily: fonts.RBold, marginTop: 15}}>
                {'Additional Refund Policy'}
              </Text>
              <TextInput
                placeholder={'Refund Policy'}
                style={styles.detailsInputStyle}
                onChangeText={(value) => setRefundPolicy(value)}
                value={refundPolicy}
                multiline={true}
                textAlignVertical={'center'}
                placeholderTextColor={colors.userPostTimeColor}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.whereEventPosted}
              </Text>
              <FlatList
                scrollEnabled={false}
                data={eventPostedList}
                renderItem={renderEventPostedOpetions}
                style={{marginTop: 15}}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOpetion('see');
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanSeeOpetion.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {whoCanSeeOpetion.value === 2 &&
              authContext.entity.role === 'user' && (
                <View>
                  <View style={styles.allStyle}>
                    <Text style={styles.titleTextStyle}>{strings.all}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsAll(!isAll);
                        const groups = groupsSeeList.map((obj) => ({
                          ...obj,
                          isSelected: !isAll,
                        }));
                        setGroupsSeeList([...groups]);
                      }}>
                      <Image
                        source={
                          isAll ? images.orangeCheckBox : images.uncheckWhite
                        }
                        style={styles.imageStyle}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    scrollEnabled={false}
                    data={[...groupsSeeList]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <View style={{height: wp('4%')}} />
                    )}
                    renderItem={renderSeeGroups}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listStyle}
                  />
                </View>
              )}

            <DateTimePickerView
              // date={eventStartDateTime}
              visible={startDateVisible}
              onDone={handleStartDatePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={
                toggle
                  ? new Date().setDate(new Date().getDate() + 1)
                  : getNearDateTime(new Date())
              }
              minutesGap={5}
              mode={toggle ? 'date' : 'datetime'}
            />
            <DateTimePickerView
              // date={eventEndDateTime}
              visible={endDateVisible}
              onDone={handleEndDatePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={moment(getNearDateTime(new Date(eventStartDateTime)))
                .add(5, 'm')
                .toDate()}
              minutesGap={5}
              mode={toggle ? 'date' : 'datetime'}
            />
            <DateTimePickerView
              // date={eventUntilDateTime}
              visible={untilDateVisible}
              onDone={handleUntilDatePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={moment(eventEndDateTime).add(5, 'm').toDate()}
              minutesGap={5}
              mode={toggle ? 'date' : 'datetime'}
            />
          </SafeAreaView>
        </ScrollView>
      </TCKeyboardView>
      <Modal
        isVisible={visibleSportsModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.1,
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

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}
              onPress={() => {
                setSportsSelection(selectedSport);
                setTimeout(() => {
                  setVisibleSportsModal(false);
                }, 300);
              }}>
              Apply
            </Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
            showsVerticalScrollIndicator={false}
            data={sportsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>

      <Modal
        isVisible={visibleWhoModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleWhoModal(false)}
        onRequestClose={() => setVisibleWhoModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
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
              onPress={() => setVisibleWhoModal(false)}>
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
              Privacy Setting
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
            showsVerticalScrollIndicator={false}
            data={
              ['user', 'player'].includes(authContext.entity.role)
                ? whoOpetion === 'join'
                  ? whoCanJoinUser
                  : whoCanSeeUser
                : whoOpetion === 'join'
                ? whoCanJoinGroup
                : whoCanSeeGroup
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWhoCan}
          />
        </View>
      </Modal>

      <ActionSheet
        ref={actionSheet}
        // title={'News Feed Post'}
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
            deleteImage();
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
  },

  // toggleViewStyle: {
  //   flexDirection: 'row',
  //   marginHorizontal: 2,
  //   justifyContent: 'flex-end',
  //   paddingVertical: 3,
  //   alignItems: 'center',
  //   marginBottom: 8,
  // },
  // allDayText: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   right: wp('8%'),
  // },
  availableSubHeader: {
    fontSize: 16,
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
    marginBottom: 15,
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
    marginBottom: 15,
    alignItems: 'center',
  },
  detailsInputStyle: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: colors.lightBlackColor,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginBottom: 15,
    height: 100,
  },
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
  },

  headerTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    marginVertical: 3,
  },
  opetionalTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
    color: colors.userPostTimeColor,
  },

  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
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
    height: 40,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitleText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginTop: 10,
  },
  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  eventPostedTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  allStyle: {
    flexDirection: 'row',
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    marginTop: 0,
    marginBottom: 0,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  imageStyle: {
    width: wp('5.5%'),
    resizeMode: 'contain',
    marginRight: 10,
  },
  listStyle: {
    marginBottom: 15,
    marginTop: 15,
    paddingBottom: 10,
  },
  backImageStyle: {
    height: 20,
    width: 15,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
    marginLeft: 15,
  },
});
