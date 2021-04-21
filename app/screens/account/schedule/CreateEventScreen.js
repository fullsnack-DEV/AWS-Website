/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
 Dimensions,
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import AuthContext from '../../../auth/context';
import Header from '../../../components/Home/Header';
import EventColorItem from '../../../components/Schedule/EventColorItem';
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
import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';
import { createEvent, getEvents } from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { getLocationNameWithLatLong } from '../../../api/External';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import * as Utility from '../../../utils/index';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';

const getNearDateTime = (date) => {
  const start = moment(date);
  const nearTime = 5 - (start.minute() % 5);
  const dateTime = moment(start).add(nearTime, 'm').toDate();
  console.log('Start date/Time::=>', dateTime);
  return dateTime;
};
export default function CreateEventScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [singleSelectEventColor, setSingleSelectEventColor] = useState();
  const [toggle, setToggle] = useState(true);
  const [eventStartDateTime, setEventStartdateTime] = useState(
    getNearDateTime(new Date()),
  );
  const [eventEndDateTime, setEventEnddateTime] = useState(
    moment(eventStartDateTime).add(5, 'm').toDate(),
  );
  const [eventUntilDateTime, setEventUntildateTime] = useState(
    eventEndDateTime,
  );
  const [searchLocation, setSearchLocation] = useState();
  const [locationDetail, setLocationDetail] = useState(null);
  const [is_Blocked, setIsBlocked] = useState(false);
  const [loading, setloading] = useState(false);
  const [addColorDoneButton, setAddColorDoneButton] = useState(false);

  const [eventColors, setEventColors] = useState();
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
    const eventColorData = await Utility.getStorage('eventColors');

      if (eventColorData) {
        setEventColors(eventColorData);
      } else {
        setEventColors([
          ...Utility.createdEventData,
          {
            id: 10,
            color: '0',
            isSelected: false,
            isNew: true,
          },
        ]);
      }
      // setEventColors(eventColorData);
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);
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
    setEventStartdateTime(new Date(new Date(date).getTime()));
    setEventEnddateTime(moment(date).add(5, 'm').toDate());
    setEventUntildateTime(moment(date).add(5, 'm').toDate());
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

  const colorToggleModal = () => {
    setIsColorPickerModal(!isColorPickerModal);
  };

  useEffect(() => {
    if (route.params && route.params.locationName) {
      setSearchLocation(route.params.locationName);
      setLocationDetail(route.params.locationDetail);
    }
  }, [isFocused]);

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

  const onChangeColorPressed = () => {
    setAddColorDoneButton(false);
    colorToggleModal();
    setSelectedEventColors([]);
  };

  const renderColorItem = ({ item }) => {
    if (item.isNew) {
      return (
        <EventColorItem
          isNew={item.color !== '0'}
          onChangeColorPressed={onChangeColorPressed}
          imageStyle={{ tintColor: item.color !== '0' ? colors.whiteColor : colors.lightBlackColor }}
          onItemPress={() => {
            if (item.color === '0') {
              setAddColorDoneButton(false);
              colorToggleModal();
              setSelectedEventColors([]);
            } else {
              eventColors.map(async (createEventItem) => {
                const createEventData = createEventItem;
                if (createEventData.id === item.id) {
                  createEventData.isSelected = true;
                  setSingleSelectEventColor(createEventData.color);
                } else {
                  createEventData.isSelected = false;
                }
                return null;
              });

              setEventColors([...eventColors]);
            }
          }}
          source={item.isNew && item.color === '0' ? images.plus : item.isSelected ? images.check : null}
          eventColorViewStyle={{
            backgroundColor:
              item.color === '0' ? colors.whiteColor : item.color,
            borderWidth: item.isSelected ? 2 : 0,
            borderColor: colors.whiteColor,
            marginRight: wp(3),
          }}
        />
      );
    }
    return (
      <EventColorItem
        source={item.isSelected ? images.check : null}
        imageStyle={{ tintColor: colors.whiteColor }}
        onItemPress={() => {
          eventColors.map(async (createEventItem) => {
            const createEventData = createEventItem;
            if (createEventData.id === item.id) {
              createEventData.isSelected = true;
              setSingleSelectEventColor(createEventData.color);
            } else {
              createEventData.isSelected = false;
            }
            return null;
          });

          setEventColors([...eventColors]);
        }}
        eventColorViewStyle={{
          backgroundColor: item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    );
  };

  return (
    <TCKeyboardView>
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
            style={{ padding: 2 }}
            onPress={async () => {
              const entity = authContext.entity;
              const uid = entity.uid || entity.auth.user_id;
              const entityRole = entity.role === 'user' ? 'users' : 'groups';

              if (eventTitle === '') {
                Alert.alert('Towns Cup', 'Please Enter Event Title.');
              } else if (eventDescription === '') {
                Alert.alert('Towns Cup', 'Please Enter Event Description.');
              } else if (eventStartDateTime === '') {
                Alert.alert(
                  'Towns Cup',
                  'Please Select Event Start Date and Time.',
                );
              } else if (eventEndDateTime === '') {
                Alert.alert(
                  'Towns Cup',
                  'Please Select Event End Date and Time.',
                );
              } else if (eventEndDateTime === '') {
                Alert.alert(
                  'Towns Cup',
                  'Please Select Event End Date and Time.',
                );
              } else {
                setloading(true);
                let data;
                if (searchLocation) {
                  data = [
                    {
                      title: eventTitle,
                      descriptions: eventDescription,
                      color: singleSelectEventColor,
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
                      owner_id:
                        authContext.entity.obj.user_id
                        || authContext.entity.obj.group_id,
                    },
                  ];
                } else {
                  data = [
                    {
                      title: eventTitle,
                      descriptions: eventDescription,
                      color: singleSelectEventColor,
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
                      blocked: is_Blocked,
                      owner_id:
                        authContext.entity.obj.user_id
                        || authContext.entity.obj.group_id,
                    },
                  ];
                }

                let rule = '';
                if (
                  selectWeekMonth === 'Daily'
                  || selectWeekMonth === 'Weekly'
                  || selectWeekMonth === 'Yearly'
                ) {
                  rule = selectWeekMonth.toUpperCase();
                } else if (
                  selectWeekMonth
                  === `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`
                ) {
                  rule = `MONTHLY;BYDAY=${getTodayDay()
                    .substring(0, 2)
                    .toUpperCase()};BYSETPOS=${countNumberOfWeeks()}`;
                } else if (
                  selectWeekMonth
                  === `Monthly on ${ordinal_suffix_of(new Date().getDate())} day`
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
                console.log('Response :-', data);
                createEvent(entityRole, uid, data, authContext)
                  .then(() => getEvents(entityRole, uid, authContext))
                  .then((response) => {
                    setloading(false);
                    navigation.goBack();
                    console.log('Response :-', response);
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
      <ScrollView bounces={false}>
        <SafeAreaView>
          <EventTextInputItem
            title={strings.title}
            placeholder={strings.titlePlaceholder}
            onChangeText={(text) => {
              setEventTitle(text);
            }}
            value={eventTitle}
          />
          <EventTextInputItem
            title={strings.about}
            placeholder={strings.aboutPlaceholder}
            onChangeText={(text) => {
              setEventDescription(text);
            }}
            multiline={true}
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
                    toggle ? images.checkWhiteLanguage : images.uncheckWhite
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
              containerStyle={{ marginBottom: 8 }}
              onDatePress={() => setEndDateVisible(!endDateVisible)}
            />
            <EventMonthlySelection
              title={strings.repeat}
              dataSource={[

                { label: 'Daily', value: 'Daily' },
                { label: 'Weekly', value: 'Weekly' },
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
                { label: 'Yearly', value: 'Yearly' },
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
                containerStyle={{ marginBottom: 12 }}
                onDatePress={() => setUntilDateVisible(!untilDateVisible)}
              />
            )}
          </EventItemRender>

          <EventItemRender title={strings.place}>
            <TCTouchableLabel
              placeholder={strings.searchHereText}
              title={searchLocation}
              showNextArrow={true}
              onPress={() => {
                navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'CreateEventScreen',
                });
                navigation.setParams({ comeName: null });
              }}
              style={{ width: '98%', alignSelf: 'center' }}
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
          </EventItemRender>

          <EventItemRender
            title={strings.availableTitle}
            containerStyle={{ marginTop: 10 }}>
            <Text style={styles.availableSubHeader}>
              {strings.availableSubTitle}
            </Text>
            <BlockAvailableTabView
              blocked={is_Blocked}
              firstTabTitle={'Block'}
              secondTabTitle={'Set available'}
              onFirstTabPress={() => setIsBlocked(true)}
              onSecondTabPress={() => setIsBlocked(false)}
            />
          </EventItemRender>
          <EventItemRender title={strings.eventColorTitle}>
            <FlatList
              numColumns={Dimensions.get('window').width > 360 ? 9 : 8}
              scrollEnabled={false}
              data={eventColors}
              ItemSeparatorComponent={() => <View style={{ width: wp('1%') }} />}
              renderItem={renderColorItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </EventItemRender>
          <DateTimePickerView
            date={eventStartDateTime}
            visible={startDateVisible}
            onDone={handleStartDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={getNearDateTime(new Date())}
            minutesGap={5}
            mode={toggle ? 'date' : 'datetime'}
          />
          <DateTimePickerView
            date={eventEndDateTime}
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
            date={eventUntilDateTime}
            visible={untilDateVisible}
            onDone={handleUntilDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={
             moment(eventEndDateTime).add(5, 'm').toDate()
            }
            minutesGap={5}
            mode={toggle ? 'date' : 'datetime'}
          />
          <DefaultColorModal
            isModalVisible={isColorPickerModal}
            onBackdropPress={() => setIsColorPickerModal(false)}
            cancelImageSource={images.cancelImage}
            containerStyle={{ height: hp('55%') }}
            onCancelImagePress={() => setIsColorPickerModal(false)}
            headerCenterText={'Add color'}
            onColorSelected={(selectColor) => {
              setAddColorDoneButton(true)
              setSelectedEventColors(selectColor)
            }}
            doneButtonDisplay={addColorDoneButton}
            onDonePress={() => {
              eventColors[10] = {
                id: 10,
                color: selectedEventColors,
                isSelected: false,
                isNew: true,
              };
              setEventColors([...eventColors]);
              setEventColors([...eventColors]);
              setIsColorPickerModal(false);
            }}

          />
        </SafeAreaView>
      </ScrollView>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
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
});
