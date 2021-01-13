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
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import AuthContext from '../../../auth/context'
import Header from '../../../components/Home/Header';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import EventMapView from '../../../components/Schedule/EventMapView';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
import EventSearchLocation from '../../../components/Schedule/EventSearchLocation';
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

export default function CreateEventScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext)
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [singleSelectEventColor, setSingleSelectEventColor] = useState(colors.orangeColor);
  const [toggle, setToggle] = useState(false);
  const [eventStartDateTime, setEventStartdateTime] = useState('');
  const [eventEndDateTime, setEventEnddateTime] = useState('');
  const [eventUntilDateTime, setEventUntildateTime] = useState('');
  const [searchLocation, setSearchLocation] = useState(strings.searchHereText);
  const [locationDetail, setLocationDetail] = useState(null);
  const [is_Blocked, setIsBlocked] = useState(false);
  const [loading, setloading] = useState(false);
  const [addColorDoneButton, setAddColorDoneButton] = useState(false);

  const [eventColors, setEventColors] = useState([]);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const eventColorData = await Utility.getStorage('eventColor');
      setEventColors(eventColorData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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
    let dateValue = new Date();
    if (toggle) {
      dateValue = `${moment(date).format('ddd MMM DD YYYY')} 11:59:59 PM`
      console.log('Date Value :-', dateValue);
      setEventEnddateTime(dateValue);
    } else {
      setEventEnddateTime(date);
    }
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (route.params.comeName) {
        Geolocation.getCurrentPosition((position) => {
          const latValue = position.coords.latitude;
          const longValue = position.coords.longitude;
          const obj = {
            lat: latValue,
            lng: longValue,
          };
          setLocationDetail(obj);
          getLocationNameWithLatLong(latValue, longValue, authContext).then((res) => {
            setSearchLocation(res.results[0].formatted_address);
          })
        },
        (error) => {
          console.log('Error :-', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
        })
      }
    });
    return () => {
      unsubscribe();
    };
  }, [route.params.comeName]);

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Create an Event</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={async () => {
            const entity = authContext.entity
            const uid = entity.uid || entity.auth.user_id;
            const entityRole = entity.role === 'user' ? 'users' : 'groups';

            if (eventTitle === '') {
              Alert.alert('Towns Cup', 'Please Enter Event Title.');
            } else if (eventDescription === '') {
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
              }]
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
                navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'CreateEventScreen',
                })
                navigation.setParams({ comeName: null });
              }}
              locationText={searchLocation}
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

          <DateTimePickerView
            visible={startDateVisible}
            onDone={handleStateDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            mode={toggle ? 'date' : 'datetime'}
          />
          <DateTimePickerView
            visible={endDateVisible}
            onDone={handleEndDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={eventStartDateTime || new Date()}
            mode={toggle ? 'date' : 'datetime'}
          />
          <DateTimePickerView
            visible={untilDateVisible}
            onDone={handleUntilDatePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={eventEndDateTime || new Date()}
            mode={toggle ? 'date' : 'datetime'}
          />
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
              Utility.setStorage('eventColor', createdEventAddData);
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
