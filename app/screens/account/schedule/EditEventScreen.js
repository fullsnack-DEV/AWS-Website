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
  Platform,
} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';

import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {format} from 'react-string-format';
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
import TCThinDivider from '../../../components/TCThinDivider';
import {
  deleteConfirmation,
  getHitSlop,
  getSportName,
  getRoundedDate,
  getJSDate,
  getDayFromDate,
  countNumberOfWeekFromDay,
  countNumberOfWeeks,
  getTCDate,
  ordinal_suffix_of
} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';
import uploadImages from '../../../utils/imageAction';
import {editEvent} from '../../../api/Schedule';
import Verbs from '../../../Constants/Verbs';
import AddressLocationModal from '../../../components/AddressLocationModal/AddressLocationModal';

export default function EditEventScreen({navigation, route}) {
  const eventPostedList = [
    {value: 0, text: 'Schedule only'},
    {value: 1, text: 'Schedule & posts'},
  ];
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [eventData] = useState(route?.params?.data);
  const [eventTitle, setEventTitle] = useState(eventData.title);
  const [eventDescription, setEventDescription] = useState(
    eventData.descriptions,
  );
  const [eventPosted, setEventPosted] = useState({
    ...eventData?.event_posted_at,
  });
 
  const [minAttendees, setMinAttendees] = useState(eventData.min_attendees);
  const [maxAttendees, setMaxAttendees] = useState(eventData.max_attendees);
  const [eventFee, setEventFee] = useState(eventData.event_fee.value);
  const [refundPolicy, setRefundPolicy] = useState(
    eventData.refund_policy ?? '',
  );
  const [toggle] = useState(eventData.allDay);
  const [eventStartDateTime, setEventStartdateTime] = useState(getJSDate(eventData.start_datetime));
  const [eventEndDateTime, setEventEnddateTime] = useState(getJSDate(eventData.end_datetime));
  const [eventUntilDateTime, setEventUntildateTime] = useState(getJSDate(eventData.untilDate));
  const [searchLocation, setSearchLocation] = useState(eventData.location.location_name);
  const [locationDetail, setLocationDetail] = useState(eventData.location);
  const [is_Blocked, setIsBlocked] = useState(eventData.blocked);
  const [loading, setloading] = useState(false);
  const [is_Online, setIsOnline] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [modalPostedInvite, setModalPostedInvite] = useState(false);
  const [sportsSelection, setSportsSelection] = useState(eventData?.selected_sport);
  const [selectedSport, setSelectedSport] = useState(eventData?.selected_sport);
  const [recurringEditModal, setRecurringEditModal] =  useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);


  const recurringEditList = [
    {text: 'This event Only', value: 0},
    {
      text: 'This and all following events',
      value: 1,
    },
    {text: 'All events', value: 2},
  ];
  const [whoOption, setWhoOption] = useState();
  const [whoCanJoinOption, setWhoCanJoinOption] = useState({
    ...eventData?.who_can_join,
  });
  const [whoCanSeeOption, setWhoCanSeeOption] = useState({
    ...eventData?.who_can_see,
  });

  const [whoCanInviteOption, setWhoCanInviteOption] = useState({
    ...eventData?.who_can_invite,
  });

  const [sportsData, setSportsData] = useState([]);
  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);

  const [isAll, setIsAll] = useState(false);

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState(eventData.repeat);
  const [backgroundThumbnail, setBackgroundThumbnail] = useState(
    eventData.background_thumbnail,
  );
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);

  const whoCanJoinUser = [
    {text: strings.everyoneRadio, value: 0},
    {
      text: 'Followers',
      value: 1,
    },
    {text: 'Only me', value: 2},
  ];

  const whoCanSeeUser = [
    {text: strings.everyoneRadio, value: 0},
    {
      text: 'Followers',
      value: 1,
    },
    {text: 'Only me', value: 2},
  ];

  const whoCanInviteUser = [
    {
      text: 'Attendee',
      value: 0,
    },
    {text: 'Only me', value: 1},
  ];

  const whoCanJoinGroup = [
    {text: strings.everyoneRadio, value: 0},
    {
      text: 'Follower',
      value: 1,
    },
    {
      text: 'Member',
      value: 2,
    },
    {text: 'Only me', value: 3},
  ];
  const whoCanSeeGroup = [
    {text: strings.everyoneRadio, value: 0},
    {
      text: 'Follower',
      value: 1,
    },
    {
      text: strings.member,
      value: 2,
    },
    {text: strings.teamOnly, value: 3},
  ];

  const whoCanInviteGroup = [
    {
      text: 'Attendee',
      value: 0,
    },
    {text: 'Only me', value: 1},
  ];

  const handleStartDatePress = (date) => {
    const startDateTime = toggle ? new Date(date).setHours(0, 0, 0, 0) : date
    setEventStartdateTime(startDateTime);
    let endDateTime = eventEndDateTime;
    const unitDate = eventUntilDateTime;
    
    if (endDateTime.getTime() <= startDateTime.getTime()){
      endDateTime = toggle ? date.setHours(23,59,59,0)
      :  moment(startDateTime).add(5, 'm').toDate();
    }

    setEventEnddateTime(endDateTime)

    if(!unitDate || endDateTime.getTime() > unitDate.getTime()){
      setEventUntildateTime(moment(endDateTime).add(5, 'm').toDate())
    }
    setStartDateVisible(!startDateVisible);
  };

  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
    setUntilDateVisible(false);
  };

  const handleEndDatePress = (date) => {
    const endDateTime = toggle ? date.setHours(23,59,59,0): date;
    const unitDate = eventUntilDateTime
    setEventEnddateTime(endDateTime);
    if(!unitDate || endDateTime.getTime() > unitDate.getTime()){
      setEventUntildateTime(moment(endDateTime).add(5, 'm').toDate());
    }

    setEndDateVisible(!endDateVisible);
  };

  const handleUntilDatePress = (date) => {
    setEventUntildateTime(toggle ? date.setHours(23,59,59,0): date);
    setUntilDateVisible(!untilDateVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{padding: 2, marginRight: 15}}
          onPress={() => onDonePress()}>
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
    maxAttendees,
    minAttendees,
    locationDetail,
    eventFee,
    refundPolicy,
    is_Blocked,
    selectedSport,
    selectWeekMonth,
    eventStartDateTime,
    eventEndDateTime,
    eventUntilDateTime,
    whoCanSeeOption,
    whoCanJoinOption,
    searchLocation,
    eventPosted,
  ]);


  useEffect(() => {
    if (isFocused) {
      getSports();
      if (route?.params?.locationName) {
        setLocationDetail({
              ...locationDetail,
              latitude:route.params.locationDetail.lat,
              longitude:route.params.locationDetail.lng,
            });
        setSearchLocation(route.params.locationName);
      }
    }
  }, [isFocused, route.params]);


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
        if (whoOption === 'see') {
          setWhoCanSeeOption(item);
        } else if(whoOption === 'join') {
          setWhoCanJoinOption(item);
        }else if(whoOption === 'invite'){
          setWhoCanInviteOption(item);
        }else{
          setEventPosted(item)
        }

        setTimeout(() => {
          setVisibleWhoModal(false);
          setModalPostedInvite(false);
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
        <Text style={styles.languageList}>
          {item.text}
        </Text>
        <View style={styles.checkbox}>
        {(whoOption === 'see' && whoCanSeeOption.value === item?.value) ||
          (whoOption === 'join' && whoCanJoinOption.value === item?.value) || 
          (whoOption === 'posted' && eventPosted.value === item?.value) || 
          (whoOption === 'invite' && whoCanInviteOption.value === item?.value) ? (
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
                console.log(e);
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
    if (eventTitle === '') {
      Alert.alert(strings.appName, strings.eventTitleValidation);
      return false;
    }
    if (sportsSelection === undefined) {
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
        Alert.alert(
          strings.appName, strings.enterValidAttendee,
        );
        return false;
      }
      if (Number(maxAttendees) === 0) {
        Alert.alert(
          strings.appName, strings.enterValidMaxAtendeeValidation,
        );
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
    locationDetail,
    maxAttendees,
    minAttendees,
    sportsSelection,
  ]);

  const createEventDone = (data, recurrringOption) => {
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole = entity.role === 'user' ? 'users' : 'groups';

    let rule
    if (selectWeekMonth === Verbs.eventRecurringEnum.Daily) {
      rule =  'FREQ=DAILY'
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.Weekly) {
      rule =  'FREQ=WEEKLY'
    }  else if (selectWeekMonth === Verbs.eventRecurringEnum.WeekOfMonth) {
      rule = `FREQ=MONTHLY;BYDAY=${getDayFromDate(eventStartDateTime)
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks(eventStartDateTime)}`;
    } else if ( selectWeekMonth === Verbs.eventRecurringEnum.DayOfMonth) {
        rule = `FREQ=MONTHLY;BYMONTHDAY=${eventStartDateTime.getDate()}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.WeekOfYear) {
      rule = `FREQ=YEARLY;BYDAY=${getDayFromDate(eventStartDateTime)
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks(eventStartDateTime)}`;
    } else if (selectWeekMonth === Verbs.eventRecurringEnum.DayOfYear) {
        rule = `FREQ=YEARLY;BYMONTHDAY=${eventStartDateTime.getDate()};BYMONTH=${eventStartDateTime.getMonth()}`;
    } 
    
    if(rule){
      data.untilDate = getTCDate(eventUntilDateTime);
      data.rrule = rule

      if(recurrringOption === '') {
        setRecurringEditModal(true);
        setloading(false);
        return true;
      }
      data.recurringOption = recurrringOption;
    }

    editEvent(entityRole, uid, data, authContext)
    .then((response) => {
      console.log('Response :-', response);
      setloading(false);
      navigation.goBack()
    })
    .catch((e) => {
      setloading(false);
      console.log('Error ::--', e);
      Alert.alert('', e.messages);
    });
    return true;
  };

  const onDonePress = (recurrringOption = '') => {
    if (checkValidation()) {
      setloading(true);
      const entity = authContext.entity;
      const entityRole = entity.role === 'user' ? 'users' : 'groups';
      const data = {
        ...eventData,
        title: eventTitle,
        descriptions: eventDescription,
        background_thumbnail: eventData.background_thumbnail,
        background_full_image: eventData.background_full_image,
        allDay: toggle,
        start_datetime: getTCDate(eventStartDateTime),
        end_datetime: getTCDate(eventEndDateTime),
        is_recurring: selectWeekMonth !== Verbs.eventRecurringEnum.Never,
        repeat: selectWeekMonth,
        blocked: is_Blocked,
        selected_sport: sportsSelection,
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
      };

      if (whoCanSeeOption.value === 2) {
        const checkedGroup = groupsSeeList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === Verbs.entityTypeUser) {
          data.who_can_see.group_ids = resultOfIds;
        } else {
          data.who_can_see.group_ids = [authContext.entity.uid];
        }
      }

      if (whoCanJoinOption.value === 2) {
        const checkedGroup = groupsJoinList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === Verbs.entityTypeUser) {
          data.who_can_join.group_ids = resultOfIds;
        } else {
          data.who_can_join.group_ids = [authContext.entity.uid];
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
            data.background_thumbnail = bgInfo.thumbnail;
            data.background_full_image = bgInfo.url;
            setBackgroundImageChanged(false);

            createEventDone(data , recurrringOption);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          });
      } else {
        createEventDone(data, recurrringOption);
      }
    }
  };



  const renderEditRecurringOptions = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <View>
        <Text style={styles.filterTitle} onPress={() => {
          setRecurringEditModal(false)
          setTimeout(() => {
            onDonePress(item.value)
          }, 1000);
        }}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  const onSelectAddress = (_location) => {
    setLocationDetail({...locationDetail, latitude: _location.latitude, longitude : _location.longitude});
    setSearchLocation(_location.formattedAddress)
  };



  return (
    <>
    <Modal
      isVisible={recurringEditModal}
      backdropColor="black"
      onBackdropPress={() => setRecurringEditModal(false)}
      onRequestClose={() => setRecurringEditModal(false)}
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
            height: Dimensions.get('window').height / 4,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
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
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 10,
                fontSize: 16,
                fontFamily: fonts.RRegular,
              }}>Update recurring event</Text>
          </View>
          <TCThinDivider width="92%" />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
            showsVerticalScrollIndicator={false}
            data={
              recurringEditList
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderEditRecurringOptions}
          />
        </View>
      </Modal>
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


            <EventItemRender 
            containerStyle={{position : 'relative', margin: 20}} 
            title={strings.place}
            >
              <EventVenueTogglebtn
                online={is_Online}
                firstTabTitle='Offline'
                secondTabTitle='Online'
                onFirstTabPress={() => setIsOnline(false)}
                onSecondTabPress={() => setIsOnline(true)}
              />
              {
              !is_Online ? (
              <>
              <TextInput
                placeholder={strings.venueNamePlaceholder}
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
                  setVisibleLocationModal(true)
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
              <TextInput
                placeholder={strings.venueDetailsPlaceholder}
                style={styles.detailsInputStyle}
                onChangeText={(value) => {
                  setLocationDetail({...locationDetail, venue_detail: value});
                }}
                value={locationDetail?.venue_detail}
                multiline={true}
                textAlignVertical={'center'}
                placeholderTextColor={colors.userPostTimeColor}
              />

              <AddressLocationModal
                visibleLocationModal={visibleLocationModal}
                setVisibleAddressModalhandler={() => setVisibleLocationModal(false)}
                onAddressSelect={onSelectAddress}
                handleSetLocationOptions={onSelectAddress}
                onDonePress={() => {}}
              />
              </>
            ): null}
            </EventItemRender>


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
                  {label: strings.daily, value: Verbs.eventRecurringEnum.Daily},
                  {label: strings.weeklyText, value: Verbs.eventRecurringEnum.Weekly},
                  {
                    label: format(
                      strings.monthlyOnText,
                      `${countNumberOfWeekFromDay(eventStartDateTime)} ${getDayFromDate(eventStartDateTime)}`,
                    ),
                    value: Verbs.eventRecurringEnum.WeekOfMonth
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
                      `${countNumberOfWeekFromDay(eventStartDateTime)} ${getDayFromDate(eventStartDateTime)}`,
                    ),
                    value: Verbs.eventRecurringEnum.WeekOfYear
                  },
                  {
                    label: format(
                      strings.yearlyOnDayText,
                      ordinal_suffix_of(eventStartDateTime.getDate()),
                    ),
                    value: Verbs.eventRecurringEnum.DayOfYear,
                  }
                ]}
                placeholder={strings.never}
                value={selectWeekMonth}
                onValueChange={(value) => { setSelectWeekMonth(value);}}
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

            <EventItemRender containerStyle={{marginTop: -20, marginBottom: 20}} title={''}>
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

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.eventFeeTitle}
              </Text>
              <View style={styles.feeContainer}>
                <TextInput
                  style={styles.eventFeeStyle}
                  onChangeText={(value) => setEventFee(value)}
                  value={`${eventFee}`}
                  textAlignVertical={'center'}
                  placeholderTextColor={colors.userPostTimeColor}
                />
                <Text style={styles.currencyStyle}>{strings.defaultCurrency}</Text>
              </View>
            </View>


            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.refundPolicyTitle}
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
              <Text style={[styles.subTitleText, {marginTop: 0}]}>
                Attendees must be refunded if the event is canceled or
                rescheduled. Read payment policy for more information.
              </Text>
            </View>


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
              <Text style={styles.headerTextStyle}>{strings.whoCanJoin}</Text>

              <TouchableOpacity
                onPress={() => {
                  setWhoOption('join');
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
            </View>
            {whoCanJoinOption.value === 2 &&
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
              <Text style={styles.headerTextStyle}>{strings.whereEventPosted}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption('posted');
                  setModalPostedInvite(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {eventPosted.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>



            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>WHO CAN INVITE</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption('invite');
                  setModalPostedInvite(true);
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
            </View>
            {whoCanInviteOption.value === 2 &&
              authContext.entity.role === Verbs.entityTypeUser && (
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


            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOption('see');
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
            </View>
            {whoCanSeeOption.value === 2 &&
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
              strings.privacySettingText
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
                ? whoOption === 'join'
                  ? whoCanJoinUser
                  : whoCanSeeUser
                : whoOption === 'join'
                ? whoCanJoinGroup
                : whoCanSeeGroup
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWhoCan}
          />
        </View>
      </Modal>


      <Modal
        isVisible={modalPostedInvite}
        backdropColor="black"
        onBackdropPress={() => setModalPostedInvite(false)}
        onRequestClose={() => setModalPostedInvite(false)}
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
              onPress={() => setModalPostedInvite(false)}>
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
              {strings.privacySettingText}
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
                ? whoOption === 'posted'
                  ? eventPostedList
                  : whoCanInviteUser
                : whoOption === 'posted'
                ? eventPostedList
                : whoCanInviteGroup
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
            deleteConfirmation(
              strings.appName,
              strings.deleteConfirmationText,
              () => deleteImage(),
            );
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
  availableSubHeader: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 5,
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
    marginBottom: 30
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
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
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
  // radioButtonStyle: {
  //   height: 22,
  //   width: 22,
  //   resizeMode: 'cover',
  //   alignSelf: 'center',
  // },
  // eventPostedTitle: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   marginLeft: 15,
  // },
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
  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: '#0093FF',
  },
});
