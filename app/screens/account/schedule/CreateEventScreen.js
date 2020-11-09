import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../components/Home/Header';
import * as Utility from '../../../utils/index';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import EventMapView from '../../../components/Schedule/EventMapView';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import EventSearchLocation from '../../../components/Schedule/EventSearchLocation';
import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import RadioBtnItem from '../../../components/Schedule/RadioBtnItem';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';
import { createEvent, getEvents } from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';

const eventColorsData = [
  {
    id: 0,
    color: colors.themeColor,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.greeColor,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.eventBlueColor,
    isSelected: false,
  },
];

const challengeAvailability = [
  {
    id: 0,
    isSelected: true,
    title: strings.setAvailable,
  },
  {
    id: 1,
    isSelected: false,
    title: strings.block,
  },
];

const updateRecurringEvent = [
  {
    id: 0,
    isSelected: true,
    title: strings.thisEvent,
  },
  {
    id: 1,
    isSelected: false,
    title: strings.thisAndFollowingEvent,
  },
];

export default function CreateEventScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const [eventTitle, setEventTitle] = useState(strings.createTitleValue);
  const [eventDescription, setEventDescription] = useState(strings.createAboutValue);
  const [singleSelectEventColor, setSingleSelectEventColor] = useState(colors.orangeColor);
  const [toggle, setToggle] = useState(false);
  const [eventStartDateTime, setEventStartdateTime] = useState('');
  const [eventEndDateTime, setEventEnddateTime] = useState('');
  const [eventUntilDateTime, setEventUntildateTime] = useState('');
  const [searchLocation, setSearchLocation] = useState(strings.searchHereText);
  const [locationDetail, setLocationDetail] = useState(null);
  const [is_Blocked, setIsBlocked] = useState(false);
  const [is_Recurring, setIsRecurring] = useState(false);
  const [loading, setloading] = useState(false);

  const [eventColors, setEventColors] = useState(eventColorsData);
  const [challengeAvailable, setChallengeAvailable] = useState(challengeAvailability);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
  const [updateEvent, setUpdateEvent] = useState(updateRecurringEvent);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');

  const handleStateDatePress = (date) => {
    setEventStartdateTime(date);
    setStartDateVisible(!startDateVisible)
  }
  const handleCancelPress = () => {
    setStartDateVisible(false)
    setEndDateVisible(false)
    setUntilDateVisible(false)
  }

  const handleEndDatePress = (date) => {
    setEventEnddateTime(date);
    setEndDateVisible(!endDateVisible)
  }

  const handleUntilDatePress = (date) => {
    setEventUntildateTime(date);
    setUntilDateVisible(!untilDateVisible)
  }

  const colorToggleModal = () => {
    setIsColorPickerModal(!isColorPickerModal);
  };

  useEffect(() => {
    if (route.params && route.params.locationName) {
      setSearchLocation(route.params.locationName);
      setLocationDetail(route.params.locationDetail);
    }
  }, [isFocused]);

  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Event</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={async () => {
            const entity = await Utility.getStorage('loggedInEntity');
            const uid = entity.uid || entity.auth.user_id;
            const entityRole = entity.role === 'user' ? 'users' : 'groups';

            if (eventTitle === strings.createTitleValue) {
              Alert.alert('Towns Cup', 'Please Enter Event Title.');
            } else if (eventDescription === strings.createAboutValue) {
              Alert.alert('Towns Cup', 'Please Enter Event Description.');
            } else if (eventStartDateTime === '') {
              Alert.alert('Towns Cup', 'Please Select Event Start Date and Time.');
            } else if (eventEndDateTime === '') {
              Alert.alert('Towns Cup', 'Please Select Event End Date and Time.');
            } else if (eventEndDateTime === '') {
              Alert.alert('Towns Cup', 'Please Select Event End Date and Time.');
            } else if (searchLocation === strings.searchHereText) {
              Alert.alert('Towns Cup', 'Please Select Event Location.');
            } else {
              setloading(true);
              const data = [{
                title: eventTitle,
                descriptions: eventDescription,
                color: singleSelectEventColor,
                allDay: toggle,
                start_datetime: new Date(eventStartDateTime).getTime() / 1000,
                end_datetime: new Date(eventEndDateTime).getTime() / 1000,
                location: searchLocation,
                latitude: locationDetail.lat,
                longitude: locationDetail.lng,
                isBlocked: is_Blocked,
                is_recurring: is_Recurring,
              }]
              createEvent(entityRole, uid, data)
                .then(() => getEvents(entityRole, uid))
                .then((response) => {
                  setloading(false);
                  navigation.goBack();
                  console.log('Response :-', response);
                })
                .catch((e) => {
                  setloading(false);
                  console.log('Error ::--', e);
                  Alert.alert('', e.messages)
                });
            }
          }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
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
          <EventItemRender
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
                      eventColors.map(async (createEventItem) => {
                        const createEventData = createEventItem;
                        if (createEventData.id === item.id) {
                          createEventData.isSelected = true;
                          setSingleSelectEventColor(createEventData.color);
                        } else {
                          createEventData.isSelected = false;
                        }
                        return null;
                      })
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
          </EventItemRender>

          <EventItemRender
            title={strings.timeTitle}
          >
            <View style={styles.toggleViewStyle}>
              <Text style={styles.allDayText}>{strings.allDay}</Text>
              <TouchableOpacity style={ styles.checkbox } onPress={() => setToggle(!toggle)}>
                <Image
                    source={ toggle ? images.checkWhiteLanguage : images.uncheckWhite}
                    style={ styles.checkboxImg }
                  />
              </TouchableOpacity>
            </View>
            <EventTimeSelectItem
              title={strings.starts}
              date={eventStartDateTime ? moment(eventStartDateTime).format('ll') : strings.date}
              time={eventStartDateTime ? moment(eventStartDateTime).format('h:mm a') : strings.time}
              onDatePress={() => setStartDateVisible(!startDateVisible)}
            />
            <EventTimeSelectItem
              title={strings.ends}
              date={eventEndDateTime ? moment(eventEndDateTime).format('ll') : strings.date}
              time={eventEndDateTime ? moment(eventEndDateTime).format('h:mm a') : strings.time}
              containerStyle={{ marginBottom: 12 }}
              onDatePress={() => setEndDateVisible(!endDateVisible)}
            />
            <EventMonthlySelection
              dataSource={[
                { label: 'Weekly', value: 'Weekly' },
                { label: 'Monthly', value: 'Monthly' },
              ]}
              placeholder={strings.selectTimePlaceholder}
              value={selectWeekMonth}
              onValueChange={(value) => {
                setSelectWeekMonth(value);
              }}
            />
            <EventTimeSelectItem
              title={strings.until}
              date={eventUntilDateTime ? moment(eventUntilDateTime).format('ll') : strings.date}
              time={eventUntilDateTime ? moment(eventUntilDateTime).format('h:mm a') : strings.time}
              containerStyle={{ marginBottom: 12 }}
              onDatePress={() => setUntilDateVisible(!untilDateVisible)}
            />
          </EventItemRender>

          <EventItemRender
            title={strings.place}
          >
            <EventSearchLocation
              onLocationPress={() => {
                // console.log('Pressed!');
                navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'CreateEventScreen',
                })
              }}
              locationText={searchLocation}
            />
            <EventMapView
              region={{
                latitude: locationDetail ? locationDetail.lat : 37.78825,
                longitude: locationDetail ? locationDetail.lng : -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              coordinate={{
                latitude: locationDetail ? locationDetail.lat : 37.78825,
                longitude: locationDetail ? locationDetail.lng : -122.4324,
              }}
            />
          </EventItemRender>

          <EventItemRender
            title={strings.availableTitle}
            containerStyle={{ marginTop: 10 }}
          >
            <Text style={styles.availableSubHeader}>{strings.availableSubTitle}</Text>
            <FlatList
              data={challengeAvailable}
              style={{ marginTop: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={ ({ item }) => <RadioBtnItem
                titleName={item.title}
                selected={item.isSelected}
                onRadioBtnPress={() => {
                  challengeAvailable.map((availableItem) => {
                    const availableData = availableItem;
                    if (availableData.id === item.id) {
                      availableData.isSelected = true;
                      if (availableData.title === 'Block') {
                        setIsBlocked(availableData.isSelected);
                      } else {
                        setIsBlocked(false);
                      }
                    } else {
                      availableData.isSelected = false;
                    }
                    return null;
                  })
                  setChallengeAvailable([...challengeAvailable])
                }}
              />
              }
              keyExtractor={ (item, index) => index.toString() }
            />
          </EventItemRender>

          <EventItemRender
            title={strings.recurringEventTitle}
            containerStyle={{ marginVertical: 15 }}
          >
            <FlatList
              data={updateEvent}
              style={{ marginTop: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={ ({ item }) => <RadioBtnItem
                titleName={item.title}
                selected={item.isSelected}
                onRadioBtnPress={() => {
                  updateEvent.map((eventItem) => {
                    const eventData = eventItem;
                    if (eventData.id === item.id) {
                      eventData.isSelected = true;
                      if (eventData.title === 'This event') {
                        setIsRecurring(false);
                      } else {
                        setIsRecurring(eventData.isSelected);
                      }
                    } else {
                      eventData.isSelected = false;
                    }
                    return null;
                  })
                  setUpdateEvent([...updateEvent])
                }}
              />
              }
              keyExtractor={ (item, index) => index.toString() }
            />
          </EventItemRender>
          <DateTimePickerView
            visible={startDateVisible}
            onDone={handleStateDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
          />
          <DateTimePickerView
            visible={endDateVisible}
            onDone={handleEndDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
          />
          <DateTimePickerView
            visible={untilDateVisible}
            onDone={handleUntilDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
          />
          <DefaultColorModal
            isModalVisible={isColorPickerModal}
            onBackdropPress={() => setIsColorPickerModal(false)}
            cancelImageSource={images.cancelImage}
            containerStyle={{ height: hp('75%') }}
            onCancelImagePress={() => setIsColorPickerModal(false)}
            headerCenterText={'Add color'}
            onColorSelected={(selectColor) => {
              const data = [...selectedEventColors];
              const obj = {
                id: eventColors.length + data.length,
                color: selectColor,
                isSelected: false,
              };
              if (selectedEventColors.length === 0) {
                setcounter(counter + 1);
                data.push(obj);
                setSelectedEventColors(data);
              } else {
                const filterColor = selectedEventColors.filter((select_color_item) => selectColor === select_color_item.color);
                if (filterColor.length === 0) {
                  setcounter(counter + 1);
                  data.push(obj);
                  setSelectedEventColors(data);
                }
              }
            }}
            onDonePress={() => {
              const createdEventAddData = [...eventColors, ...selectedEventColors];
              setEventColors(createdEventAddData);
              setIsColorPickerModal(false);
            }}
            flatListData={[...selectedEventColors, '0']}
            renderItem={({ item, index }) => {
              if (index === selectedEventColors.length) {
                return (
                  <EventColorItem
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                source={item.isSelected ? images.check : null}
                imageStyle={{ tintColor: colors.whiteColor }}
                eventColorViewStyle={{
                  backgroundColor: item.color,
                  borderWidth: item.isSelected ? 2 : 0,
                  borderColor: colors.whiteColor,
                  marginRight: wp(3),
                }}
                />
              );
            }}
          />
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginHorizontal: 15,
    justifyContent: 'space-between',
    paddingVertical: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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
