/* eslint-disable array-callback-return */
import React, {
  useCallback, useState, useEffect, useContext, useLayoutEffect,
  } from 'react';
 import {
   View,
   StyleSheet,
   FlatList,
   Image,
   TouchableOpacity,
   Text,
   TouchableWithoutFeedback,
   Platform,
   Dimensions,
   Alert,
   TextInput,
   KeyboardAvoidingView,
   ScrollView,
 } from 'react-native';

 // import ActivityLoader from '../../components/loader/ActivityLoader';

 import Modal from 'react-native-modal';
 import moment from 'moment';
 import Geolocation from '@react-native-community/geolocation';
 import * as Utils from '../../../challenge/manageChallenge/settingUtility';
 import AuthContext from '../../../../auth/context';

 import { getLocationNameWithLatLong } from '../../../../api/External';
 import * as Utility from '../../../../utils';
 import colors from '../../../../Constants/Colors';
 import images from '../../../../Constants/ImagePath';
 import { widthPercentageToDP } from '../../../../utils';
 import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';
 import fonts from '../../../../Constants/Fonts';
 import TCThinDivider from '../../../../components/TCThinDivider';

 import strings from '../../../../Constants/String';
 import { getUserIndex } from '../../../../api/elasticSearch';
 import RenderScorekeeper from './RenderScorekeeper';
 import TCTagsFilter from '../../../../components/TCTagsFilter';
 import ActivityLoader from '../../../../components/loader/ActivityLoader';

 let stopFetchMore = true;
 const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

 export default function BookScorekeeper({ navigation, route }) {
   const gameData = route?.params?.gameData;

   const [loading, setLoading] = useState(false);
   const authContext = useContext(AuthContext);
   const [filters, setFilters] = useState(route?.params?.filters);

   const [settingPopup, setSettingPopup] = useState(false);
   const [locationFilterOpetion, setLocationFilterOpetion] = useState(0);

   const [datePickerFor, setDatePickerFor] = useState();
   const [show, setShow] = useState(false);
   const [fromDate, setFromDate] = useState();
   const [toDate, setToDate] = useState();
   const [minFee, setMinFee] = useState(0);
   const [maxFee, setMaxFee] = useState(0);
   const [scorekeepers, setScorekeepers] = useState([]);
   const [pageSize] = useState(10);
   const [pageFrom, setPageFrom] = useState(0);
   // eslint-disable-next-line no-unused-vars
   const [loadMore, setLoadMore] = useState(false);
   const [searchData, setSearchData] = useState();

   const [location, setLocation] = useState(route?.params?.filters.location);
   const [selectedScorekeeper, setSelectedScorekeeper] = useState(null);

   console.log('Scorekeeper Filter:=>', filters);

   useLayoutEffect(() => {
     navigation.setOptions({
       headerRight: () => (
         <Text style={styles.nextButtonStyle} onPress={() => onPressNext()}>
           {selectedScorekeeper !== null ? 'Next' : ''}
         </Text>
       ),
     });
   }, [navigation, selectedScorekeeper]);

   useEffect(() => {
     if (route?.params?.locationText) {
       setSettingPopup(true);
       setTimeout(() => {
         setLocation(route?.params?.locationText);
         // setFilters({
         //   ...filters,
         //   location: route?.params?.locationText,
         // });
       }, 10);
       // navigation.setParams({ locationText: null });
     }
   }, [route?.params?.locationText]);

   const getScorekeepers = useCallback(
     (filerScorekeeper) => {
       const scorekeeperQuery = {
         size: pageSize,
         from: pageFrom,
         query: {
           bool: {
             must: [{ term: { 'scorekeeper_data.is_published': true } }],
           },
         },
       };
       if (filerScorekeeper.location !== 'world') {
        scorekeeperQuery.query.bool.must.push({
           multi_match: {
             query: `${filerScorekeeper.location.toLowerCase()}`,
             fields: ['city', 'country', 'state'],
           },
         });
       }
       if (route?.params?.sport) {
        scorekeeperQuery.query.bool.must.push({
           term: {
             'scorekeeper_data.sport_name.keyword': {
               value: `${route?.params?.sport?.toLowerCase()}`,
               case_insensitive: true,
             },
           },
         });
       }
       if (filerScorekeeper.scorekeeperFee) {
        scorekeeperQuery.query.bool.must.push({
           range: {
             'scorekeeper_data.setting.game_fee.fee': {
               gte: Number(filerScorekeeper.scorekeeperFee.split('-')[0]),
               lte: Number(filerScorekeeper.scorekeeperFee.split('-')[1]),
               boost: 2.0,
             },
           },
         });
       }

       console.log('ScorekeeperQuery:=>', JSON.stringify(scorekeeperQuery));

       // Scorekeeper query

       getUserIndex(scorekeeperQuery)
         .then((res) => {
           if (res.length > 0) {
             const fetchedData = [...scorekeepers, ...res];
             setScorekeepers(fetchedData);
             setSearchData(fetchedData);
             setPageFrom(pageFrom + pageSize);
             stopFetchMore = true;
           }
         })
         .catch((e) => {
           setTimeout(() => {
             Alert.alert(strings.alertmessagetitle, e);
           }, 10);
         });
     },
     [pageFrom, pageSize, scorekeepers],
   );

   useEffect(() => {
     getScorekeepers(filters);
   }, []);

 const onPressNext = () => {
   console.log('gameData:=>', gameData);
   if (gameData?.scorekeepers) {
     if (
       gameData?.scorekeepers?.length
       < gameData?.challenge_scorekeepers?.who_secure?.length
     ) {
       setLoading(true);
       Utils.getSetting(
         selectedScorekeeper?.user_id,
         'scorekeeper',
         gameData.sport,
         authContext,
       )
         .then((response) => {
           setLoading(false);
           console.log('res3:::=>', response);
           if (
             response?.scorekeeperAvailibility
             && response?.game_fee
             && response?.refund_policy
             && response?.available_area
           ) {
             navigation.navigate('ScorekeeperBookingDateAndTime', {
               settingObj: response,
               userData: selectedScorekeeper,
               navigationName: 'HomeScreen',
               gameData,
             });
           } else {
             setTimeout(() => {
               Alert.alert('Scorekeeper setting not configured yet.');
             }, 10);
           }
         })
         .catch(() => {
           setLoading(false);
           setTimeout(() => {
             Alert.alert(
               strings.alertmessagetitle,
               strings.defaultError,
             );
           }, 10);
           // navigation.goBack();
         });
     } else {
       Alert.alert(
         'Towns Cup',
         `You can't book more than ${gameData?.challenge_scorekeepers?.who_secure?.length} scorekeeper for this match. You can change the number of scorekeepers in the reservation details.`,
       );
     }
   } else if (
     gameData?.challenge_scorekeepers?.who_secure?.length > 0
   ) {
     setLoading(true);
     Utils.getSetting(
       selectedScorekeeper?.user_id,
       'scorekeeper',
       gameData.sport,
       authContext,
     )
       .then((response) => {
         setLoading(false);
         console.log('res3:::=>', response);
         if (
           response?.scorekeeperAvailibility
           && response?.game_fee
           && response?.refund_policy
           && response?.available_area
         ) {
           navigation.navigate('ScorekeeperBookingDateAndTime', {
             settingObj: response,
             userData: selectedScorekeeper,
             navigationName: 'HomeScreen',
             gameData,
           });
         } else {
           setTimeout(() => {
             Alert.alert('Scorekeeper setting not configured yet.');
           }, 10);
         }
       })
       .catch(() => {
         setLoading(false);
         setTimeout(() => {
           Alert.alert(
             strings.alertmessagetitle,
             strings.defaultError,
           );
         }, 10);
         // navigation.goBack();
       });
   } else {
     Alert.alert(
       'Towns Cup',
       `You can’t book more than ${gameData?.challenge_scorekeepers?.who_secure?.length} scorekeeper for this match. You can change the number of scorekeepers in the reservation details.`,
     );
   }
 }

   const renderScorekeeperData = ({ item }) => {
     const scorekeeper = item;
     const scorekeeperObject = scorekeeper?.scorekeeper_data?.filter(
       (scorekeeperItem) => scorekeeperItem?.sport_name?.toLowerCase()
         === gameData?.sport?.toLowerCase(),
     );

     console.log('setting1:=>', scorekeeperObject);
     return (
       <TouchableOpacity onPress={() => setSelectedScorekeeper(scorekeeper)}>
         <RenderScorekeeper
           data={item}
           showStar={true}
           sport={route?.params?.sport}
           isSelected={scorekeeper?.user_id === selectedScorekeeper?.user_id}
           onRadioClick={() => setSelectedScorekeeper(scorekeeper)}
         />
       </TouchableOpacity>
     );
   };

   const keyExtractor = useCallback((item, index) => index.toString(), []);

   const handleDonePress = (date) => {
     if (datePickerFor === 'from') {
       setFromDate(new Date(date));
     } else {
       setToDate(new Date(date));
     }
     setShow(!show);
   };
   const handleCancelPress = () => {
     setShow(false);
   };

   const onScrollHandler = () => {
     setLoadMore(true);
     if (!stopFetchMore) {
       getScorekeepers(filters);
       stopFetchMore = true;
     }
     setLoadMore(false);
   };
   const handleTagPress = ({ item }) => {
     const tempFilter = filters;
     Object.keys(tempFilter).forEach((key) => {
       if (key === Object.keys(item)[0]) {
         if (Object.keys(item)[0] === 'location') {
           tempFilter.location = 'world';
         }
         if (Object.keys(item)[0] === 'scorekeeperFee') {
           delete tempFilter.scorekeeperFee;
         }

         // delete tempFilter[key];
       }
     });
     console.log('Temp filter', tempFilter);
     setFilters({ ...tempFilter });
     // applyFilter();
     setTimeout(() => {
       setPageFrom(0);
       setScorekeepers([]);
       applyFilter(tempFilter);
     }, 10);
   };

   const getLocation = () => {
     Geolocation.getCurrentPosition(
       (position) => {
         console.log('Lat/long to position::=>', position);
         // const position = { coords: { latitude: 49.11637199697782, longitude: -122.7776695216056 } }
         getLocationNameWithLatLong(
           position.coords.latitude,
           position.coords.longitude,
           authContext,
         ).then((res) => {
           console.log(
             'Lat/long to address::=>',
             res.results[0].address_components,
           );
           let city;
           res.results[0].address_components.map((e) => {
             if (e.types.includes('administrative_area_level_2')) {
               city = e.short_name;
             }
           });
           console.log(
             'Location:=>',
             city.charAt(0).toUpperCase() + city.slice(1),
           );
           setLocation(city.charAt(0).toUpperCase() + city.slice(1));
           // setFilters({
           //   ...filters,
           //   location: city.charAt(0).toUpperCase() + city.slice(1),
           // });
         });
         console.log(position.coords.latitude);
       },
       (error) => {
         // See error code charts below.
         console.log(error.code, error.message);
       },
       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
     );
   };

   const applyFilter = useCallback((fil) => {
     getScorekeepers(fil);
   }, []);

   const applyValidation = useCallback(() => {
     if (Number(minFee) > 0 && Number(maxFee) <= 0) {
       Alert.alert('Please enter correct scorekeeper max fee.');
       return false;
     }
     if (Number(minFee) <= 0 && Number(maxFee) > 0) {
       Alert.alert('Please enter correct scorekeeper min fee.');
       return false;
     }
     if (Number(minFee) > Number(maxFee)) {
       Alert.alert('Please enter correct scorekeeper fee.');
       return false;
     }
     return true;
   }, [maxFee, minFee]);
   const listEmptyComponent = () => (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Text
         style={{
           fontFamily: fonts.RRegular,
           color: colors.grayColor,
           fontSize: 26,
         }}>
         No Scorekeepers
       </Text>
     </View>
   );
   const searchFilterFunction = (text) => {
     const result = scorekeepers.filter(
       (x) => x.full_name.toLowerCase().includes(text.toLowerCase())
         || x.city.toLowerCase().includes(text.toLowerCase()),
     );
     if (text.length > 0) {
       setScorekeepers(result);
     } else {
       setScorekeepers(searchData);
     }
   };

   const onPressReset = () => {
    setFilters({
      location: 'world',
      sport: 'All',
    });

    setMinFee(0);
    setMaxFee(0);
  };
   return (
     <View>
       <ActivityLoader visible={loading} />

       <View style={styles.searchView}>
         <View style={styles.searchViewContainer}>
           <TextInput
             placeholder={strings.searchText}
             style={styles.searchTxt}
             onChangeText={(text) => {
               searchFilterFunction(text);
             }}
             // value={search}
           />
           <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
             <Image source={images.homeSetting} style={styles.settingImage} />
           </TouchableWithoutFeedback>
         </View>
       </View>
       <TCTagsFilter
         dataSource={Utility.getFiltersOpetions(filters)}
         onTagCancelPress={handleTagPress}
       />
       <FlatList
         extraData={scorekeepers}
         showsHorizontalScrollIndicator={false}
         data={scorekeepers}
         keyExtractor={keyExtractor}
         renderItem={renderScorekeeperData}
         style={styles.listStyle}
         contentContainerStyle={{ paddingBottom: 1 }}
         onEndReached={onScrollHandler}
         onEndReachedThreshold={0.01}
         onScrollBeginDrag={() => {
           stopFetchMore = false;
         }}
         ListEmptyComponent={listEmptyComponent}
       />
       <Modal
         onBackdropPress={() => setSettingPopup(false)}
         backdropOpacity={1}
         animationType="slide"
         hasBackdrop
         style={{
           flex: 1,
           margin: 0,
           backgroundColor: colors.blackOpacityColor,
         }}
         visible={settingPopup}>
         <View
           style={[
             styles.bottomPopupContainer,
             { height: Dimensions.get('window').height - 100 },
           ]}>
           <KeyboardAvoidingView
             style={{ flex: 1 }}
             keyboardVerticalOffset={keyboardVerticalOffset}
             behavior={Platform.OS === 'ios' ? 'padding' : null}>
             <ScrollView style={{ flex: 1 }}>
               <View style={styles.viewsContainer}>
                 <Text
                   onPress={() => setSettingPopup(false)}
                   style={styles.cancelText}>
                   Cancel
                 </Text>
                 <Text style={styles.locationText}>Filter</Text>
                 <Text
                   style={styles.doneText}
                   onPress={() => {
                     if (applyValidation()) {
                       setSettingPopup(false);
                       setTimeout(() => {
                         const tempFilter = { ...filters };
                         // tempFilter.sport = selectedSport;
                         tempFilter.location = location;

                         if (minFee && maxFee) {
                           tempFilter.scorekeeperFee = `${minFee}-${maxFee}`;
                         }
                         setFilters({
                           ...tempFilter,
                         });
                         setPageFrom(0);
                         setScorekeepers([]);
                         applyFilter(tempFilter);
                       }, 100);
                       console.log('DONE::');
                     }
                   }}>
                   {'Apply'}
                 </Text>
               </View>
               <TCThinDivider width={'100%'} marginBottom={15} />
               <View>
                 <View style={{ flexDirection: 'column', margin: 15 }}>
                   <View>
                     <Text style={styles.filterTitle}>Location</Text>
                   </View>
                   <View style={{ marginTop: 10, marginLeft: 10 }}>
                     <View
                       style={{
                         flexDirection: 'row',
                         marginBottom: 10,
                         justifyContent: 'space-between',
                       }}>
                       <Text style={styles.filterTitle}>World</Text>
                       <TouchableWithoutFeedback
                         onPress={() => {
                           setLocationFilterOpetion(0);
                           setLocation('world');
                           // setFilters({
                           //   ...filters,
                           //   location: 'world',
                           // });
                         }}>
                         <Image
                           source={
                             locationFilterOpetion === 0
                               ? images.checkRoundOrange
                               : images.radioUnselect
                           }
                           style={styles.radioButtonStyle}
                         />
                       </TouchableWithoutFeedback>
                     </View>
                     <View
                       style={{
                         flexDirection: 'row',
                         marginBottom: 10,
                         justifyContent: 'space-between',
                       }}>
                       <Text style={styles.filterTitle}>Home City</Text>
                       <TouchableWithoutFeedback
                         onPress={() => {
                           setLocationFilterOpetion(1);
                           setLocation(
                             authContext?.entity?.obj?.city
                               .charAt(0)
                               .toUpperCase()
                               + authContext?.entity?.obj?.city.slice(1),
                           );
                           // setFilters({
                           //   ...filters,
                           //   location:
                           //     authContext?.entity?.obj?.city
                           //       .charAt(0)
                           //       .toUpperCase()
                           //     + authContext?.entity?.obj?.city.slice(1),
                           // });
                         }}>
                         <Image
                           source={
                             locationFilterOpetion === 1
                               ? images.checkRoundOrange
                               : images.radioUnselect
                           }
                           style={styles.radioButtonStyle}
                         />
                       </TouchableWithoutFeedback>
                     </View>
                     <View
                       style={{
                         flexDirection: 'row',
                         marginBottom: 10,
                         justifyContent: 'space-between',
                       }}>
                       <Text style={styles.filterTitle}>Current City</Text>
                       <TouchableWithoutFeedback
                         onPress={() => {
                           setLocationFilterOpetion(2);
                           getLocation();
                         }}>
                         <Image
                           source={
                             locationFilterOpetion === 2
                               ? images.checkRoundOrange
                               : images.radioUnselect
                           }
                           style={styles.radioButtonStyle}
                         />
                       </TouchableWithoutFeedback>
                     </View>

                     <TouchableWithoutFeedback
                       onPress={() => {
                         setLocationFilterOpetion(3);
                         setSettingPopup(false);
                         navigation.navigate('SearchCityScreen', {
                           comeFrom: 'BookScorekeeper',
                         });
                       }}>
                       <View
                         style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between',
                         }}>
                         {/* <TCSearchCityView
                      getCity={(value) => {
                        console.log('Value:=>', value);
                        setSelectedCity(value);
                      }}
                      // value={selectedCity}
                    /> */}

                         <View style={styles.searchCityContainer}>
                           <Text style={styles.searchCityText}>
                             {route?.params?.locationText || 'Search City'}
                           </Text>
                         </View>
                         <View
                           style={{
                             alignSelf: 'center',
                           }}>
                           <Image
                             source={
                               locationFilterOpetion === 3
                                 ? images.checkRoundOrange
                                 : images.radioUnselect
                             }
                             style={styles.radioButtonStyle}
                           />
                         </View>
                       </View>
                     </TouchableWithoutFeedback>
                   </View>
                 </View>

                 <View style={{ flexDirection: 'column', margin: 15 }}>
                   <View>
                     <Text style={styles.filterTitle}>Available Time</Text>
                   </View>
                   <View style={{ marginTop: 10 }}>
                     <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                       <TouchableOpacity
                         style={styles.fieldView}
                         onPress={() => {
                           setDatePickerFor('from');
                           setShow(!show);
                         }}>
                         <View
                           style={{
                             height: 35,
                             justifyContent: 'center',
                           }}>
                           <Text style={styles.fieldTitle} numberOfLines={1}>
                             From
                           </Text>
                         </View>
                         <View style={{ marginRight: 15, flexDirection: 'row' }}>
                           <Text style={styles.fieldValue} numberOfLines={1}>
                             {moment(fromDate).format('MMM DD, YYYY')} {'   '}
                           </Text>
                           <Text style={styles.fieldValue} numberOfLines={1}>
                             {moment(fromDate).format('h:mm a')}
                           </Text>
                         </View>
                       </TouchableOpacity>
                     </View>
                     <View style={{ flexDirection: 'row' }}>
                       <TouchableOpacity
                         style={styles.fieldView}
                         onPress={() => {
                           setDatePickerFor('to');
                           setShow(!show);
                         }}>
                         <View
                           style={{
                             height: 35,
                             justifyContent: 'center',
                           }}>
                           <Text style={styles.fieldTitle} numberOfLines={1}>
                             To
                           </Text>
                         </View>
                         <View style={{ marginRight: 15, flexDirection: 'row' }}>
                           <Text style={styles.fieldValue} numberOfLines={1}>
                             {moment(toDate).format('MMM DD, YYYY')} {'   '}
                           </Text>
                           <Text style={styles.fieldValue} numberOfLines={1}>
                             {moment(toDate).format('h:mm a')}
                           </Text>
                         </View>
                       </TouchableOpacity>
                     </View>
                     <Text
                       style={{
                         fontSize: 12,
                         fontFamily: fonts.RLight,
                         color: colors.lightBlackColor,
                         textAlign: 'right',
                         marginTop: 10,
                       }}>
                       Time zone{' '}
                       <Text
                         style={{
                           fontSize: 12,
                           fontFamily: fonts.RRegular,
                           color: colors.lightBlackColor,
                           textDecorationLine: 'underline',
                         }}>
                         Vancouver
                       </Text>
                     </Text>
                   </View>
                 </View>
               </View>
               {/* Rate View */}
               {/* <View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 15,
                  marginTop: 0,
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 0.2 }}>
                  <Text style={styles.filterTitle}>Rating</Text>
                </View>
                <View
                  style={{
                    marginLeft: 15,
                    flex: 0.6,
                    alignSelf: 'flex-end',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.minMaxTitle}>Min</Text>
                    <AirbnbRating
                      count={5}
                      fractions={1}
                      showRating={false}
                      defaultRating={0}
                      size={20}
                      isDisabled={false}
                      selectedColor={'#f49c20'}
                    />
                    <Text style={styles.starCount}>2.0</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.minMaxTitle}>Max</Text>
                    <AirbnbRating
                      count={5}
                      fractions={1}
                      showRating={false}
                      defaultRating={0}
                      size={20}
                      isDisabled={false}
                      selectedColor={'#f49c20'}
                    />
                    <Text style={styles.starCount}>2.0</Text>
                  </View>
                </View>
              </View>

            </View> */}
               {/* Rate View */}

               <View
                   style={{
                     flexDirection: 'column',
                     margin: 15,
                     justifyContent: 'space-between',
                   }}>
                 <View style={{}}>
                   <Text style={styles.filterTitle}>Scorekeeper fee</Text>
                 </View>
                 <View style={{ marginTop: 10 }}>
                   <View
                       style={{
                         flexDirection: 'row',
                         justifyContent: 'space-between',
                       }}>
                     <TextInput
                         onChangeText={(text) => setMinFee(text)}
                         value={minFee}
                         style={styles.minFee}
                         placeholder={'Min'}
                         autoCorrect={false}
                         // clearButtonMode={'always'}
                         keyboardType={'numeric'}
                         placeholderTextColor={colors.userPostTimeColor}
                       />
                     <TextInput
                         onChangeText={(text) => setMaxFee(text)}
                         value={maxFee}
                         style={styles.minFee}
                         placeholder={'Max'}
                         autoCorrect={false}
                         // clearButtonMode={'always'}
                         keyboardType={'numeric'}
                         placeholderTextColor={colors.userPostTimeColor}
                       />
                   </View>
                 </View>
               </View>

               <View style={{ flex: 1 }} />
             </ScrollView>
           </KeyboardAvoidingView>

           <TouchableOpacity style={styles.resetButton} onPress={() => {
             Alert.alert(
              'Are you sure want to reset filters?',
              '',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => onPressReset(),
                },
              ],
              { cancelable: false },
            );
           }}>
             <Text style={styles.resetTitle}>Reset</Text>
           </TouchableOpacity>
         </View>
         <DateTimePickerView
           date={new Date()}
           visible={show}
           onDone={handleDonePress}
           onCancel={handleCancelPress}
           onHide={handleCancelPress}
           // minutesGap={30}
           mode={'datetime'}
         />
       </Modal>
     </View>
   );
 }
 const styles = StyleSheet.create({
   listStyle: {
     padding: 15,
   },

   searchViewContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     height: 40,
     width: widthPercentageToDP('92%'),
     borderRadius: 20,
     shadowColor: colors.grayColor,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.2,
     shadowRadius: 1,
     elevation: 2,
     backgroundColor: colors.offwhite,
   },
   settingImage: {
     height: 20,
     width: 20,
     resizeMode: 'cover',
     alignSelf: 'center',
     marginRight: 15,
   },
   searchView: {
     backgroundColor: colors.grayBackgroundColor,
     height: 55,
     alignItems: 'center',
     justifyContent: 'center',
   },

   radioButtonStyle: {
     height: 22,
     width: 22,
     resizeMode: 'cover',
     alignSelf: 'center',
   },

   filterTitle: {
     fontSize: 16,
     fontFamily: fonts.RRegular,
     color: colors.lightBlackColor,
   },
   // minMaxTitle: {
   //   fontSize: 16,
   //   fontFamily: fonts.RRegular,
   //   color: colors.userPostTimeColor,
   //   marginRight: 15,
   // },
   // starCount: {
   //   fontSize: 16,
   //   fontFamily: fonts.RMedium,
   //   color: colors.themeColor,
   //   marginLeft: 15,
   // },
   bottomPopupContainer: {
     flex: 1,
     paddingBottom: Platform.OS === 'ios' ? 34 : 0,
     backgroundColor: colors.whiteColor,
     borderTopLeftRadius: 30,
     borderTopRightRadius: 30,
     position: 'absolute',
     bottom: 0,
     width: '100%',

     ...Platform.select({
       ios: {
         shadowColor: colors.googleColor,
         shadowOffset: { width: 0, height: 3 },
         shadowOpacity: 0.5,
         shadowRadius: 8,
       },
       android: {
         elevation: 15,
       },
     }),
   },

   doneText: {
     fontSize: 16,
     fontFamily: fonts.RRegular,
     color: colors.themeColor,
   },
   locationText: {
     fontSize: 16,
     fontFamily: fonts.RMedium,
     color: colors.lightBlackColor,
   },
   cancelText: {
     fontSize: 16,
     fontFamily: fonts.RRegular,
     color: colors.veryLightGray,
   },
   viewsContainer: {
     height: 60,
     justifyContent: 'space-between',
     flexDirection: 'row',
     alignItems: 'center',
     marginLeft: 20,
     marginRight: 20,
   },
   fieldView: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     flex: 1,
     height: 40,
     alignItems: 'center',
     backgroundColor: colors.offwhite,
     borderRadius: 5,
     shadowColor: colors.grayColor,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.3,
     shadowRadius: 1,
     elevation: 1,
   },
   fieldTitle: {
     fontSize: 16,
     color: colors.lightBlackColor,
     fontFamily: fonts.RLight,
     marginLeft: 10,
   },
   fieldValue: {
     fontSize: 16,
     color: colors.lightBlackColor,
     fontFamily: fonts.RRegular,
     textAlign: 'center',
   },
   resetButton: {
     alignSelf: 'center',
     backgroundColor: colors.whiteColor,
     borderRadius: 5,
     elevation: 5,
     height: 30,
     width: 113,
     shadowOpacity: 0.16,
     flexDirection: 'row',
     shadowColor: colors.grayColor,
     shadowOffset: { width: 0, height: 5 },
     shadowRadius: 5,
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: 15,
   },
   resetTitle: {
     fontSize: 12,
     fontFamily: fonts.RMedium,
     color: colors.lightBlackColor,
     alignSelf: 'center',
     // margin: 15,
   },

   searchCityContainer: {
     backgroundColor: colors.offwhite,
     borderRadius: 5,
     height: 40,
     paddingLeft: 15,
     paddingRight: 15,
     width: widthPercentageToDP('75%'),
     shadowColor: colors.googleColor,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.2,
     shadowRadius: 1,
     elevation: 2,
     justifyContent: 'center',
   },
   minFee: {
     backgroundColor: colors.offwhite,
     borderRadius: 5,
     height: 40,
     paddingLeft: 15,
     paddingRight: 15,
     width: widthPercentageToDP('45%'),
     shadowColor: colors.googleColor,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.2,
     shadowRadius: 1,
     elevation: 2,
     justifyContent: 'center',
     textAlign: 'center',
     fontSize: 16,
     fontFamily: fonts.RRegular,
     color: colors.lightBlackColor,
   },
   searchCityText: {
     fontFamily: fonts.RRegular,
     fontSize: 16,
     color: colors.lightBlackColor,
   },
   searchTxt: {
     marginLeft: 15,
     fontSize: widthPercentageToDP('3.8%'),
     width: widthPercentageToDP('75%'),
   },
   nextButtonStyle: {
     fontFamily: fonts.RRegular,
     fontSize: 16,
     marginRight: 15,
   },
 });
