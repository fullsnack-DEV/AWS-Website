import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import moment from 'moment';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../../components/Home/Header';
import AuthContext from '../../../auth/context'
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

export default function EditEventScreen({ navigation, route }) {
  const authContext = useContext(AuthContext)
  let event_Title = 'Game';
  let aboutDescription = 'Game With';
  let aboutDescription2 = '';
  let eventColor = colors.themeColor;
  let fromDate = '';
  let toDate = '';
  let createdAtDate = '';
  let location = '';
  let venue = '';
  let latValue = null;
  let longValue = null;
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
    if (route.params.data.created_at) {
      createdAtDate = route.params.data.created_at;
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

  const isFocused = useIsFocused();
  const [eventTitle, setEventTitle] = useState(event_Title);
  const [aboutDesc, setAboutDesc] = useState(`${aboutDescription} ${aboutDescription2}`);
  const [singleSelectEventColor, setSingleSelectEventColor] = useState(eventColor[0] !== '#' ? `#${eventColor}` : eventColor);
  const [toggle, setToggle] = useState(false);
  const [eventStartDateTime, setEventStartdateTime] = useState(fromDate);
  const [eventEndDateTime, setEventEnddateTime] = useState(toDate);
  const [eventUntilDateTime, setEventUntildateTime] = useState('');
  const [searchLocation, setSearchLocation] = useState(location || venue);
  const [locationDetail, setLocationDetail] = useState(latLongLocation);
  const [is_Blocked, setIsBlocked] = useState(blockValue);
  const [loading, setloading] = useState(false);
  const [addColorDoneButton, setAddColorDoneButton] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [eventColors, setEventColors] = useState(eventColorData);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
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
          <Text style={styles.eventTextStyle}>Edit an Event</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={async () => {
            setloading(true);
            const entity = authContext.entity
            const u_id = entity.uid || entity.auth.user_id;
            const entityRole = entity.role === 'user' ? 'users' : 'groups';
            const params = {
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
              createdBy: [{
                last_name: entity.obj.last_name,
                first_name: entity.obj.first_name,
                uid: u_id,
              }],
              allDay: false,
              is_recurring: false,
              createdAt: createdAtDate,
            };
            editEvent(entityRole, u_id, params, authContext)
              .then(() => getEvents(entityRole, u_id, authContext))
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
          }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView>
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
            toggle={!toggle}
            date={eventStartDateTime ? moment(eventStartDateTime).format('ll') : moment(new Date()).format('ll')}
            time={eventStartDateTime ? moment(eventStartDateTime).format('h:mm a') : moment(new Date()).format('h:mm a')}
            onDatePress={() => setStartDateVisible(!startDateVisible)}
          />
          <EventTimeSelectItem
            title={strings.ends}
            toggle={!toggle}
            date={eventEndDateTime ? moment(eventEndDateTime).format('ll') : moment(new Date()).format('ll')}
            time={eventEndDateTime ? moment(eventEndDateTime).format('h:mm a') : moment(new Date()).format('h:mm a')}
            containerStyle={{ marginBottom: 8 }}
            onDatePress={() => setEndDateVisible(!endDateVisible)}
          />
          <EventMonthlySelection
            title={strings.repeat}
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
          {!selectWeekMonth && <EventTimeSelectItem
            title={strings.until}
            toggle={!toggle}
            date={eventUntilDateTime ? moment(eventUntilDateTime).format('ll') : moment(new Date()).format('ll')}
            time={eventUntilDateTime ? moment(eventUntilDateTime).format('h:mm a') : moment(new Date()).format('h:mm a')}
            containerStyle={{ marginBottom: 12 }}
            onDatePress={() => setUntilDateVisible(!untilDateVisible)}
          />}
        </EventItemRender>

        <EventItemRender
            title={strings.place}
          >
          <EventSearchLocation
            onLocationPress={() => {
              toggleModal();
              navigation.navigate('SearchLocationScreen', {
                comeFrom: 'EditEventScreen',
              })
            }}
            locationText={searchLocation}
          />
          <EventMapView
            region={{
              latitude: locationDetail ? Number(locationDetail.lat) : Number(latValue),
              longitude: locationDetail ? Number(locationDetail.lng) : Number(longValue),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: locationDetail ? Number(locationDetail.lat) : Number(latValue),
              longitude: locationDetail ? Number(locationDetail.lng) : Number(longValue),
            }}
          />
        </EventItemRender>

        <EventItemRender
            title={strings.availableTitle}
            containerStyle={{ marginTop: 10 }}
          >
          <Text style={styles.availableSubHeader}>{strings.availableSubTitle}</Text>
          <BlockAvailableTabView
            blocked={is_Blocked}
            firstTabTitle={'Block'}
            secondTabTitle={'Set available'}
            onFirstTabPress={() => setIsBlocked(true)}
            onSecondTabPress={() => setIsBlocked(false)}
          />
        </EventItemRender>
        <DefaultColorModal
          isModalVisible={isColorPickerModal}
          onBackdropPress={() => setIsColorPickerModal(false)}
          cancelImageSource={images.cancelImage}
          containerStyle={{ height: hp('75%') }}
          onCancelImagePress={() => setIsColorPickerModal(false)}
          headerCenterText={'Add color'}
          onColorSelected={(selectColor) => {
            setAddColorDoneButton(true);
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
          doneButtonDisplay={addColorDoneButton}
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
        <DateTimePickerView
          visible={startDateVisible}
          onDone={handleStateDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          date={eventStartDateTime}
          mode={toggle ? 'date' : 'datetime'}
        />
        <DateTimePickerView
          visible={endDateVisible}
          onDone={handleEndDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          date={eventEndDateTime}
          minimumDate={eventStartDateTime ? new Date(moment(eventStartDateTime).format('YYYY-MM-DD HH:mm:ss')) : new Date()}
          mode={toggle ? 'date' : 'datetime'}
        />
        <DateTimePickerView
          visible={untilDateVisible}
          onDone={handleUntilDatePress}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          mode={toggle ? 'date' : 'datetime'}
        />
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
