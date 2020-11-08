import React, { useState } from 'react';
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
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../components/Home/Header';
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

export default function CreateEventScreen({ navigation }) {
  const [eventColors, setEventColors] = useState(eventColorsData);
  const [challengeAvailable, setChallengeAvailable] = useState(challengeAvailability);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
  const [updateEvent, setUpdateEvent] = useState(updateRecurringEvent);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');
  const [startDate, setStartDate] = useState(strings.date);
  const [startTime, setStartTime] = useState(strings.time);
  const [endDate, setEndDate] = useState(strings.date);
  const [endTime, setEndTime] = useState(strings.time);
  const [untilDate, setUntilDate] = useState(strings.date);
  const [untilTime, setUntilTime] = useState(strings.time);

  const handleStateDatePress = (date) => {
    setStartDate(moment(date).format('ll'));
    setStartTime(moment(date).format('h:mm a'));
    setStartDateVisible(!startDateVisible)
  }
  const handleCancelPress = () => {
    setStartDateVisible(false)
    setEndDateVisible(false)
    setUntilDateVisible(false)
  }

  const handleEndDatePress = (date) => {
    setEndDate(moment(date).format('ll'));
    setEndTime(moment(date).format('h:mm a'));
    setEndDateVisible(!endDateVisible)
  }

  const handleUntilDatePress = (date) => {
    setUntilDate(moment(date).format('ll'));
    setUntilTime(moment(date).format('h:mm a'));
    setUntilDateVisible(!untilDateVisible)
  }

  const colorToggleModal = () => {
    setIsColorPickerModal(!isColorPickerModal);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
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
          <TouchableOpacity style={{ padding: 2 }}>
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
            onChangeText={() => {}}
            value={strings.createTitleValue}
          />
          <EventTextInputItem
            title={strings.about}
            placeholder={strings.aboutPlaceholder}
            onChangeText={() => {}}
            multiline={true}
            value={strings.createAboutValue}
          />
          <EventItemRender
            title={strings.eventColorTitle}
          >
            {/* <FlatList
              data={eventColors}
              horizontal={true}
              ItemSeparatorComponent={() => <View style={{ width: wp('3%') }} />}
              ListFooterComponent={() => <EventColorItem
                onItemPress={() => colorToggleModal()}
                eventColorViewStyle={{ marginLeft: wp('3%') }}
                source={images.plus}
              />}
              renderItem={ ({ item, index }) => <EventColorItem
                source={item.isSelected ? images.check : null}
                imageStyle={{ tintColor: colors.whiteColor }}
                onItemPress={() => {
                  eventColors[index].isSelected = !eventColors[index].isSelected;
                  setEventColors([...eventColors]);
                }}
                eventColorViewStyle={{ backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor }}
              /> }
              keyExtractor={ (item, index) => index.toString() }
            /> */}
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
              date={startDate}
              time={startTime}
              onDatePress={() => setStartDateVisible(!startDateVisible)}
            />
            <EventTimeSelectItem
              title={strings.ends}
              date={endDate}
              time={endTime}
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
              date={untilDate}
              time={untilTime}
              containerStyle={{ marginBottom: 12 }}
              onDatePress={() => setUntilDateVisible(!untilDateVisible)}
            />
          </EventItemRender>

          <EventItemRender
            title={strings.place}
          >
            <EventSearchLocation
              onChangeText={() => {}}
            />
            <EventMapView
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
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
