import React, { useState } from 'react';
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
import Header from '../../../components/Home/Header';
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

export default function EditEventScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isColorPickerModal, setIsColorPickerModal] = useState(false);
  const [eventColors, setEventColors] = useState(eventColorData);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
  const [challengeAvailable, setChallengeAvailable] = useState(challengeAvailability);
  const [eventModalHeader, setEventModalHeader] = useState('');
  const [toggle, setToggle] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState('');
  const [aboutDesc, setAboutDesc] = useState(strings.createAboutValue);
  const [searchPlace, setSearchPlace] = useState('');
  const [startDate, setStartDate] = useState(strings.date);
  const [startTime, setStartTime] = useState(strings.time);
  const [endDate, setEndDate] = useState(strings.date);
  const [endTime, setEndTime] = useState(strings.time);
  const [untilDate, setUntilDate] = useState(strings.date);
  const [untilTime, setUntilTime] = useState(strings.time);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const colorToggleModal = () => {
    setIsColorPickerModal(!isColorPickerModal);
  };

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

  return (
    <SafeAreaView style={ styles.mainContainerStyle }>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Event - Game with Whitecaps FC</Text>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView>
        <EventView
          colorView={{ color: colors.orangeColor }}
          dateMonth={'Sep'}
          date={'25'}
          title={'Game with Whitecaps FC'}
          eventTitle={{ color: colors.orangeColor }}
          description={'Team Trainning must important'}
          eventTime={'7:00pm - 9:10 pm'}
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
          <Text style={styles.textValueStyle}>{strings.aboutValue}</Text>
        </EditEventItem>
        <View style={styles.sepratorViewStyle} />
        <EditEventItem
          title={strings.eventColorTitle}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.eventColorTitle)
          }}
        >
          <View style={styles.eventColorViewStyle} />
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
            fromTime={strings.fromTime}
            to={strings.to}
            toTime={strings.fromTime}
            repeat={strings.repeat}
            repeatTime={strings.repeatTime}
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
          <Text style={styles.textValueStyle}>{strings.placeName}</Text>
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
        </EditEventItem>
        <View style={styles.sepratorViewStyle} />
        <EditEventItem
          title={strings.availableTitle}
          onEditPress={() => {
            toggleModal();
            setEventModalHeader(strings.availableTitle)
          }}
        >
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Image source={images.checkWhiteLanguage} style={styles.availableImageStyle} />
            <Text style={styles.availableTextStyle}>{strings.available}</Text>
          </View>
        </EditEventItem>
        <EditEventModal
            isModalVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            cancelImageSource={images.cancelImage}
            onCancelImagePress={() => setModalVisible(false)}
            headerCenterText={eventModalHeader}
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
          </View>}

          {eventModalHeader === strings.place && <EventSearchLocation
            sectionStyle={{ marginTop: 20 }}
            onChangeText={(text) => {
              setSearchPlace(text);
            }}
            value={searchPlace}
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
});
