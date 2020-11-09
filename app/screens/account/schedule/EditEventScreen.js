import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../components/Home/Header';
import * as Utility from '../../../utils/index';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventTimeItem from '../../../components/Schedule/EventTimeItem';
import EventMapView from '../../../components/Schedule/EventMapView';
import strings from '../../../Constants/String';
import EventView from '../../../components/Schedule/EventView';
import EditEventItem from '../../../components/Schedule/EditEventItem';
import EditEventModal from '../EditEventModal';
import EventTextInput from '../../../components/Schedule/EventTextInput';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import EventSearchLocation from '../../../components/Schedule/EventSearchLocation';
import RadioBtnItem from '../../../components/Schedule/RadioBtnItem';
import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';
import ActivityLoader from '../../../components/loader/ActivityLoader';

const eventColorData = [
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

export default function EditEventScreen({ navigation, route }) {
  let event_Title = '';
  let aboutDescription = '';
  let eventColor = '';
  let fromDate = '';
  let toDate = '';
  let location = '';
  let latValue = '';
  let longValue = '';
  let latLongLocation = {};
  let blockValue = false;
  let calID = '';
  let calType = '';
  let ownerID = '';
  if (route && route.params && route.params.data) {
    if (route.params.data.title) {
      event_Title = route.params.data.title;
    }
    if (route.params.data.descriptions) {
      aboutDescription = route.params.data.descriptions;
    }
    if (route.params.data.color) {
      eventColor = route.params.data.color;
    }
    if (route.params.data.start_datetime) {
      fromDate = new Date(route.params.data.start_datetime * 1000);
    }
    if (route.params.data.end_datetime) {
      toDate = new Date(route.params.data.end_datetime * 1000);
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
    if (route.params.data.cal_id) {
      calID = route.params.data.cal_id;
    }
    if (route.params.data.cal_type) {
      calType = route.params.data.cal_type;
    }
    if (route.params.data.owner_id) {
      ownerID = route.params.data.owner_id;
    }
  }

  const isFocused = useIsFocused();
  const [aboutDesc, setAboutDesc] = useState(aboutDescription);
  const [singleSelectEventColor, setSingleSelectEventColor] = useState(eventColor);
  const [toggle, setToggle] = useState(false);
  const [eventStartDateTime, setEventStartdateTime] = useState(fromDate);
  const [eventEndDateTime, setEventEnddateTime] = useState(toDate);
  const [eventUntilDateTime, setEventUntildateTime] = useState('');
  const [searchLocation, setSearchLocation] = useState(location);
  const [locationDetail, setLocationDetail] = useState(latLongLocation);
  const [is_Blocked, setIsBlocked] = useState(blockValue);
  const [loading, setloading] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [eventColors, setEventColors] = useState(eventColorData);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
  const [challengeAvailable, setChallengeAvailable] = useState(challengeAvailability);
  const [eventModalHeader, setEventModalHeader] = useState('');
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');

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

  return (
    <SafeAreaView style={ styles.mainContainerStyle }>
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Event - {event_Title}</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={async () => {
            setloading(true);
            const entity = await Utility.getStorage('loggedInEntity');
            const u_id = entity.uid || entity.auth.user_id;
            // const entityRole = entity.role === 'user' ? 'users' : 'groups';
            const data = [{
              title: event_Title,
              descriptions: aboutDesc,
              color: singleSelectEventColor,
              start_datetime: new Date(eventStartDateTime).getTime() / 1000,
              end_datetime: new Date(eventEndDateTime).getTime() / 1000,
              location: searchLocation,
              latitude: locationDetail.lat,
              longitude: locationDetail.lng,
              isBlocked: is_Blocked,
              cal_id: calID,
              owner_id: ownerID,
              cal_type: calType,
              createdBy: {
                last_name: entity.obj.last_name,
                first_name: entity.obj.first_name,
                uid: u_id,
              },
              allDay: false,
              is_recurring: false,
              createdAt: 1604919517,
            }]
            console.log('Data :-', data);
            // editEvent(entityRole, u_id, data)
            //   .then(() => getEvents(entityRole, u_id))
            //   .then((response) => {
            //     setloading(false);
            //     navigation.goBack();
            //     console.log('Response :-', response);
            //   })
            //   .catch((e) => {
            //     setloading(false);
            //     console.log('Error ::--', e);
            //     Alert.alert('', e.messages)
            //   });
          }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView>
        <EventView
          colorView={{ backgroundColor: singleSelectEventColor }}
          dateMonth={moment(eventStartDateTime).format('MMM')}
          date={moment(eventStartDateTime).format('DD')}
          title={event_Title}
          eventTitle={{ color: singleSelectEventColor }}
          description={aboutDesc}
          eventTime={`${moment(eventStartDateTime).format('LT')} - ${moment(eventEndDateTime).format('LT')}`}
          eventLocation={'BC Stadium'}
          containerStyle={{ marginVertical: 20 }}
        />

        <EditEventItem
          title={strings.about}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.about)
          }}
        >
          <Text style={styles.textValueStyle}>{aboutDesc}</Text>
        </EditEventItem>
        <View style={styles.sepratorViewStyle} />
        <EditEventItem
          title={strings.eventColorTitle}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.eventColorTitle)
          }}
        >
          <View style={[styles.eventColorViewStyle, { backgroundColor: singleSelectEventColor }]} />
        </EditEventItem>
        <View style={styles.sepratorViewStyle} />
        <EditEventItem
          title={strings.timeTitle}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.timeTitle)
          }}
        >
          <EventTimeItem
            from={strings.from}
            fromTime={eventStartDateTime ? moment(eventStartDateTime).format('ll h:mm a') : strings.fromTime}
            to={strings.to}
            toTime={eventEndDateTime ? moment(eventEndDateTime).format('ll h:mm a') : strings.fromTime}
            repeat={strings.repeat}
            repeatTime={eventUntilDateTime ? moment(eventUntilDateTime).format('ll h:mm a') : strings.fromTime}
          />
        </EditEventItem>
        <View style={styles.sepratorViewStyle} />
        <EditEventItem
          title={strings.place}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.place)
          }}
        >
          <Text style={styles.textValueStyle}>{searchLocation}</Text>
          <EventMapView
            region={{
              latitude: locationDetail ? locationDetail.lat : latValue,
              longitude: locationDetail ? locationDetail.lng : longValue,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: locationDetail ? locationDetail.lat : latValue,
              longitude: locationDetail ? locationDetail.lng : longValue,
            }}
          />
        </EditEventItem>
        <View style={styles.sepratorViewStyle} />
        <EditEventItem
          title={strings.availableTitle}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.availableTitle)
          }}
        >
          {!is_Blocked ? <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Image source={images.checkWhiteLanguage} style={styles.availableImageStyle} />
            <Text style={styles.availableTextStyle}>{strings.available}</Text>
          </View> : <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <View style={styles.blockedImageViewStyle}>
              <Image source={images.cancelImage} style={styles.cancelImageStyle} resizeMode={'contain'} />
            </View>
            <Text style={[styles.availableTextStyle, { color: colors.veryLightBlack }]}>{strings.blocked}</Text>
          </View>}
        </EditEventItem>
        <EditEventModal
            isModalVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            cancelImageSource={images.cancelImage}
            onCancelImagePress={() => setModalVisible(false)}
            headerCenterText={eventModalHeader}
            onDonePress={() => setModalVisible(false)}
        >
          {eventModalHeader === strings.about && <EventTextInput
            placeholder={strings.aboutPlaceholder}
            onChangeText={(text) => {
              setAboutDesc(text);
            }}
            multiline={true}
            value={aboutDesc}
          />}

          {eventModalHeader === strings.eventColorTitle && <FlatList
            data={[...eventColors, '0']}
            numColumns={5}
            scrollEnabled={false}
            style={{ marginTop: 20 }}
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
          />}

          {eventModalHeader === strings.timeTitle && <View style={{ marginTop: 20 }}>
            <View style={styles.toggleViewStyle}>
              <Text style={styles.allDayText}>{strings.allDay}</Text>
              <TouchableOpacity style={styles.checkbox} onPress={() => setToggle(!toggle)}>
                <Image
                    source={toggle ? images.checkWhiteLanguage : images.uncheckWhite}
                    style={styles.checkboxImg}
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
          </View>}

          {eventModalHeader === strings.place && <EventSearchLocation
            sectionStyle={{ marginTop: 20 }}
            locationText={searchLocation}
            onLocationPress={() => {
              toggleModal();
              navigation.navigate('SearchLocationScreen', {
                comeFrom: 'EditEventScreen',
              })
            }}
          />}
          {eventModalHeader === strings.availableTitle && <View style={{ width: wp('94%'), marginTop: 20 }}>
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
                touchRadioBtnStyle={{ right: 10 }}
              />
              }
              keyExtractor={ (item, index) => index.toString() }
            />
          </View>}
          <DateTimePickerView
            visible={startDateVisible}
            onDone={handleStateDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            date={eventStartDateTime}
          />
          <DateTimePickerView
            visible={endDateVisible}
            onDone={handleEndDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            date={eventEndDateTime}
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
        </EditEventModal>
      </ScrollView>
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
  sepratorViewStyle: {
    borderColor: colors.sepratorColor,
    borderWidth: hp('0.4%'),
    marginVertical: hp('1.5%'),
  },
  textValueStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 3,
    color: colors.lightBlackColor,
  },
  eventColorViewStyle: {
    backgroundColor: colors.orangeColor,
    width: wp('16%'),
    height: hp('3.5%'),
    marginTop: 3,
    borderRadius: 5,
  },
  availableImageStyle: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
  },
  availableTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    color: colors.greeColor,
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
  availableSubHeader: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 5,
  },
  blockedImageViewStyle: {
    height: 26,
    width: 26,
    borderRadius: 26 / 2,
    backgroundColor: colors.veryLightBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelImageStyle: {
    width: 10,
    height: 10,
    tintColor: colors.whiteColor,
  },
});
