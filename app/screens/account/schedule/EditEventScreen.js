// /* eslint-disable array-callback-return */
// /* eslint-disable no-nested-ternary */
// /* eslint-disable no-plusplus */
// import React, {useEffect, useState, useContext} from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Text,
//   SafeAreaView,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import moment from 'moment';
// import {FlatList} from 'react-native-gesture-handler';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {useIsFocused} from '@react-navigation/native';
// import {parseInt} from 'lodash';
// import Header from '../../../components/Home/Header';
// import AuthContext from '../../../auth/context';
// import colors from '../../../Constants/Colors';
// import fonts from '../../../Constants/Fonts';
// import images from '../../../Constants/ImagePath';
// import EventMapView from '../../../components/Schedule/EventMapView';
// import strings from '../../../Constants/String';
// import EventColorItem from '../../../components/Schedule/EventColorItem';
// import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
// import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';
// import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
// import EventSearchLocation from '../../../components/Schedule/EventSearchLocation';
// import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';
// import ActivityLoader from '../../../components/loader/ActivityLoader';
// import {editEvent} from '../../../api/Schedule';
// import EventTextInputItem from '../../../components/Schedule/EventTextInputItem';
// import EventItemRender from '../../../components/Schedule/EventItemRender';
// import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
// import * as Utility from '../../../utils/index';
// import TCKeyboardView from '../../../components/TCKeyboardView';

// export default function EditEventScreen({navigation, route}) {
//   const authContext = useContext(AuthContext);
//   let event_Title = 'Game';
//   let aboutDescription = 'Game With';
//   let aboutDescription2 = '';
//   let fromDate = '';
//   let toDate = '';
//   let untildate = '';

//   let location = '';
//   let venue = '';
//   let rule = 'Does not repeat';
//   let latValue = null;
//   let longValue = null;
//   let latLongLocation = {};
//   let blockValue = false;

//   if (route && route.params && route.params.data) {
//     if (route.params.data.title) {
//       event_Title = route.params.data.title;
//     }
//     console.log('DATA:::=>', route.params.data);
//     if (route.params.data.rrule) {
//       const a = route.params.data.rrule;
//       console.log('RULESa:=>', a);
//       const arr = a.split(';');
//       console.log('RULESarr:=>', arr);
//       const str = arr[0].substring(5).toLowerCase();
//       console.log('RULESstr:=>', str);
//       rule = str.charAt(0).toUpperCase() + str.slice(1);
//       console.log('RULES:=>', rule);
//     }
//     if (route.params.data.descriptions) {
//       aboutDescription = route.params.data.descriptions;
//     }

//     if (route.params.data.start_datetime) {
//       fromDate = new Date(route.params.data.start_datetime * 1000);
//     }
//     if (route.params.data.end_datetime) {
//       toDate = new Date(route.params.data.end_datetime * 1000);
//     }
//     if (route.params.data.untilDate) {
//       untildate = new Date(route.params.data.untilDate * 1000);
//     }

//     if (route.params.data.location) {
//       location = route.params.data.location.location_name;
//     }
//     if (route.params.data.latitude) {
//       latValue = route.params.data.latitude;
//       latLongLocation = {
//         lat: route.params.data.location.latitude,
//         lng: route.params.data.location.longitude,
//       };
//     }
//     if (route.params.data.longitude) {
//       longValue = route.params.data.location.longitude;
//     }
//     if (route.params.data.isBlocked) {
//       blockValue = route.params.data.isBlocked;
//     }
//   }
//   if (route && route.params && route.params.gameData) {
//     if (route.params.gameData.game && route.params.gameData.game.away_team) {
//       aboutDescription2 = route.params.gameData.game.away_team.group_name;
//     }
//     if (route.params.gameData.game && route.params.gameData.game.venue) {
//       venue = route.params.gameData.game.venue.address;
//     }
//     if (route.params.data.location) {
//       latLongLocation = {
//         lat: route.params.data.location.latitude,
//         lng: route.params.data.location.longitude
//       };
//     }
//   }
//   const getNearDateTime = (date) => {
//     const start = moment(date);
//     const nearTime = 5 - (start.minute() % 5);
//     const dateTime = moment(start).add(nearTime, 'm').toDate();
//     return dateTime;
//   };
//   const isFocused = useIsFocused();
//   const [eventTitle, setEventTitle] = useState(event_Title);
//   const [aboutDesc, setAboutDesc] = useState(
//     `${aboutDescription} ${aboutDescription2}`,
//   );
//   const [singleSelectEventColor, setSingleSelectEventColor] = useState(
//     route.params.data.color ?? '',
//   );
//   const [toggle, setToggle] = useState(route.params.data.allDay);
//   const [eventStartDateTime, setEventStartdateTime] = useState(
//     fromDate || getNearDateTime(new Date()),
//   );
//   const [eventEndDateTime, setEventEnddateTime] = useState(
//     toDate || moment(eventStartDateTime).add(5, 'm').toDate(),
//   );
//   const [eventUntilDateTime, setEventUntildateTime] = useState(
//     untildate || eventEndDateTime,
//   );
//   const [searchLocation, setSearchLocation] = useState(location || venue);
//   const [locationDetail, setLocationDetail] = useState(latLongLocation);
//   const [is_Blocked, setIsBlocked] = useState(blockValue);
//   const [loading, setloading] = useState(false);
//   const [addColorDoneButton, setAddColorDoneButton] = useState(false);

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [isColorPickerModal, setIsColorPickerModal] = useState(false);
//   const [eventColors, setEventColors] = useState();
//   const [selectedEventColors, setSelectedEventColors] = useState([]);
//   const [startDateVisible, setStartDateVisible] = useState(false);
//   const [endDateVisible, setEndDateVisible] = useState(false);
//   const [untilDateVisible, setUntilDateVisible] = useState(false);
//   const [selectWeekMonth, setSelectWeekMonth] = useState(rule);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', async () => {
//       const eventColorData = await Utility.getStorage('eventColors');

//       if (eventColorData) {
//         setEventColors(eventColorData);
//       } else {
//         setEventColors([
//           ...Utility.createdEventData,
//           {
//             id: 10,
//             color: '0',
//             isSelected: false,
//             isNew: true,
//           },
//         ]);
//       }

//       // setEventColors(eventColorData);
//     });
//     return () => {
//       unsubscribe();
//     };
//   }, [navigation]);

//   useEffect(() => {
//     if (route.params && route.params.locationName !== undefined) {
//       setSearchLocation(route.params.locationName);
//       setLocationDetail(route.params.locationDetail);
//     }
//   }, [isFocused]);

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   const colorToggleModal = () => {
//     setIsColorPickerModal(!isColorPickerModal);
//   };
//   const ordinal_suffix_of = (i) => {
//     const j = i % 10,
//       k = i % 100;
//     if (j === 1 && k !== 11) {
//       return `${i}st`;
//     }
//     if (j === 2 && k !== 12) {
//       return `${i}nd`;
//     }
//     if (j === 3 && k !== 13) {
//       return `${i}rd`;
//     }
//     return `${i}th`;
//   };
//   const countNumberOfWeekFromDay = () => {
//     const date = new Date();
//     const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
//     const endDate = date;
//     const givenDay = new Date().getDay();
//     let numberOfDates = 0;
//     while (startDate < endDate) {
//       if (startDate.getDay() === givenDay) {
//         numberOfDates++;
//       }
//       startDate.setDate(startDate.getDate() + 1);
//     }
//     return ordinal_suffix_of(numberOfDates);
//   };
//   const countNumberOfWeeks = () => {
//     const date = new Date();
//     const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
//     const endDate = date;
//     const givenDay = new Date().getDay();
//     let numberOfDates = 0;
//     while (startDate < endDate) {
//       if (startDate.getDay() === givenDay) {
//         numberOfDates++;
//       }
//       startDate.setDate(startDate.getDate() + 1);
//     }
//     return numberOfDates;
//   };
//   const getTodayDay = () => {
//     const dt = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
//     return dt.format('dddd');
//   };
//   const handleStateDatePress = (date) => {
//     setEventStartdateTime(date);
//     setEventEnddateTime(moment(date).add(5, 'm').toDate());
//     setEventUntildateTime(moment(date).add(5, 'm').toDate());
//     setStartDateVisible(!startDateVisible);
//   };
//   const handleCancelPress = () => {
//     setStartDateVisible(false);
//     setEndDateVisible(false);
//     setUntilDateVisible(false);
//   };
//   const handleEndDatePress = (date) => {
//     let dateValue = new Date();
//     if (toggle) {
//       dateValue = `${moment(date).format('ddd MMM DD YYYY')} 11:59:59 PM`;

//       setEventEnddateTime(dateValue);
//       setEventUntildateTime(dateValue);
//     } else {
//       setEventEnddateTime(date);
//       setEventUntildateTime(date);
//     }
//     setEndDateVisible(!endDateVisible);
//   };
//   const handleUntilDatePress = (date) => {
//     setEventUntildateTime(date);
//     setUntilDateVisible(!untilDateVisible);
//   };

//   const onChangeColorPressed = () => {
//     setAddColorDoneButton(false);
//     colorToggleModal();
//     setSelectedEventColors([]);
//   };
//   const getImageOfColor = (data) => {
//     if (data.isNew && data.isSelected) {
//       return images.check;
//     }
//     if (data.isNew) {
//       return images.plus;
//     }
//     if (data.isSelected) {
//       return images.check;
//     }
//     return null;
//   };
//   const renderColorItem = ({item}) => {
//     return (
//       <EventColorItem
//         item={item}
//         isNew={!!item?.isNew}
//         onChangeColorPressed={onChangeColorPressed}
//         imageStyle={{
//           tintColor:
//             item.color !== '0' ? colors.whiteColor : colors.lightBlackColor,
//         }}
//         onItemPress={() => {
//           if (item.color === '0') {
//             setAddColorDoneButton(false);
//             colorToggleModal();
//             setSelectedEventColors([]);
//           } else {
//             eventColors.map(async (createEventItem) => {
//               const createEventData = createEventItem;
//               if (createEventData.id === item.id) {
//                 createEventData.isSelected = true;
//                 setSingleSelectEventColor(createEventData.color);
//               } else {
//                 createEventData.isSelected = false;
//               }
//               return null;
//             });

//             setEventColors([...eventColors]);
//           }
//         }}
//         source={getImageOfColor(item)}
//         eventColorViewStyle={{
//           backgroundColor: item.color === '0' ? colors.whiteColor : item.color,
//           borderWidth: item.isSelected ? 2 : 0,
//           borderColor: colors.whiteColor,
//           marginRight: wp(3),
//         }}
//       />
//     );
//   };

//   console.log('Event End Date Time :-', moment(eventEndDateTime));

//   return (
//     <SafeAreaView style={styles.mainContainerStyle}>
//       <ActivityLoader visible={loading} />
//       <Header
//         leftComponent={
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Image source={images.backArrow} style={styles.backImageStyle} />
//           </TouchableOpacity>
//         }
//         centerComponent={
//           <Text style={styles.eventTextStyle}>Edit an Event</Text>
//         }
//         rightComponent={
//           <TouchableOpacity
//             style={{padding: 2}}
//             onPress={async () => {
//               setloading(true);
//               const entity = authContext.entity;
//               console.log('Auth:=>', entity);
//               const u_id = entity.uid;
//               const entityRole =
//                 entity.role === 'user' || entity.role === 'player'
//                   ? 'users'
//                   : 'groups';
//               const params = {
//                 ...route?.params?.data,
//                 title: eventTitle,
//                 descriptions: aboutDesc,
//                 color: singleSelectEventColor,
//                 start_datetime: parseInt(
//                   new Date(eventStartDateTime).getTime() / 1000,
//                 ),
//                 end_datetime: parseInt(
//                   new Date(eventEndDateTime).getTime() / 1000,
//                 ),
//                 location: searchLocation,
//                 latitude: locationDetail.lat,
//                 longitude: locationDetail.lng,
//                 blocked: is_Blocked,
//                 is_recurring: selectWeekMonth !== '',
//                 allDay: toggle,
//               };
//               let rules = '';
//               if (
//                 selectWeekMonth === 'Daily' ||
//                 selectWeekMonth === 'Weekly' ||
//                 selectWeekMonth === 'Monthly' ||
//                 selectWeekMonth === 'Yearly'
//               ) {
//                 rules = selectWeekMonth.toUpperCase();
//               } else if (
//                 selectWeekMonth ===
//                 `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`
//               ) {
//                 rules = `MONTHLY;BYDAY=${getTodayDay()
//                   .substring(0, 2)
//                   .toUpperCase()};BYSETPOS=${countNumberOfWeeks()}`;
//               } else if (
//                 selectWeekMonth ===
//                 `Monthly on ${ordinal_suffix_of(new Date().getDate())}`
//               ) {
//                 rules = `MONTHLY;BYMONTHDAY=${new Date().getDate()}`;
//               }
//               if (selectWeekMonth !== '') {
//                 params.untilDate = parseInt(
//                   new Date(eventUntilDateTime).getTime() / 1000,
//                 ).toFixed(0);
//                 if (rules !== '') {
//                   params.rrule = `FREQ=${rules}`;
//                 }
//               }

//               console.log('Edit Event object:=>', params);

//               editEvent(entityRole, u_id, params, authContext)
//                 .then((response) => {
//                   console.log('Edit Response :-', response);
//                 })
//                 .then((response) => {
//                   console.log('Get Response :-', response);
//                   setTimeout(() => {
//                     setloading(false);
//                     navigation.goBack();
//                   }, 5000);
//                 })
//                 .catch((e) => {
//                   setloading(false);
//                   console.log('Error ::--', e);
//                   Alert.alert('', e.messages);
//                 });
//             }}>
//             <Text>Done</Text>
//           </TouchableOpacity>
//         }
//       />
//       <View style={styles.sperateLine} />
//       <TCKeyboardView>
//         <EventTextInputItem
//           title={strings.title}
//           placeholder={strings.titlePlaceholder}
//           onChangeText={(text) => {
//             setEventTitle(text);
//           }}
//           value={eventTitle}
//         />

//         <EventTextInputItem
//           title={strings.about}
//           placeholder={strings.aboutPlaceholder}
//           onChangeText={(text) => {
//             setAboutDesc(text);
//           }}
//           multiline={true}
//           value={aboutDesc}
//         />

//         {/* <EventItemRender
//             title={strings.eventColorTitle}
//           >
//           <FlatList
//             data={[...eventColors, '0']}
//             numColumns={5}
//             scrollEnabled={false}
//             ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
//             renderItem={ ({ item, index }) => {
//               if (index === eventColors.length) {
//                 return (
//                   <EventColorItem
//                     onItemPress={() => {
//                       setAddColorDoneButton(false);
//                       colorToggleModal();
//                       setSelectedEventColors([])
//                     }}
//                     source={images.plus}
//                   />
//                 );
//               }
//               return (
//                 <EventColorItem
//                   source={item.isSelected ? images.check : null}
//                   imageStyle={{ tintColor: colors.whiteColor }}
//                   onItemPress={() => {
//                     eventColors.map((createEventItem) => {
//                       const createEventData = createEventItem;
//                       if (createEventData.id === item.id) {
//                         createEventData.isSelected = true;
//                         setSingleSelectEventColor(createEventData.color);
//                       } else {
//                         createEventData.isSelected = false;
//                       }
//                       return null;
//                     })
//                     Utility.setStorage('eventColor', eventColors);
//                     setEventColors([...eventColors])
//                   }}
//                   eventColorViewStyle={{
//                     backgroundColor: item.color,
//                     borderWidth: item.isSelected ? 2 : 0,
//                     borderColor: colors.whiteColor,
//                     marginRight: wp(3),
//                   }}
//                 />
//               );
//             }}
//             keyExtractor={ (item, index) => index.toString() }
//           />
//         </EventItemRender> */}

//         <EventItemRender title={strings.timeTitle}>
//           <View style={styles.toggleViewStyle}>
//             <Text style={styles.allDayText}>{strings.allDay}</Text>
//             <TouchableOpacity
//               style={styles.checkbox}
//               onPress={() => setToggle(!toggle)}>
//               <Image
//                 source={
//                   toggle ? images.checkWhiteLanguage : images.uncheckWhite
//                 }
//                 style={styles.checkboxImg}
//               />
//             </TouchableOpacity>
//           </View>
//           <EventTimeSelectItem
//             title={strings.starts}
//             toggle={!toggle}
//             date={
//               eventStartDateTime
//                 ? moment(eventStartDateTime).format('ll')
//                 : moment(new Date()).format('ll')
//             }
//             time={
//               eventStartDateTime
//                 ? moment(eventStartDateTime).format('h:mm a')
//                 : moment(new Date()).format('h:mm a')
//             }
//             onDatePress={() => setStartDateVisible(!startDateVisible)}
//           />
//           <EventTimeSelectItem
//             title={strings.ends}
//             toggle={!toggle}
//             date={
//               eventEndDateTime
//                 ? moment(eventEndDateTime).format('ll')
//                 : moment(new Date()).format('ll')
//             }
//             time={
//               eventEndDateTime
//                 ? moment(eventEndDateTime).format('h:mm a')
//                 : moment(new Date()).format('h:mm a')
//             }
//             containerStyle={{marginBottom: 8}}
//             onDatePress={() => setEndDateVisible(!endDateVisible)}
//           />
//           <EventMonthlySelection
//             title={strings.repeat}
//             dataSource={[
//               {label: 'Daily', value: 'Daily'},
//               {label: 'Weekly', value: 'Weekly'},
//               {label: 'Monthly', value: 'Monthly'},
//               {
//                 label: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
//                 value: `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`,
//               },
//               {
//                 label: `Monthly on ${new Date().getDate()}`,
//                 value: `Monthly on ${new Date().getDate()}`,
//               },
//               {label: 'Yearly', value: 'Yearly'},
//             ]}
//             // placeholder={strings.selectTimePlaceholder}
//             placeholder={'Does not repeat'}
//             value={selectWeekMonth}
//             onValueChange={(value) => {
//               setSelectWeekMonth(value);
//             }}
//           />
//           {selectWeekMonth !== '' && (
//             <EventTimeSelectItem
//               title={strings.until}
//               toggle={!toggle}
//               date={
//                 eventUntilDateTime
//                   ? moment(eventUntilDateTime).format('ll')
//                   : moment(new Date()).format('ll')
//               }
//               time={
//                 eventUntilDateTime
//                   ? moment(eventUntilDateTime).format('h:mm a')
//                   : moment(new Date()).format('h:mm a')
//               }
//               containerStyle={{marginBottom: 12}}
//               onDatePress={() => setUntilDateVisible(!untilDateVisible)}
//             />
//           )}
//         </EventItemRender>

//         <EventItemRender title={strings.place}>
//           <EventSearchLocation
//             onLocationPress={() => {
//               toggleModal();
//               navigation.navigate('SearchLocationScreen', {
//                 comeFrom: 'EditEventScreen',
//               });
//             }}
//             locationText={searchLocation}
//           />
//           <EventMapView
//             region={{
//               latitude: locationDetail
//                 ? Number(locationDetail.lat)
//                 : Number(latValue),
//               longitude: locationDetail
//                 ? Number(locationDetail.lng)
//                 : Number(longValue),
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//             coordinate={{
//               latitude: locationDetail
//                 ? Number(locationDetail.lat)
//                 : Number(latValue),
//               longitude: locationDetail
//                 ? Number(locationDetail.lng)
//                 : Number(longValue),
//             }}
//           />
//         </EventItemRender>

//         <EventItemRender
//           title={strings.availableTitle}
//           containerStyle={{marginTop: 10}}>
//           <Text style={styles.availableSubHeader}>
//             {strings.availableSubTitle}
//           </Text>
//           <BlockAvailableTabView
//             blocked={is_Blocked}
//             firstTabTitle={'Block'}
//             secondTabTitle={'Set available'}
//             onFirstTabPress={() => setIsBlocked(true)}
//             onSecondTabPress={() => setIsBlocked(false)}
//           />
//         </EventItemRender>
//         <EventItemRender title={strings.eventColorTitle}>
//           <FlatList
//             numColumns={Dimensions.get('window').width > 360 ? 9 : 8}
//             scrollEnabled={false}
//             data={eventColors}
//             ItemSeparatorComponent={() => <View style={{width: wp('1%')}} />}
//             renderItem={renderColorItem}
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </EventItemRender>
//         <DefaultColorModal
//           isModalVisible={isColorPickerModal}
//           onBackdropPress={() => setIsColorPickerModal(false)}
//           cancelImageSource={images.cancelImage}
//           containerStyle={{height: hp('55%')}}
//           onCancelImagePress={() => setIsColorPickerModal(false)}
//           headerCenterText={'Add color'}
//           onColorSelected={(selectColor) => {
//             // setAddColorDoneButton(true);
//             // const data = [...selectedEventColors];
//             // const obj = {
//             //   id: eventColors.length + data.length,
//             //   color: selectColor,
//             //   isSelected: false,
//             // };
//             // if (selectedEventColors.length === 0) {
//             //   setcounter(counter + 1);
//             //   data.push(obj);
//             //   setSelectedEventColors(data);
//             // } else {
//             //   const filterColor = selectedEventColors.filter((select_color_item) => selectColor === select_color_item.color);
//             //   if (filterColor.length === 0) {
//             //     setcounter(counter + 1);
//             //     data.push(obj);
//             //     setSelectedEventColors(data);
//             //   }
//             // }
//             setAddColorDoneButton(true);
//             setSelectedEventColors(selectColor);
//           }}
//           doneButtonDisplay={addColorDoneButton}
//           onDonePress={() => {
//             // const createdEventAddData = [...eventColors, ...selectedEventColors];
//             // Utility.setStorage('eventColor', createdEventAddData);
//             // setEventColors(createdEventAddData);
//             // setIsColorPickerModal(false);
//             eventColors[10] = {
//               id: 10,
//               color: selectedEventColors,
//               isSelected: false,
//               isNew: true,
//             };
//             setEventColors([...eventColors]);
//             setEventColors([...eventColors]);
//             setIsColorPickerModal(false);
//           }}
//           // flatListData={[...selectedEventColors, '0']}
//           // renderItem={({ item, index }) => {
//           //   if (index === selectedEventColors.length) {
//           //     return (
//           //       <EventColorItem
//           //         source={images.plus}
//           //       />
//           //     );
//           //   }
//           //   return (
//           //     <EventColorItem
//           //     source={item.isSelected ? images.check : null}
//           //     imageStyle={{ tintColor: colors.whiteColor }}
//           //     eventColorViewStyle={{
//           //       backgroundColor: item.color,
//           //       borderWidth: item.isSelected ? 2 : 0,
//           //       borderColor: colors.whiteColor,
//           //       marginRight: wp(3),
//           //     }}
//           //     />
//           //   );
//           // }}
//         />
//         <DateTimePickerView
//           visible={startDateVisible}
//           onDone={handleStateDatePress}
//           onCancel={handleCancelPress}
//           onHide={handleCancelPress}
//           date={eventStartDateTime}
//           minimumDate={new Date()}
//           minutesGap={5}
//           mode={toggle ? 'date' : 'datetime'}
//         />
//         <DateTimePickerView
//           visible={endDateVisible}
//           onDone={handleEndDatePress}
//           onCancel={handleCancelPress}
//           onHide={handleCancelPress}
//           date={eventEndDateTime}
//           minimumDate={eventEndDateTime || new Date()}
//           minutesGap={5}
//           mode={toggle ? 'date' : 'datetime'}
//         />
//         <DateTimePickerView
//           visible={untilDateVisible}
//           onDone={handleUntilDatePress}
//           onCancel={handleCancelPress}
//           onHide={handleCancelPress}
//           minimumDate={eventEndDateTime || new Date()}
//           minutesGap={5}
//           mode={toggle ? 'date' : 'datetime'}
//         />
//       </TCKeyboardView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainerStyle: {
//     flex: 1,
//   },
//   sperateLine: {
//     borderColor: colors.writePostSepratorColor,
//     borderWidth: 0.5,
//     marginVertical: hp('0.5%'),
//   },
//   backImageStyle: {
//     height: 20,
//     width: 16,
//     tintColor: colors.blackColor,
//     resizeMode: 'contain',
//   },
//   eventTextStyle: {
//     fontSize: 16,
//     fontFamily: fonts.RBold,
//     alignSelf: 'center',
//   },
//   toggleViewStyle: {
//     flexDirection: 'row',
//     marginHorizontal: 2,
//     justifyContent: 'flex-end',
//     paddingVertical: 3,
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   allDayText: {
//     fontSize: 16,
//     fontFamily: fonts.RRegular,
//     color: colors.lightBlackColor,
//     right: wp('8%'),
//   },
//   checkboxImg: {
//     width: wp('5.5%'),
//     resizeMode: 'contain',
//     alignSelf: 'center',
//   },
//   checkbox: {
//     alignSelf: 'center',
//     position: 'absolute',
//     right: wp(0),
//   },
// });

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
} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import ActionSheet from 'react-native-actionsheet';

import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import AuthContext from '../../../auth/context';
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
import TCProfileView from '../../../components/TCProfileView';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getLocationNameWithLatLong} from '../../../api/External';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import TCThinDivider from '../../../components/TCThinDivider';
import {getHitSlop, getNearDateTime, getSportName} from '../../../utils';
import NumberOfAttendees from '../../../components/Schedule/NumberOfAttendees';
import {getGroups} from '../../../api/Groups';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';
import uploadImages from '../../../utils/imageAction';
import {editEvent} from '../../../api/Schedule';

export default function EditEventScreen({navigation, route}) {
  console.log('EVENT DATA==>',route?.params?.data);
  let rule = 'Does not repeat';
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
    value: 0,
    text: 'Schedule only',
  });
  const [minAttendees, setMinAttendees] = useState(eventData.min_attendees);
  const [maxAttendees, setMaxAttendees] = useState(eventData.max_attendees);
  const [eventFee, setEventFee] = useState(eventData.event_fee.value);
  const [refundPolicy, setRefundPolicy] = useState(
    eventData.refund_policy ?? '',
  );
  const [toggle, setToggle] = useState(eventData.allDay);
  const [eventStartDateTime, setEventStartdateTime] = useState(
   
       new Date(eventData.start_datetime * 1000)
      ?? getNearDateTime(new Date()),
  );

  const [eventEndDateTime, setEventEnddateTime] = useState(
    
       new Date(eventData.end_datetime * 1000)
      ?? moment(eventStartDateTime).add(5, 'm').toDate(),
  );
  const [eventUntilDateTime, setEventUntildateTime] =
    useState(eventEndDateTime);
  const [searchLocation, setSearchLocation] = useState(
    eventData.location.location_name,
  );
  const [locationDetail, setLocationDetail] = useState(eventData.location);
  const [is_Blocked, setIsBlocked] = useState(false);
  const [loading, setloading] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleWhoModal, setVisibleWhoModal] = useState(false);
  const [sportsSelection, setSportsSelection] = useState(
    eventData?.selected_sport,
  );

  const [whoOpetion, setWhoOpetion] = useState();
  const [whoCanJoinOpetion, setWhoCanJoinOpetion] = useState({
    text: 'Everyone',
    value: 0,
  });
  const [whoCanSeeOpetion, setWhoCanSeeOpetion] = useState({
    text: 'Everyone',
    value: 0,
  });

  const [sportsData, setSportsData] = useState([]);
  const [groupsSeeList, setGroupsSeeList] = useState([]);
  const [groupsJoinList, setGroupsJoinList] = useState([]);

  const [isAll, setIsAll] = useState(false);

  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [selectWeekMonth, setSelectWeekMonth] = useState(rule);
  const [backgroundThumbnail, setBackgroundThumbnail] = useState(
    eventData.background_thumbnail,
  );
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);

  const whoCanDataSource = [
    {text: 'Everyone', value: 0},
    {text: 'Only me', value: 1},
    {
      text: 'Members in my groups',
      value: 2,
    },
    {
      text: 'Followers',
      value: 3,
    },
  ];
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{padding: 2, marginRight: 15}}
          onPress={onDonePress}>
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
  ]);

  useEffect(() => {
    if (isFocused) {
      getSports();
      if (route?.params?.locationName) {
        console.log('route.params.locationName', route.params.locationName);
        setSearchLocation(route.params.locationName);
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
              ...locationDetail,
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

        const groups = [...teams, ...clubs].map((obj) => ({
          ...obj,
          isSelected: false,
        }));
        setGroupsSeeList([...groups]);
        setGroupsJoinList([...groups]);

        setloading(false);
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

  const renderWhoCan = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          if (whoOpetion === 'see') {
            setWhoCanSeeOpetion(item);
          } else {
            setWhoCanJoinOpetion(item);
          }

          setTimeout(() => {
            setVisibleWhoModal(false);
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
          <Text style={styles.languageList}>{item.text}</Text>
          <View style={styles.checkbox}>
            {(whoOpetion === 'see' && whoCanSeeOpetion.value === item?.value) ||
            (whoOpetion === 'join' &&
              whoCanJoinOpetion.value === item?.value) ? (
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
  };

  const renderEventPostedOpetions = ({ item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 15,

          marginRight: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            setEventPosted(item);
          }}>
          <Image
            source={
              eventPosted.value === item.value
                ? images.checkRoundOrange
                : images.radioUnselect
            }
            style={styles.radioButtonStyle}
          />
        </TouchableOpacity>
        <Text style={styles.eventPostedTitle}>{item.text}</Text>
      </View>
    );
  };

  const renderSeeGroups = ({item, index}) => {
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
          groupsSeeList[index].isSelected = !groupsSeeList[index].isSelected;
          setGroupsSeeList([...groupsSeeList]);
          setIsAll(false);
        }}
      />
    );
  };

  const renderJoinGroups = ({item, index}) => {
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
          groupsJoinList[index].isSelected = !groupsJoinList[index].isSelected;
          setGroupsJoinList([...groupsJoinList]);
          setIsAll(false);
        }}
      />
    );
  };

  const onBGImageClicked = () => {
    setTimeout(() => {
      if (backgroundThumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  const openImagePicker = (width = 400, height = 400) => {
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

  const openCamera = (width = 400, height = 400) => {
    check(PERMISSIONS.IOS.CAMERA)
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
                  Alert.alert(e);
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
                Alert.alert(e);
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
      Alert.alert(strings.appName, 'Please Enter Event Title.');
      return false;
    }
    if (eventDescription === '') {
      Alert.alert(strings.appName, 'Please Enter Event Description.');
      return false;
    }
    if (eventStartDateTime === '') {
      Alert.alert(strings.appName, 'Please Select Event Start Date and Time.');
      return false;
    }
    if (eventEndDateTime === '') {
      Alert.alert(strings.appName, 'Please Select Event End Date and Time.');
      return false;
    }
    if (eventEndDateTime === '') {
      Alert.alert(strings.appName, 'Please Select Event End Date and Time.');
      return false;
    }
    if (!locationDetail?.venue_name || locationDetail?.venue_name?.length < 1) {
      Alert.alert(strings.appName, 'Please enter venue name.');
      return false;
    }
    if (
      !locationDetail?.venue_detail ||
      locationDetail?.venue_detail?.length < 1
    ) {
      Alert.alert(strings.appName, 'Please enter venue description.');
      return false;
    }

    if (Number(maxAttendees) === 0) {
      Alert.alert(
        strings.appName,
        'Please enter valid maximum attendees number(0 not allowed).',
      );
      return false;
    }
    if (Number(minAttendees) > Number(maxAttendees)) {
      Alert.alert(strings.appName, 'Please enter valid attendees number.');
      return false;
    }

    if (Number(eventFee) < 1) {
      Alert.alert(strings.appName, 'Please enter valid event fee amount.');
      return false;
    }
    if (refundPolicy.length < 1) {
      Alert.alert(
        strings.appName,
        'Please enter valid refund policy description.',
      );
      return false;
    }

    return true;
  }, [
    backgroundThumbnail,
    eventDescription,
    eventEndDateTime,
    eventFee,
    eventStartDateTime,
    eventTitle,
    locationDetail?.venue_detail,
    locationDetail?.venue_name,
    maxAttendees,
    minAttendees,
    refundPolicy.length,
  ]);

  const createEventDone = (data) => {
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole = entity.role === 'user' ? 'users' : 'groups';

    let ruleString = '';
    if (
      selectWeekMonth === 'Daily' ||
      selectWeekMonth === 'Weekly' ||
      selectWeekMonth === 'Monthly' ||
      selectWeekMonth === 'Yearly'
    ) {
      ruleString = selectWeekMonth.toUpperCase();
    } else if (
      selectWeekMonth ===
      `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`
    ) {
      ruleString = `MONTHLY;BYDAY=${getTodayDay()
        .substring(0, 2)
        .toUpperCase()};BYSETPOS=${countNumberOfWeeks()}`;
    } else if (
      selectWeekMonth ===
      `Monthly on ${ordinal_suffix_of(new Date().getDate())} day`
    ) {
      ruleString = `MONTHLY;BYMONTHDAY=${new Date().getDate()}`;
    }
    if (selectWeekMonth !== '') {
      data[0].untilDate = Number(
        parseFloat(new Date(eventUntilDateTime).getTime() / 1000).toFixed(0),
      );
      data[0].rrule = `FREQ=${ruleString}`;
    }

    console.log('DADADADAD', data);

    editEvent(entityRole, uid, data, authContext)
      .then((response) => {
        console.log('Response :-', response);
        setloading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        console.log('Error ::--', e);
        Alert.alert('', e.messages);
      });
  };

  const onDonePress = () => {
    if (checkValidation()) {
      setloading(true);
      const entity = authContext.entity;
      const entityRole = entity.role === 'user' ? 'users' : 'groups';
      const data = [
        {
          title: eventTitle,
          descriptions: eventDescription,
          background_thumbnail : eventData.background_thumbnail,
           background_full_image : eventData.background_full_image,
          allDay: toggle,
          start_datetime: Number(
            parseFloat(
              new Date(convertDateToUTC(eventStartDateTime)).getTime() / 1000,
            ).toFixed(0),
          ),
          end_datetime: Number(
            parseFloat(
              new Date(convertDateToUTC(eventEndDateTime)).getTime() / 1000,
            ).toFixed(0),
          ),
          is_recurring: selectWeekMonth !== '',
          blocked: is_Blocked,
          selected_sport: sportsSelection,
          who_can_see: {
            ...whoCanSeeOpetion,
          },
          who_can_join: {
            ...whoCanJoinOpetion,
          },
          event_posted_at: eventPosted,
          event_fee: {
            value: Number(eventFee),
            currency_type: 'CAD',
          },
          refund_policy: refundPolicy,
          min_attendees: Number(minAttendees),
          max_attendees: Number(maxAttendees),
          entity_type:
            authContext.entity.role === 'user'
              ? 'player'
              : authContext.entity.role,
          participants: [
            {
              entity_id:
                authContext.entity.obj.user_id ||
                authContext.entity.obj.group_id,
              entity_type: entityRole,
            },
          ],

          location: {
            location_name: searchLocation,
            latitude: locationDetail.lat,
            longitude: locationDetail.lng,
            venue_name: locationDetail.venue_name,
            venue_detail: locationDetail.venue_detail,
          },
        },
      ];

      if (whoCanSeeOpetion.value === 2) {
        const checkedGroup = groupsSeeList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === 'user') {
          data[0].who_can_see.group_ids = resultOfIds;
        } else {
          data[0].who_can_see.group_ids = [authContext.entity.uid];
        }
      }

      if (whoCanJoinOpetion.value === 2) {
        const checkedGroup = groupsJoinList.filter((obj) => obj.isSelected);
        const resultOfIds = checkedGroup.map((obj) => obj.group_id);
        if (authContext.entity.role === 'user') {
          data[0].who_can_join.group_ids = resultOfIds;
        } else {
          data[0].who_can_join.group_ids = [authContext.entity.uid];
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
            data[0].background_thumbnail = bgInfo.thumbnail;
            data[0].background_full_image = bgInfo.url;
            setBackgroundImageChanged(false);

            createEventDone(data);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          })
          .finally(() => {
            setloading(false);
          });
      } else {
        createEventDone(data);
      }
    }
  };

  return (
    <>
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
                  latitude: locationDetail.latitude ?? 0.0,
                  longitude: locationDetail.longitude ?? 0.0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                coordinate={{
                  latitude: locationDetail.latitude ?? 0.0,
                  longitude: locationDetail.longitude ?? 0.0,
                }}
              />
              <TextInput
                placeholder={'Details'}
                style={styles.detailsInputStyle}
                onChangeText={(value) => {
                  setLocationDetail({...locationDetail, venue_detail: value});
                }}
                value={locationDetail?.venue_detail}
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

              <TouchableOpacity
                onPress={() => {
                  setWhoOpetion('join');
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanJoinOpetion.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {whoCanJoinOpetion.value === 2 &&
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
                {strings.whereEventPosted}
              </Text>
              <FlatList
                scrollEnabled={false}
                data={eventPostedList}
                renderItem={renderEventPostedOpetions}
                style={{marginTop: 15}}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>{strings.whoCanSee}</Text>
              <TouchableOpacity
                onPress={() => {
                  setWhoOpetion('see');
                  setVisibleWhoModal(true);
                }}>
                <View style={styles.dropContainer}>
                  <Text style={styles.textInputDropStyle}>
                    {whoCanSeeOpetion.text}
                  </Text>
                  <Image
                    source={images.dropDownArrow}
                    style={styles.downArrowWhoCan}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {whoCanSeeOpetion.value === 2 &&
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

      <Modal
        isVisible={visibleWhoModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleWhoModal(false)}
        onRequestClose={() => setVisibleWhoModal(false)}
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
            data={whoCanDataSource}
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
            deleteImage();
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
});
