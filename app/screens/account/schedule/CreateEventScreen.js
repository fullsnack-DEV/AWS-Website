/* eslint-disable no-dupe-else-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, {useEffect, useState, useContext} from 'react';
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
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';

import AuthContext from '../../../auth/context';
import Header from '../../../components/Home/Header';
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
import {getHitSlop, getSportName} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';
import {getUserSettings} from '../../../api/Users';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';

const getNearDateTime = (date) => {
  const start = moment(date);
  const nearTime = 5 - (start.minute() % 5);
  const dateTime = moment(start).add(nearTime, 'm').toDate();
  console.log('Start date/Time::=>', dateTime);
  return dateTime;
};
export default function CreateEventScreen({navigation, route}) {
  const eventPostedList = ['Schedule only', 'Schedule & posts'];

  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPosted, setEventPosted] = useState(0);

  const [toggle, setToggle] = useState(true);
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
  const [sportsSelection, setSportsSelection] = useState();
  const [sportsData, setSportsData] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [isAll, setIsAll] = useState(false);

  const [whoCanSee, setWhoCanSee] = useState('Only me');
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');

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
      toggle
        ? new Date(date).setHours(0, 0, 0, 0)
        : new Date(new Date(date).getTime()),
    );
    setEventEnddateTime(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : moment(date).add(5, 'm').toDate(),
    );
    setEventUntildateTime(
      toggle
        ? new Date(date).setHours(23, 59, 59, 0)
        : moment(date).add(5, 'm').toDate(),
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
      setEventEnddateTime(dateValue);
      setEventUntildateTime(moment(dateValue).add(5, 'm').toDate());
    } else {
      setEventEnddateTime(date);
      setEventUntildateTime(moment(date).add(5, 'm').toDate());
    }
    setEndDateVisible(!endDateVisible);
  };

  const handleUntilDatePress = (date) => {
    setEventUntildateTime(date);
    setUntilDateVisible(!untilDateVisible);
  };

  useEffect(() => {
    if (isFocused) {
      getSports();
      if (route.params && route.params.locationName) {
        setSearchLocation(route.params.locationName);
        setLocationDetail(route.params.locationDetail);
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

        // const groups = [...teams, ...clubs].map((obj) => ({
        //   ...obj,
        //   isSelected: false,
        // }));

        getUserSettings(authContext).then((setting) => {
          setloading(false);
          console.log('Settings:=>', setting);
          if (setting?.payload?.user?.schedule_group) {
            const groups = [...teams, ...clubs].map((obj) =>
              setting?.payload?.user?.schedule_group.includes(obj.group_id)
                ? {
                    ...obj,
                    isSelected: true,
                  }
                : {
                    ...obj,
                    isSelected: false,
                  },
            );
            setGroupsList([...groups]);
          } else {
            const groups = [...teams, ...clubs].map((obj) => ({
              ...obj,
              isSelected: false,
            }));
            setGroupsList([...groups]);
          }
          // await Utility.setStorage('appSetting', response.payload.app);
        });
      })
      .catch((e) => {
        setloading(false);
        Alert.alert('', e.messages);
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
        setSportsSelection(item);
        setTimeout(() => {
          setVisibleSportsModal(false);
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
          {getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportsSelection?.sport === item?.sport ? (
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

  const renderEventPostedOpetions = ({index, item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 15,

          marginRight: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            setEventPosted(index);
          }}>
          <Image
            source={
              eventPosted === index
                ? images.checkRoundOrange
                : images.radioUnselect
            }
            style={styles.radioButtonStyle}
          />
        </TouchableOpacity>
        <Text style={styles.eventPostedTitle}>{item}</Text>
      </View>
    );
  };

  const renderGroups = ({item, index}) => {
    return (
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
          groupsList[index].isSelected = !groupsList[index].isSelected;
          setGroupsList([...groupsList]);
          setIsAll(false);
        }}
      />
    );
  };

  return (
    <>
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Create an Event</Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{padding: 2}}
            onPress={async () => {
              const entity = authContext.entity;
              const uid = entity.uid || entity.auth.user_id;
              const entityRole = entity.role === 'user' ? 'users' : 'groups';

              if (eventTitle === '') {
                Alert.alert(strings.appName, 'Please Enter Event Title.');
              } else if (eventDescription === '') {
                Alert.alert(strings.appName, 'Please Enter Event Description.');
              } else if (eventStartDateTime === '') {
                Alert.alert(
                  strings.appName,
                  'Please Select Event Start Date and Time.',
                );
              } else if (eventEndDateTime === '') {
                Alert.alert(
                  strings.appName,
                  'Please Select Event End Date and Time.',
                );
              } else if (eventEndDateTime === '') {
                Alert.alert(
                  strings.appName,
                  'Please Select Event End Date and Time.',
                );
              } else {
                let data;

                if (searchLocation) {
                  data = [
                    {
                      title: eventTitle,
                      descriptions: eventDescription,
                      allDay: toggle,
                      start_datetime: Number(
                        parseFloat(
                          new Date(eventStartDateTime).getTime() / 1000,
                        ).toFixed(0),
                      ),
                      end_datetime: Number(
                        parseFloat(
                          new Date(eventEndDateTime).getTime() / 1000,
                        ).toFixed(0),
                      ),
                      is_recurring: selectWeekMonth !== '',
                      location: searchLocation,
                      latitude: locationDetail.lat,
                      longitude: locationDetail.lng,
                      blocked: is_Blocked,
                      participants: [
                        {
                          entity_id:
                            authContext.entity.obj.user_id ||
                            authContext.entity.obj.group_id,
                          entity_type: entityRole,
                        },
                      ],
                    },
                  ];
                } else {
                  data = [
                    {
                      title: eventTitle,
                      descriptions: eventDescription,
                      allDay: toggle,
                      start_datetime: Number(
                        parseFloat(
                          new Date(
                            convertDateToUTC(eventStartDateTime),
                          ).getTime() / 1000,
                        ).toFixed(0),
                      ),
                      end_datetime: Number(
                        parseFloat(
                          new Date(
                            convertDateToUTC(eventEndDateTime),
                          ).getTime() / 1000,
                        ).toFixed(0),
                      ),
                      is_recurring: selectWeekMonth !== '',
                      blocked: is_Blocked,
                      participants: [
                        {
                          entity_id:
                            authContext.entity.obj.user_id ||
                            authContext.entity.obj.group_id,
                          entity_type: entityRole,
                        },
                      ],
                    },
                  ];
                }

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
                if (selectWeekMonth !== '') {
                  data[0].untilDate = Number(
                    parseFloat(
                      new Date(eventUntilDateTime).getTime() / 1000,
                    ).toFixed(0),
                  );
                  data[0].rrule = `FREQ=${rule}`;
                }
                setloading(true);
                createEvent(entityRole, uid, data, authContext)
                  .then((response) => {
                    console.log('Response :-', response);
                    setTimeout(() => {
                      setloading(false);
                      navigation.goBack();
                    }, 5000);
                  })
                  .catch((e) => {
                    setloading(false);
                    console.log('Error ::--', e);
                    Alert.alert('', e.messages);
                  });
              }
            }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.sperateLine} />
      <TCKeyboardView>
        <ScrollView bounces={false}>
          <SafeAreaView>
            <EventBackgroundPhoto isEdit={false} imageURL={''} />
            <EventTextInputItem
              title={strings.title}
              placeholder={strings.titlePlaceholder}
              onChangeText={(text) => {
                setEventTitle(text);
              }}
              value={eventTitle}
            />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.sportCreateEvent}{' '}
                <Text style={styles.opetionalTextStyle}>{'opetional'}</Text>
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
              placeholder={strings.aboutPlaceholder}
              onChangeText={(text) => {
                setEventDescription(text);
              }}
              // multiline={true}
              value={eventDescription}
            />

            <EventItemRender title={strings.timeTitle}>
              <View style={styles.toggleViewStyle}>
                <Text style={styles.allDayText}>{strings.allDay}</Text>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setToggle(!toggle)}>
                  <Image
                    source={
                      toggle ? images.orangeCheckBox : images.uncheckWhite
                    }
                    style={styles.checkboxImg}
                  />
                </TouchableOpacity>
              </View>
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
                placeholder={'Does not repeat'}
                value={selectWeekMonth}
                onValueChange={(value) => {
                  setSelectWeekMonth(value);
                }}
              />
              {selectWeekMonth !== '' && (
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

            <EventItemRender title={strings.place}>
              <TextInput
                placeholder={'Venue name'}
                style={styles.textInputStyle}
                onChangeText={() => {
                  console.log('aa');
                }}
                // value={value}
                // multiline={multiline}
                textAlignVertical={'center'}
                placeholderTextColor={colors.userPostTimeColor}
              />

              <TCTouchableLabel
                placeholder={strings.searchHereText}
                title={searchLocation}
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
                onChangeText={() => {
                  console.log('aa');
                }}
                // value={value}
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
              <RNPickerSelect
                items={[
                  {label: 'Only me', value: 'Only me'},
                  {label: 'Everyone', value: 'Everyone'},
                  {
                    label: 'Members in my groups',
                    value: 'Members in my groups',
                  },
                  {
                    label: 'Followers',
                    value: 'Followers',
                  },
                ]}
                onValueChange={(value) => {
                  setWhoCanSee(value);
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  iconContainer: {
                    top: 0,
                    right: 0,
                  },
                  inputIOS: {
                    height: 40,
                    fontSize: wp('3.5%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('92%'),
                    color: 'black',
                    paddingRight: 30,
                    backgroundColor: colors.textFieldBackground,
                    borderRadius: 5,
                    textAlign: 'center',
                  },
                  inputAndroid: {
                    height: 40,
                    fontSize: wp('4%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('45%'),
                    color: 'black',

                    backgroundColor: colors.offwhite,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#fff',

                    elevation: 3,
                  },
                }}
                value={whoCanSee}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                )}
              />
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
              <NumberOfAttendees />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.eventFeeTitle}
              </Text>
              <View style={styles.feeContainer}>
                <TextInput
                  style={styles.eventFeeStyle}
                  // onChangeText={onChangeText}
                  value={'100'}
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
              <TextInput
                placeholder={'Refund Policy'}
                style={styles.detailsInputStyle}
                onChangeText={() => {
                  console.log('aa');
                }}
                // value={value}
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
                {strings.whereEventPosted}
              </Text>
              <FlatList
                data={eventPostedList}
                renderItem={renderEventPostedOpetions}
                style={{marginTop: 15}}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <RNPickerSelect
                items={[
                  {label: 'Only me', value: 'Only me'},
                  {label: 'Everyone', value: 'Everyone'},
                  {
                    label: 'Members in my groups',
                    value: 'Members in my groups',
                  },
                  {
                    label: 'Followers',
                    value: 'Followers',
                  },
                ]}
                onValueChange={(value) => {
                  setWhoCanSee(value);
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  iconContainer: {
                    top: 0,
                    right: 0,
                  },
                  inputIOS: {
                    height: 40,
                    fontSize: wp('3.5%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('92%'),
                    color: 'black',
                    paddingRight: 30,
                    backgroundColor: colors.textFieldBackground,
                    borderRadius: 5,
                    textAlign: 'center',
                  },
                  inputAndroid: {
                    height: 40,
                    fontSize: wp('4%'),
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    width: wp('45%'),
                    color: 'black',

                    backgroundColor: colors.offwhite,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#fff',

                    elevation: 3,
                  },
                }}
                value={whoCanSee}
                Icon={() => (
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                )}
              />
            </View>
            <View>
              <View style={styles.allStyle}>
                <Text style={styles.titleTextStyle}>{strings.all}</Text>
                <TouchableOpacity
                onPress={() => {
                  setIsAll(!isAll);
                  const groups = groupsList.map((obj) => ({
                    ...obj,
                    isSelected: !isAll,
                  }));
                  setGroupsList([...groups]);
                }}>
                  <Image
                  source={isAll ? images.orangeCheckBox : images.uncheckWhite}
                  style={styles.imageStyle}
                />
                </TouchableOpacity>
              </View>
              <FlatList
            scrollEnabled={false}
              data={[...groupsList]}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{height: wp('4%')}} />}
              renderItem={renderGroups}
              keyExtractor={(item, index) => index.toString()}
              style={styles.listStyle}
            />
            </View>

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
        backdropOpacity={0}
        style={{
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
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
                color: colors.themeColor,
              }}></Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  toggleViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 2,
    justifyContent: 'flex-end',
    paddingVertical: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    right: wp('8%'),
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
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
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
    top: 12,
    width: 15,
    right: 15,
  },
  eventFeeStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    height: 40,
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
    marginTop:0,
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
    paddingBottom:10
  },
});
