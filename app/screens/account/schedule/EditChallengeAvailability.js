/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import AddTimeItem from '../../../components/Schedule/AddTimeItem';
import {editSlots} from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import BlockAvailableTabView from '../../../components/Schedule/BlockAvailableTabView';
import EventTimeSelectItem from '../../../components/Schedule/EventTimeSelectItem';
import EventMonthlySelection from '../../../components/Schedule/EventMonthlySelection';

export default function EditChallengeAvailability({navigation}) {
  const authContext = useContext(AuthContext);
  const [challengeAvailable, setChallengeAvailable] = useState([
    {
      id: 0,
      isBlock: false,
      allDay: false,
      start_datetime: new Date(),
      end_datetime:  new Date(),
      is_recurring: false,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const [untilDateVisible, setUntilDateVisible] = useState(false);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  
  const deleteItemById = (id) => {
    const filteredData = challengeAvailable.filter((item) => item.id !== id);
    setChallengeAvailable(filteredData);

  };

  const handleCancelPress = () => {
    setStartDateVisible(false);
    setEndDateVisible(false);
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

  const getTodayDay = () => {
    const dt = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    return dt.format('dddd');
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



  return (
    <KeyboardAvoidingView
      style={styles.mainContainerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />

      <Header
        leftComponent={
          <TouchableOpacity onPress={() => {
            Alert.alert(
              'Are you sure you want to quit to edit challenge availibility?',
              '',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Quit', 
                  onPress: () => navigation.goBack()
                },
              ],
              {cancelable: false},
            );
          }}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Edit Challenge Availability</Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{padding: 2}}
            onPress={ () => {
              setLoading(true);
              const entity = authContext.entity;
              const uid = entity.uid || entity.auth.user_id;
              const entityRole = entity.role === 'user' ? 'users' : 'groups';
              const filterData = [];
              let obj = {};
              challengeAvailable.map((challenge_item) => {
                console.log(
                  'new Date(challenge_item.startDateTime)',
                  new Date(challenge_item.start_datetime),
                );

                obj = {
                  blocked: challenge_item.isBlock,
                  allDay: challenge_item.allDay,
                  start_datetime:
                    Number(parseFloat(new Date(challenge_item.start_datetime).getTime() / 1000).toFixed(0)),
                  end_datetime:
                    Number(parseFloat(new Date(challenge_item.end_datetime).getTime() / 1000).toFixed(0)),
                  is_recurring: challenge_item.is_recurring,
                };

                let rule = '';
                if (
                  challenge_item.repeat === 'Daily' ||
                  challenge_item.repeat === 'Weekly' ||
                  challenge_item.repeat === 'Monthly' ||
                  challenge_item.repeat === 'Yearly'
                ) {
                  rule = challenge_item.repeat.toUpperCase();
                } else if (
                  challenge_item.repeat ===
                  `Monthly on ${countNumberOfWeekFromDay()} ${getTodayDay()}`
                ) {
                  rule = `MONTHLY;BYDAY=${getTodayDay()
                    .substring(0, 2)
                    .toUpperCase()};BYSETPOS=${countNumberOfWeeks()}`;
                } else if (
                  challenge_item.repeat ===
                  `Monthly on ${ordinal_suffix_of(new Date().getDate())} day`
                ) {
                  rule = `MONTHLY;BYMONTHDAY=${new Date().getDate()}`;
                }
                if (challenge_item.is_recurring === true) {
                  obj.untilDate = Number(
                    parseFloat(
                      new Date(challenge_item.untilDate).getTime() / 1000,
                    ).toFixed(0),
                  );
                  obj.rrule = `FREQ=${rule}`;
                }

                filterData.push(obj);
               
              });

              console.log('Entity role', entityRole);
              console.log('filterData', filterData);

              
              editSlots(entityRole, uid, filterData, authContext)
                .then(() => {
                  setTimeout(() => {
                    setLoading(false);
                    navigation.goBack();
                  }, 5000);
                })
                .catch((error) => {
                  setLoading(false);
                  console.log('Error ::--', error);
                });
            }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <ScrollView bounces={false}>
        <SafeAreaView>
          <EventItemRender title={strings.editChallengeTitle}>
            <FlatList
              data={challengeAvailable}
              showsHorizontalScrollIndicator={false}
              renderItem={({item : data, index}) => {
                
                console.log('item challenge:', data);
                return (
                  <View style={{marginTop: 10}}>
                    <View style={styles.toggleViewStyle}>
                      <Text
                        style={styles.deleteTextStyle}
                        onPress={() => {
                          deleteItemById(data.id);
                        }}>
                        Delete
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.allDayText}>{strings.allDay}</Text>
                        <TouchableOpacity
                          style={styles.checkbox}
                          onPress={() => {
                            const tempChallenge = [...challengeAvailable];
                            tempChallenge[index].allDay = !tempChallenge[index].allDay;
                            setChallengeAvailable(tempChallenge);
                          }}>
                          <Image
                            source={
                              challengeAvailable[index].allDay
                                ? images.checkWhiteLanguage
                                : images.uncheckWhite
                            }
                            style={styles.checkboxImg}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <EventTimeSelectItem
                      title={strings.starts}
                      toggle={!challengeAvailable[index].allDay}
                      headerTextStyle={{paddingLeft: 0}}
                      date={
                        challengeAvailable[index].start_datetime
                          ? moment(new Date( challengeAvailable[index].start_datetime)).format('ll')
                          : moment(new Date()).format('ll')
                      }
                      time={
                        challengeAvailable[index].start_datetime
                          ? moment(new Date( challengeAvailable[index].start_datetime)).format('h:mm a')
                          : moment(new Date()).format('h:mm a')
                      }
                      onDatePress={() => setStartDateVisible(!startDateVisible)}
                    />
                    <EventTimeSelectItem
                      title={strings.ends}
                      toggle={!challengeAvailable[index].allDay}
                      headerTextStyle={{paddingLeft: 0}}
                      date={
                        challengeAvailable[index].end_datetime
                          ? moment(new Date(challengeAvailable[index].end_datetime)).format('ll')
                          : moment(new Date()).format('ll')
                      }
                      time={
                        challengeAvailable[index].end_datetime
                          ? moment(new Date(challengeAvailable[index].end_datetime)).format('h:mm a')
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
                      value={challengeAvailable[index].repeat}
                      onValueChange={(value) => {
                        console.log('LLLLLLL---',value);
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].is_recurring = value !== '';
                        tempChallenge[index].repeat = value;
                        setChallengeAvailable(tempChallenge);
                        
                        
                      }}
                    />
                    {challengeAvailable[index].is_recurring === true && (
                      <EventTimeSelectItem
                        title={strings.until}
                        toggle={!challengeAvailable[index].allDay}
                        date={
                          challengeAvailable[index].untilDate
                            ? moment(challengeAvailable[index].untilDate).format('ll')
                            : moment(new Date()).format('ll')
                        }
                        time={
                          challengeAvailable[index].untilDate
                            ? moment(challengeAvailable[index].untilDate).format('h:mm a')
                            : moment(new Date()).format('h:mm a')
                        }
                        containerStyle={{marginBottom: 12}}
                        onDatePress={() => {
                          setUntilDateVisible(!untilDateVisible)
                        }}
                      />
                    )}
            
                    <BlockAvailableTabView
                      blocked={challengeAvailable[index].isBlock}
                      firstTabTitle={strings.block}
                      secondTabTitle={strings.setAvailable}
                      onFirstTabPress={() => {
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].isBlock = true;
                        setChallengeAvailable(tempChallenge);
                      }}
                      onSecondTabPress={() => {
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].isBlock = false;
                        setChallengeAvailable(tempChallenge);
                      }}
                      style={styles.blockStyle}
                      activeEventPricacy={styles.activeEventPricacy}
                      inactiveEventPricacy={styles.inactiveEventPricacy}
                      activeEventPrivacyText={styles.activeEventPrivacyText}
                      inactiveEventPrivacyText={styles.activeEventPrivacyText}
                    />
            
                    <DateTimePickerView
                      title={
                        challengeAvailable[index].allDay
                          ? 'Choose a date'
                          : 'Choose a date & time'
                      }
                      // date={new Date(eventStartDateTime)}
                      visible={startDateVisible}
                      onDone={(date) => {
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].start_datetime = tempChallenge[index].allDay
                          ? new Date(date.getFullYear()
                          ,date.getMonth()
                          ,date.getDate()
                          ,0,0,0)
                          : new Date(date);
                        tempChallenge[index].end_datetime = tempChallenge[index].allDay
                          ? new Date(date.getFullYear()
                          ,date.getMonth()
                          ,date.getDate()
                          ,23,59,59)
                          : new Date(moment(date).add(5, 'm').toDate());
                        tempChallenge[index].untilDate = tempChallenge[index].allDay
                          ? new Date(date.getFullYear()
                          ,date.getMonth()
                          ,date.getDate()
                          ,23,59,59)
                          : new Date(moment(date).add(5, 'm').toDate());
                        setChallengeAvailable(tempChallenge);
            
                        setStartDateVisible(!startDateVisible);
                      }}
                      onCancel={handleCancelPress}
                      onHide={handleCancelPress}
                      minimumDate={new Date()}
                      mode={challengeAvailable[index].allDay ? 'date' : 'datetime'}
                    />
                    <DateTimePickerView
                      title={
                        challengeAvailable[index].allDay
                          ? 'Choose a date'
                          : 'Choose a date & time'
                      }
                      // date={new Date(eventEndDateTime)}
                      visible={endDateVisible}
                      onDone={(date) => {
                        console.log('End date:=>', date);
                        const tempChallenge = [...challengeAvailable];
                        tempChallenge[index].end_datetime = tempChallenge[index].allDay
                          ? new Date(date.getFullYear()
                          ,date.getMonth()
                          ,date.getDate()
                          ,23,59,59)
                          : new Date(moment(date).add(5, 'm').toDate());
                        setChallengeAvailable(tempChallenge);
                        setEndDateVisible(!endDateVisible);
                        console.log('tempChallengetempChallenge',tempChallenge);
            
                      }}
                      onCancel={handleCancelPress}
                      onHide={handleCancelPress}
                      minimumDate={new Date(challengeAvailable[index].end_datetime).setMinutes(
                        new Date(challengeAvailable[index].end_datetime).getMinutes() + 5,
                      )}
                      mode={challengeAvailable[index].allDay ? 'date' : 'datetime'}
                    />
                    <DateTimePickerView
                      // date={new Date(challengeAvailable[index].untilDate * 1000)}
                      visible={untilDateVisible}
                      onDone={(date) => {
                        console.log('Index:=>',index);
                        setUntilDateVisible(!untilDateVisible);
            
                        const tempChallenge = challengeAvailable;
                        tempChallenge[index].untilDate = tempChallenge[index].allDay
                          ? new Date(date.getFullYear()
                          ,date.getMonth()
                          ,date.getDate()
                          ,23,59,59)
                          : new Date(moment(date).add(5, 'm').toDate());
                        setChallengeAvailable([...tempChallenge]);
                      }}
                      onCancel={handleCancelPress}
                      onHide={handleCancelPress}
                      minimumDate={new Date(moment(challengeAvailable[index].end_datetime).add(5, 'm').toDate())}
                      minutesGap={5}
                      mode={challengeAvailable[index].allDay ? 'date' : 'datetime'}
                    />
                  </View>
                );
              
              }}
              ListFooterComponent={() => (
                <AddTimeItem
                  addTimeText={strings.addTime}
                  source={images.plus}
                  onAddTimePress={() => {
                    const obj = {
                      id: challengeAvailable.length,
                      isBlock: true,
                      allDay: false,
                      is_recurring: false,
                      start_datetime: moment(new Date()).format(
                        'YYYY-MM-DD hh:mm:ss',
                      ),
                      end_datetime: moment(new Date()).format(
                        'YYYY-MM-DD hh:mm:ss',
                      ),
                    };
                    setChallengeAvailable([...challengeAvailable, obj]);
                  }}
                />
              )}
              ListFooterComponentStyle={{marginTop: 20}}
              ItemSeparatorComponent={() => <View style={{height: wp('3%')}} />}
              keyExtractor={(itemValue, index) => index.toString()}
            />
          </EventItemRender>
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

  blockStyle: {
    width: wp('92%'),
    marginVertical: 0,
    borderRadius: 8,
  },
  activeEventPricacy: {
    paddingVertical: 8,
    borderRadius: 6,
  },
  inactiveEventPricacy: {
    paddingVertical: 2,
  },
  activeEventPrivacyText: {
    fontSize: 12,
  },
  deleteTextStyle: {
    alignSelf: 'flex-end',
    marginRight: 5,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.redDelColor,
  },
  toggleViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  allDayText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginRight: wp('1.5%'),
  },
  checkboxImg: {
    width: wp('5.5%'),
    height: wp('5.5%'),
  },
  checkbox: {
    alignSelf: 'center',
    right: wp(0),
  },
});
