/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import { parseInt } from 'lodash';
import Header from '../../../components/Home/Header';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventMapView from '../../../components/Schedule/EventMapView';
import strings from '../../../Constants/String';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import EventSearchLocation from '../../../components/Schedule/EventSearchLocation';
import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { editEvent, getEvents } from '../../../api/Schedule';
import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import * as Utility from '../../../utils/index';
import TCKeyboardView from '../../../components/TCKeyboardView';

export default function EditEventScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  let event_Title = 'Game';
  let aboutDescription = 'Game With';
  let aboutDescription2 = '';
  let fromDate = '';
  let toDate = '';
  let untildate = '';

  let location = '';
  let venue = '';
  let rule = 'Does not repeat';
  let latValue = null;
  let longValue = null;
  let latLongLocation = {};
  let blockValue = false;

  if (route && route.params && route.params.data) {
    if (route.params.data.title) {
      event_Title = route.params.data.title;
    }
    console.log('DATA:::=>', route.params.data);
    if (route.params.data.rrule) {
      const a = route.params.data.rrule;
      console.log('RULESa:=>', a);
      const arr = a.split(';');
      console.log('RULESarr:=>', arr);
      const str = arr[0].substring(5).toLowerCase();
      console.log('RULESstr:=>', str);
      rule = str.charAt(0).toUpperCase() + str.slice(1);
      console.log('RULES:=>', rule);
    }
    if (route.params.data.descriptions) {
      aboutDescription = route.params.data.descriptions;
    }

    if (route.params.data.start_datetime) {
      fromDate = new Date(route.params.data.start_datetime * 1000);
    }
    if (route.params.data.end_datetime) {
      toDate = new Date(route.params.data.end_datetime * 1000);
    }
    if (route.params.data.untilDate) {
      untildate = new Date(route.params.data.untilDate * 1000);
    }

    if (route.params.data.location) {
      location = route.params.data.location;
    }
    if (route.params.data.latitude) {
      latValue = route.params.data.latitude;
      latLongLocation = {
        lat: route.params.data.latitude,
        lng: route.params.data.longitude,
      };
    }
    if (route.params.data.longitude) {
      longValue = route.params.data.longitude;
    }
    if (route.params.data.isBlocked) {
      blockValue = route.params.data.isBlocked;
    }
  }
  if (route && route.params && route.params.gameData) {
    if (route.params.gameData.game && route.params.gameData.game.away_team) {
      aboutDescription2 = route.params.gameData.game.away_team.group_name;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      venue = route.params.gameData.game.venue.address;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      latLongLocation = {
        lat: route.params.gameData.game.venue.lat,
        lng: route.params.gameData.game.venue.long,
      };
    }
  }
  const getNearDateTime = (date) => {
    const start = moment(date);
    const nearTime = 5 - (start.minute() % 5);
    const dateTime = moment(start).add(nearTime, 'm').toDate();
    return dateTime;
  };
  const isFocused = useIsFocused();
  const [eventTitle, setEventTitle] = useState(event_Title);
  const [aboutDesc, setAboutDesc] = useState(
    `${aboutDescription} ${aboutDescription2}`,
  );
  const [singleSelectEventColor, setSingleSelectEventColor] = useState(route.params.data.color ?? '');
  const [toggle, setToggle] = useState(route.params.data.allDay);
  const [eventStartDateTime, setEventStartdateTime] = useState(
    fromDate || getNearDateTime(new Date()),
  );
  const [eventEndDateTime, setEventEnddateTime] = useState(
    toDate || moment(eventStartDateTime).add(5, 'm').toDate(),
  );
  const [eventUntilDateTime, setEventUntildateTime] = useState(
    untildate || eventEndDateTime,
  );
  const [searchLocation, setSearchLocation] = useState(location || venue);
  const [locationDetail, setLocationDetail] = useState(latLongLocation);
  const [is_Blocked, setIsBlocked] = useState(blockValue);
  const [loading, setloading] = useState(false);
  const [addColorDoneButton, setAddColorDoneButton] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [eventColors, setEventColors] = useState();
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState(rule);

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

  useEffect(() => {
    if (route.params && route.params.locationName !== undefined) {
      setSearchLocation(route.params.locationName);
      setLocationDetail(route.params.locationDetail);
    }
  }, [isFocused]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const colorToggleModal = () => {
    setIsColorPickerModal(!isColorPickerModal);
  };
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
  const handleStateDatePress = (date) => {
    setEventStartdateTime(date);
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

      setEventEnddateTime(dateValue);
      setEventUntildateTime(dateValue);
    } else {
      setEventEnddateTime(date);
      setEventUntildateTime(date);
    }
    setEndDateVisible(!endDateVisible);
  };
  const handleUntilDatePress = (date) => {
    setEventUntildateTime(date);
    setUntilDateVisible(!untilDateVisible);
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
          imageStyle={{
            tintColor:
              item.color !== '0' ? colors.whiteColor : colors.lightBlackColor,
          }}
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
          source={
            item.isNew && item.color === '0'
              ? images.plus
              : item.isSelected
              ? images.check
              : null
          }
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

  console.log('Event End Date Time :-', moment(eventEndDateTime));

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Edit an Event</Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{ padding: 2 }}
            onPress={async () => {
               setloading(true);
              const entity = authContext.entity;
              console.log('Auth:=>', entity);
              const u_id = entity.uid;
              const entityRole = entity.role === 'user' || entity.role === 'player'
                  ? 'users'
                  : 'groups';
              const params = {
                ...route?.params?.data,
                title: eventTitle,
                descriptions: aboutDesc,
                color: singleSelectEventColor,
                start_datetime: parseInt(
                  new Date(eventStartDateTime).getTime() / 1000,
                ),
                end_datetime: parseInt(
                  new Date(eventEndDateTime).getTime() / 1000,
                ),
                location: searchLocation,
                latitude: locationDetail.lat,
                longitude: locationDetail.lng,
                isBlocked: is_Blocked,
                is_recurring: selectWeekMonth !== '',
                allDay: toggle,
              };
              let rules = '';
              if (
                selectWeekMonth === 'Daily'
                || selectWeekMonth === 'Weekly'
                || selectWeekMonth === 'Monthly'
                || selectWeekMonth === 'Yearly'
              ) {
                rules = selectWeekMonth.toUpperCase();
              } else if (
                selectWeekMonth
                === `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`
              ) {
                rules = `MONTHLY;BYDAY=${getTodayDay()
                  .substring(0, 2)
                  .toUpperCase()};BYSETPOS=${countNumberOfWeeks()}`;
              } else if (
                selectWeekMonth
                === `Monthly on ${ordinal_suffix_of(new Date().getDate())}`
              ) {
                rules = `MONTHLY;BYMONTHDAY=${new Date().getDate()}`;
              }
              if (selectWeekMonth !== '') {
                params.untilDate = parseInt(
                  new Date(eventUntilDateTime).getTime() / 1000,
                ).toFixed(0);
                if (rules !== '') {
                  params.rrule = `FREQ=${rules}`;
                }
              }

              console.log('Edit Event object:=>', params);

              editEvent(entityRole, u_id, params, authContext)
                .then((response) => {
                  console.log('Edit Response :-', response);
                  getEvents(entityRole, u_id, authContext);
                })
                .then((response) => {
                  setloading(false);
                  navigation.goBack();
                  console.log('Get Response :-', response);
                })
                .catch((e) => {
                  setloading(false);
                  console.log('Error ::--', e);
                  Alert.alert('', e.messages);
                });
            }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <TCKeyboardView>
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
            setAboutDesc(text);
          }}
          multiline={true}
          value={aboutDesc}
        />

        {/* <EventItemRender
            title={strings.eventColorTitle}
          >
          <FlatList
            data={[...eventColors, '0']}
            numColumns={5}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
            renderItem={ ({ item, index }) => {
              if (index === eventColors.length) {
                return (
                  <EventColorItem
                    onItemPress={() => {
                      setAddColorDoneButton(false);
                      colorToggleModal();
                      setSelectedEventColors([])
                    }}
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                  source={item.isSelected ? images.check : null}
                  imageStyle={{ tintColor: colors.whiteColor }}
                  onItemPress={() => {
                    eventColors.map((createEventItem) => {
                      const createEventData = createEventItem;
                      if (createEventData.id === item.id) {
                        createEventData.isSelected = true;
                        setSingleSelectEventColor(createEventData.color);
                      } else {
                        createEventData.isSelected = false;
                      }
                      return null;
                    })
                    Utility.setStorage('eventColor', eventColors);
                    setEventColors([...eventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color,
                    borderWidth: item.isSelected ? 2 : 0,
                    borderColor: colors.whiteColor,
                    marginRight: wp(3),
                  }}
                />
              );
            }}
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender> */}

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
              { label: 'Monthly', value: 'Monthly' },
              {
                label: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
                value: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
              },
              {
                label: `Monthly on ${new Date().getDate()}`,
                value: `Monthly on ${new Date().getDate()}`,
              },
              { label: 'Yearly', value: 'Yearly' },
            ]}
            // placeholder={strings.selectTimePlaceholder}
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
          <EventSearchLocation
            onLocationPress={() => {
              toggleModal();
              navigation.navigate('SearchLocationScreen', {
                comeFrom: 'EditEventScreen',
              });
            }}
            locationText={searchLocation}
          />
          <EventMapView
            region={{
              latitude: locationDetail
                ? Number(locationDetail.lat)
                : Number(latValue),
              longitude: locationDetail
                ? Number(locationDetail.lng)
                : Number(longValue),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: locationDetail
                ? Number(locationDetail.lat)
                : Number(latValue),
              longitude: locationDetail
                ? Number(locationDetail.lng)
                : Number(longValue),
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
        <DefaultColorModal
          isModalVisible={isColorPickerModal}
          onBackdropPress={() => setIsColorPickerModal(false)}
          cancelImageSource={images.cancelImage}
          containerStyle={{ height: hp('55%') }}
          onCancelImagePress={() => setIsColorPickerModal(false)}
          headerCenterText={'Add color'}
          onColorSelected={(selectColor) => {
            // setAddColorDoneButton(true);
            // const data = [...selectedEventColors];
            // const obj = {
            //   id: eventColors.length + data.length,
            //   color: selectColor,
            //   isSelected: false,
            // };
            // if (selectedEventColors.length === 0) {
            //   setcounter(counter + 1);
            //   data.push(obj);
            //   setSelectedEventColors(data);
            // } else {
            //   const filterColor = selectedEventColors.filter((select_color_item) => selectColor === select_color_item.color);
            //   if (filterColor.length === 0) {
            //     setcounter(counter + 1);
            //     data.push(obj);
            //     setSelectedEventColors(data);
            //   }
            // }
            setAddColorDoneButton(true);
            setSelectedEventColors(selectColor);
          }}
          doneButtonDisplay={addColorDoneButton}
          onDonePress={() => {
            // const createdEventAddData = [...eventColors, ...selectedEventColors];
            // Utility.setStorage('eventColor', createdEventAddData);
            // setEventColors(createdEventAddData);
            // setIsColorPickerModal(false);
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
          // flatListData={[...selectedEventColors, '0']}
          // renderItem={({ item, index }) => {
          //   if (index === selectedEventColors.length) {
          //     return (
          //       <EventColorItem
          //         source={images.plus}
          //       />
          //     );
          //   }
          //   return (
          //     <EventColorItem
          //     source={item.isSelected ? images.check : null}
          //     imageStyle={{ tintColor: colors.whiteColor }}
          //     eventColorViewStyle={{
          //       backgroundColor: item.color,
          //       borderWidth: item.isSelected ? 2 : 0,
          //       borderColor: colors.whiteColor,
          //       marginRight: wp(3),
          //     }}
          //     />
          //   );
          // }}
        />
        <DateTimePickerView
          visible={startDateVisible}
          onDone={handleStateDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          date={eventStartDateTime}
          minimumDate={new Date()}
          minutesGap={5}
          mode={toggle ? 'date' : 'datetime'}
        />
        <DateTimePickerView
          visible={endDateVisible}
          onDone={handleEndDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          date={eventEndDateTime}
          minimumDate={eventEndDateTime || new Date()}
          minutesGap={5}
          mode={toggle ? 'date' : 'datetime'}
        />
        <DateTimePickerView
          visible={untilDateVisible}
          onDone={handleUntilDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          minimumDate={eventEndDateTime || new Date()}
          minutesGap={5}
          mode={toggle ? 'date' : 'datetime'}
        />
      </TCKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
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
