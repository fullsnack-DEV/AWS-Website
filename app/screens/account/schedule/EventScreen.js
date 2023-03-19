import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import Modal from 'react-native-modal';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';

import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventTimeItem from '../../../components/Schedule/EventTimeItem';
import EventMapView from '../../../components/Schedule/EventMapView';
import {strings} from '../../../../Localization/translation';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {attendEvent, deleteEvent, getEventById} from '../../../api/Schedule';
import TCProfileButton from '../../../components/TCProfileButton';
import {getGroupIndex, getUserIndex} from '../../../api/elasticSearch';
import TCProfileView from '../../../components/TCProfileView';
import Verbs from '../../../Constants/Verbs';
import {
  getJSDate,
  ordinal_suffix_of,
  getDayFromDate,
  countNumberOfWeekFromDay
 } from '../../../utils';
 import{getUserFollowerFollowing} from '../../../api/Users';
 import{getGroupMembers} from '../../../api/Groups';

export default function EventScreen({navigation, route}) {
  const actionSheet = useRef();
  const userActionSheet = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [organizer, setOrganizer] = useState();
  const [going, setGoing] = useState([]);
  const [eventData, setEventData] = useState(route?.params?.data);
  const [activeTab, setActiveTab] = useState('info');
  const [myFollowers, setMyFollowers] = useState([]);
  const [myMembers, setMyMembers] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');

  let titleValue = 'Game';
  let description = 'Game With';
  let description2 = '';
  let startTime = '';
  let endTime = '';
  let untilTime = '';
  let gameDataLati = null;
  let gameDataLongi = null;
  const reportText = 'Report This Event';
  const blockEventOrganiser = 'Block Event Organiser';
  const attendyText = 'The event may be canceled by the organizer if the minimum number of the attendees isn’t met.';
  const feeText = 'The event may be canceled by the organizer if the minimum number of the attendees isn’t met.';
  // let blocked = false;
 
  let repeatString = strings.never;
  const isOrganizer = eventData.owner_id === authContext.entity.uid;
  if (eventData) {
    if (eventData.title) {
      titleValue = eventData.title;
    }
    if (eventData.descriptions) {
      description = eventData.descriptions;
    }

    if (eventData.start_datetime) {
      startTime = getJSDate(eventData.start_datetime);
    }
    if (eventData.end_datetime) {
      endTime = getJSDate(eventData.end_datetime);
    }
    if (eventData.untilDate) {
      untilTime = getJSDate(eventData.untilDate);
    }
    if (eventData.repeat === Verbs.eventRecurringEnum.Daily) {
      repeatString = strings.daily;
    } else if (eventData.repeat === Verbs.eventRecurringEnum.Weekly) {
      repeatString = strings.weekly;
    } else if (eventData.repeat === Verbs.eventRecurringEnum.WeekOfMonth) {
      repeatString = format(
        strings.monthlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.DayOfMonth) {
      repeatString = format(
        strings.monthlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.WeekOfYear) {
      repeatString = format(
        strings.yearlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.DayOfYear) {
      repeatString = format(
        strings.yearlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    }

    if (eventData.repeat !== Verbs.eventRecurringEnum.Never) {
      repeatString = format(
        strings.repeatTime,
        repeatString,
        moment(untilTime).format('MMM DD, YYYY hh:mm a'),
      );
    }

    // if (eventData.blocked) {
    //   blocked = eventData.blocked;
    // }
  }
  if (route && route.params && route.params.gameData) {
    if (route.params.gameData.game && route.params.gameData.game.away_team) {
      description2 = route.params.gameData.game.away_team.group_name;
    }

    if (route.params.gameData.game && route.params.gameData.game.venue) {
      gameDataLati = route.params.gameData.game.venue.lat;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      gameDataLongi = route.params.gameData.game.venue.long;
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{padding: 2, marginRight: 15}}
          onPress={() => isOrganizer ? actionSheet.current.show() : userActionSheet.current.show()}>
            <Image
              source={images.vertical3Dot}
              style={styles.threeDotImageStyle}
            />
        </TouchableOpacity> 
      ),
    });
  }, [navigation, isOrganizer]);

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getEventById(
        authContext.entity.role === 'user' ? 'users' : 'groups',
        authContext.entity.uid || authContext.entity.auth.user_id,
        eventData.cal_id,
        authContext,
      )
        .then((response) => {
          setloading(false);
          setEventData(response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [isFocused, route?.params?.comeFrom]);

  useEffect(() => {
    const goingData = eventData.going ?? [];
    const getUserDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        terms: {
          'user_id.keyword': [...goingData, eventData?.created_by?.uid],
        },
      },
    };

    const getGroupDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        bool: {
          must: [{match: {group_id: eventData?.created_by?.group_id}}],
        },
      },
    };

    if (eventData?.created_by?.group_id) {
      getGroupIndex(getGroupDetailQuery)
        .then((res) => {
          setOrganizer(res[0]);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      getUserIndex(getUserDetailQuery)
        .then((res) => {
          const org = res.filter(
            (obj) => obj.user_id === eventData.created_by.uid,
          )?.[0];
          setOrganizer(org);
          setGoing(res);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }


    getUserFollowerFollowing(
      eventData?.created_by?.group_id ? eventData?.created_by?.group_id : eventData?.owner_id,
      eventData?.created_by?.group_id
        ? Verbs.entityTypeGroups 
        : Verbs.entityTypePlayers,
      'followers',
      authContext,
    )
    .then((res) => {
      if(res.payload.length) {
        const tempArr = [];
        res.payload.forEach((item) => {
          tempArr.push(item.user_id);
        });
        setMyFollowers(tempArr);
      }
    })
    .catch(() => {});


    if(eventData?.created_by?.group_id)  {
      getGroupMembers(eventData?.created_by?.group_id , authContext).then((res) => {
        const tempArr = [];
        res.payload.forEach((item) => {
          tempArr.push(item.user_id);
        });
        setMyMembers(tempArr);
      })
      .catch(() => {});
    }
  }, [
    eventData?.created_by?.group_id,
    eventData?.created_by?.uid,
    eventData.going
  ]);



  const checkIsGoing = () => {
    if(!['user', 'player'].includes(authContext.entity.role)) {
      return false;
    }

    if(eventData?.who_can_join?.value === 0) {
      return true;
    }

    if(eventData?.who_can_join?.value === 1){
      if(myFollowers.includes(authContext.entity.auth.user_id)) {
        return true;
      }
    }

    if(['user', 'player'].includes(authContext.entity.role)) {
      if(eventData?.owner_id === authContext.entity.auth.user_id) {
        return true;
      }
    }

    if(eventData?.who_can_join?.value === 3) {
      if(myMembers.includes(authContext.entity.auth.user_id)) {
        return true;
      }
    }

    if(!['user', 'player'].includes(authContext.entity.role)) {
      return true;
    }

    return false;
   
  }



  const checkIsInvite = () => {

    if(eventData?.owner_type === 'groups') {
      return false;
    }

    if(eventData?.who_can_invite?.value === 0) {
      return true;
    }

    if(eventData?.who_can_invite?.value === 1){
      if(myFollowers.includes(authContext.entity.auth.user_id)) {
        return true;
      }
    }

    if(['user', 'player'].includes(authContext.entity.role)) {
      if(eventData?.owner_id === authContext.entity.auth.user_id) {
        return true;
      }
    }

    if(eventData?.who_can_invite?.value === 3) {
      if(myMembers.includes(authContext.entity.auth.user_id)) {
        return true;
      }
    }

    if(!['user', 'player'].includes(authContext.entity.role)) {
      return true;
    }

    return false;
  }


  const attendAPICall = () => {
    setloading(true);
    attendEvent(eventData.cal_id, authContext)
      .then((response) => {
        setEventData(response?.payload);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.townsCupTitle, e.message);
      });
  };

  const renderGoingView = ({item}) => (
    <View style={styles.goingContainer}>
      <FastImage
        source={
          item?.thumbnail ? {uri: item?.thumbnail} : images.profilePlaceHolder
        }
        style={{height: 35, width: 35, borderRadius: 70}}
      />
    </View>
  );


  const clickInfoIcon = (type) => {
    setInfoType(type);
    setInfoModal(true);
  }

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      {/* Modal Style 3 */}
      <Modal
        isVisible={infoModal}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={() => {
          setInfoModal(false);
        }}
        backdropOpacity={0}>
        <SafeAreaView style={styles.modalMainViewStyle}>
          <View style={{padding: 20}}>
            <View style={styles.sepratorStyle}/>
            {
            infoType === 'attendee' ? (
              <View>
                <Text style={styles.titleText}>{strings.numberOfAttend}</Text>
                <Text style={styles.contentText}>{attendyText}</Text>
              </View>
            ):(
              <View>
                <Text style={styles.titleText}>{strings.eventFeeTitle}</Text>
                <Text style={styles.contentText}>{feeText}</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
      {/* Modal Style 3 */}
      <ActivityLoader visible={loading} />
      <View style={styles.sperateLine} />
      <ScrollView 
      stickyHeaderIndices={[5]}
      >
        <EventBackgroundPhoto
          isEdit={!!route?.params?.data?.background_thumbnail}
          isPreview={true}
          isImage={!!route?.params?.data?.background_thumbnail}
          imageURL={
            route?.params?.data?.background_thumbnail
              ? {uri: route?.params?.data?.background_thumbnail}
              : images.backgroudPlaceholder
          }
        />

        <Text style={styles.eventTitleStyle}>
          {titleValue}
        </Text>
        <Text style={styles.sportTitleStyle}>
          {' '}
          {eventData?.selected_sport && eventData?.selected_sport?.sport_name}
        </Text>

        <EventTimeItem
          from={strings.from}
          fromTime={moment(startTime).format('MMM DD, YYYY hh:mm a')}
          to={strings.to}
          toTime={moment(endTime).format('MMM DD, YYYY hh:mm a')}
          repeat={strings.repeat}
          repeatTime={repeatString}
          location={eventData?.location?.location_name}
        />

        {/* Join and Invite button wrapper */}
        <View
        style={{
          flex: 1,
          backgroundColor: colors.whiteColor,
          zIndex: 1000,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}>
        {
        checkIsGoing()  && (
          <TCProfileButton
            title={
              eventData?.going?.filter(
                (entity) => entity === authContext.entity.uid,
              ).length > 0
                ? 'Going'
                : 'Join'
            }
            style={
              eventData?.going?.filter(
                (entity) => entity === authContext.entity.uid,
              ).length > 0 ?
              [styles.firstButtonStyle,{width: checkIsInvite() ? '48%' : '100%'},] 
              :
              [styles.firstButtonStyle,{width: checkIsInvite() ? '48%' : '100%', backgroundColor : colors.themeColor}] 
            }
            showArrow={false}
            imageStyle={styles.checkMarkStyle}
            textStyle={
              eventData?.going?.filter(
                (entity) => entity === authContext.entity.uid,
              ).length > 0
                ? [styles.attendTextStyle, {color: colors.lightBlackColor}]
                : [styles.attendTextStyle, {color: colors.whiteColor}]
            }
            onPressProfile={() => {
              if (
                eventData?.going?.filter(
                  (entity) => entity === authContext.entity.uid,
                ).length > 0
              ) {
                console.log('its going');
              } else {
                attendAPICall();
              }
            }}
          />
        )}

        {checkIsInvite()  && (
          <TCProfileButton
            title={'Invite'}
            style={[styles.firstButtonStyle, {width: checkIsGoing() ? '48%' : '100%'}]}
            showArrow={false}
            imageStyle={styles.checkMarkStyle}
            textStyle={styles.inviteTextStyle}
            onPressProfile={() =>
              navigation.navigate('InviteToEventScreen', {
                eventId: eventData.cal_id,
              })
            }
          />
        )}
        </View>

        {/* {!blocked ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
              marginTop: 5,
            }}>
            <Image
              source={images.availableChallenge}
              style={styles.availableImageStyle}
            />
            <Text style={styles.availableTextStyle}>{strings.available}</Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
              marginTop: 5,
            }}>
            <Image
              source={images.blockedChallenge}
              style={styles.availableImageStyle}
            />
            <Text style={styles.blockTextStyle}>
              {strings.blockedForChallenge}
            </Text>
          </View>
        )} */}


        <View style={{ marginVertical: 30, backgroundColor: colors.whiteColor}}> 
          <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%'
          }}>
            <View
              style={{
                borderBottomWidth : 3, 
                borderColor: activeTab === 'info' ? colors.themeColor : colors.lightBlackColor, 
                width: '50%',
            }}
            > 
              <TouchableOpacity onPress={() => setActiveTab('info')}>
                <Text 
                style={{
                  textAlign: 'center', 
                  fontSize: 16, 
                  lineHeight: 24,
                  fontWeight: activeTab === 'info' ? 'bold' : '',
                  color: activeTab === 'info' ? colors.themeColor : colors.lightBlackColor,
                  paddingVertical: 10
                }}>Info</Text>
              </TouchableOpacity>
            </View>
            <View
            style={{
              borderBottomWidth : 3, 
              borderColor: activeTab === 'post' ? colors.themeColor : colors.lightBlackColor,
              width: '50%'
            }}
            >
              <TouchableOpacity onPress={() => setActiveTab('post')}>
                <Text 
                style={{
                  textAlign: 'center', 
                  fontSize: 16,
                  lineHeight: 24,
                  fontWeight: activeTab === 'post' ? 'bold' : '',
                  color: activeTab === 'post' ? colors.themeColor : colors.lightBlackColor,
                  paddingVertical: 10
                }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {
        activeTab === 'info' ? (
        <>
          <EventItemRender title={strings.description}>
            <Text style={styles.textValueStyle}>
              {description} {description2}
            </Text>
          </EventItemRender>

          <TCThinDivider marginTop={10} />

          <View style={styles.containerStyle}>
            <Text style={styles.headerTextStyle}>{strings.organizerTitle}</Text>
            {organizer && (
            <TCProfileView
              type="medium"
              name={organizer.group_name ?? organizer.full_name}
              location={`${organizer.city}, ${organizer.state_abbr ? organizer.state_abbr:''}${organizer.state_abbr ? ',':''} ${organizer.country}`}
              image={
                organizer.thumbnail ? {uri: organizer.thumbnail} : images.teamPH
              }
              alignSelf={'flex-start'}
              marginTop={10}
            />)}
          </View>

          <TCThinDivider marginTop={10} />

          {eventData?.going?.length > 0 && (
          <View style={styles.containerStyle}>
            <Text
              style={styles.headerTextStyle}
              onPress={() => {
                navigation.navigate('GoingListScreen', {
                  showRemove: authContext.entity.uid === organizer.user_id,
                  going_ids: eventData?.going ?? [],
                  eventData,
                });
              }}>{`${strings.goingTitle} (${eventData?.going?.length})`}</Text>
            <FlatList
              data={going}
              horizontal
              ItemSeparatorComponent={() => (
                <View style={{width: 10, height: 35}} />
              )}
              renderItem={renderGoingView}
              keyExtractor={(item, index) => index.toString()}
              style={{padding: 3}}
            />
            <TCThinDivider marginTop={10} />
          </View>
          )}

          <EventItemRender title={strings.place}>
            <Text style={[styles.textValueStyle, {fontFamily: fonts.RBold}]}>
              {eventData?.location?.venue_name}
            </Text>
            <Text style={styles.textValueStyle}>
              {eventData?.location?.location_name}
            </Text>
            <EventMapView
              region={{
                latitude: eventData?.location?.latitude ?? Number(gameDataLati),
                longitude:
                  eventData?.location?.longitude ?? Number(gameDataLongi),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              coordinate={{
                latitude: eventData?.location?.latitude ?? Number(gameDataLati),
                longitude:
                  eventData?.location?.longitude ?? Number(gameDataLongi),
              }}
            />
            <Text style={[styles.textValueStyle, {marginTop: 10}]}>
              {eventData?.location?.venue_detail}
            </Text>
          </EventItemRender>

          <View style={styles.sepratorViewStyle} />

          <EventItemRender title={strings.timeText}>
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between' , marginBottom: 10}}>
                <Text style={styles.textValueStyle}>
                  Start
                </Text>
                <Text style={styles.textValueStyle}>
                {`${moment(startTime).format(
                  'MMM DD YYYY'
                )}`}  &nbsp; &nbsp; {`${moment(startTime).format(
                  'hh:mm a'
                )}`}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.textValueStyle}>
                  End
                </Text>
                <Text style={styles.textValueStyle}>
                {`${moment(endTime).format(
                  'MMM DD YYYY'
                )}`}  &nbsp; &nbsp; {`${moment(endTime).format(
                  'hh:mm a'
                )}`}
                </Text>
              </View>
            </View>

            {
            isOrganizer && (
            <>
            <TCThinDivider marginTop={10}  marginBottom={10} width='100%'  />
            <View >
              <View style={{flexDirection: 'row', justifyContent: 'space-between' , marginBottom: 10}}>
                <Text style={styles.textValueStyle}>
                  Repeat
                </Text>
                <Text style={[styles.textValueStyle, { textAlign: 'right'}]}>
                  {repeatString}
                </Text>
              </View>
            </View>
            {
            !eventData?.blocked ? (
            <View style={{flexDirection:'row', justifyContent: 'flex-end', alignContent: 'center', marginTop: 10}}>
              <Image source={images.roundTick} style={{width: 15, height: 15}}/> 
              <Text style={{color: '#00C168'}}>&nbsp;&nbsp; Available For Challenge</Text>
            </View>
            ):(
            <View style={{flexDirection:'row', justifyContent: 'flex-end', alignContent: 'center', marginTop: 10}}>
              <Image source={images.roundCross} style={{width: 15, height: 15}}/> 
              <Text style={{color: '#616161'}}>&nbsp;&nbsp; Blocked For Challenge</Text>
            </View>
            )}
            </>
            )}
          </EventItemRender>

          {
          isOrganizer && (
          <>
          <View style={styles.sepratorViewStyle} />
          <EventItemRender title={strings.whoCanJoin}>
            <Text style={styles.textValueStyle}>
              {eventData?.who_can_join?.text}
            </Text>
          </EventItemRender>
          </>
          )}

          <View style={styles.sepratorViewStyle} />
          <EventItemRender title={strings.numberOfAttend} icon={images.infoIcon} clickInfoIcon={clickInfoIcon} type={'attendee'}>
            <Text style={styles.textValueStyle}>
              {format(
                strings.minMaxText_dy,
                eventData?.min_attendees,
                eventData?.max_attendees,
              )}
            </Text>
          </EventItemRender>

          <View style={styles.sepratorViewStyle} />

          <EventItemRender title={strings.eventFeeTitle} icon={images.infoIcon} clickInfoIcon={clickInfoIcon} type={'fee'}>
            <Text style={styles.textValueStyle}>
              {`${parseFloat(eventData?.event_fee?.value).toFixed(2)} ${
                eventData?.event_fee?.currency_type
              }`}
            </Text>
          </EventItemRender>

          <View style={styles.sepratorViewStyle} />
          <EventItemRender title={strings.refundPolicyTitle}>
            <Text style={{fontSize: 14, fontFamily: fonts.RBold, marginTop: 15}}>
              {'Primary Refund Policy'}
            </Text>
            <Text style={[styles.subTitleText, {marginTop: 10}]}>
              Attendees must be refunded if the event is canceled or rescheduled.
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.RRegular,
                  textDecorationLine: 'underline',
                }}>
                {'\n'}Read payment policy for more information.
              </Text>
            </Text>
            <Text style={{fontSize: 14, fontFamily: fonts.RBold, marginTop: 15}}>
              {strings.additionalRefundPolicy}
            </Text>
            <Text style={styles.textValueStyle}>{eventData?.refund_policy}</Text>
          </EventItemRender>

          {
          isOrganizer && (
          <>
          <View style={styles.sepratorViewStyle} />
          <EventItemRender title={strings.whereEventPosted}>
            <Text style={styles.textValueStyle}>
              {eventData?.event_posted_at?.text}
            </Text>
          </EventItemRender>

          <View style={styles.sepratorViewStyle} />
          <EventItemRender title={strings.whoCanSee}>
            <Text style={styles.textValueStyle}>
              {eventData?.who_can_see?.text}
            </Text>
          </EventItemRender>
          </>
          )}

        <View marginBottom={70} />
        </>
        ):null}
      </ScrollView>

     

      <ActionSheet
        ref={actionSheet}
        options={['Edit', 'Delete', strings.cancel]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            // editactionsheet.current.show();
            if (route && route.params && eventData) {
              navigation.navigate('EditEventScreen', {
                data: eventData,
                gameData: route.params.gameData,
              });
            }
          } else if (index === 1) {
            Alert.alert(
              strings.deleteThisEventText,
              '',
              [
                {
                  text: strings.delete,
                  style: 'destructive',
                  onPress: async () => {
                    setloading(true);
                    const entity = authContext.entity;
                    const uid = entity.uid || entity.auth.user_id;
                    const entityRole =
                      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';
                    deleteEvent(entityRole, uid, eventData.cal_id, authContext)
                      .then(() => navigation.goBack())
                      .catch((e) => {
                        setloading(false);
                        Alert.alert('', e.messages);
                      });
                  },
                },
                {
                  text: strings.cancel,
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          }
        }}
      />
      <ActionSheet
        ref={userActionSheet}
        options={[reportText, blockEventOrganiser, strings.cancel]}
        cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={() => {}}
      />
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
  },

  threeDotImageStyle: {
    height: 18,
    width: 18,
    // tintColor: colors.blackColor,
    resizeMode: 'contain',
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
  eventTitleStyle: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    marginTop: 3,
    marginLeft: 15,
    color: colors.lightBlackColor,
  },

  sportTitleStyle: {
    fontSize: 12,
    marginLeft: 15,
    fontFamily: fonts.RRegular,
  },
  firstButtonStyle: {
    margin: 0,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#f5f5f5'
  },
  attendTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    color: colors.themeColor,
  },
  inviteTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
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
  goingContainer: {
    height: 37,
    width: 37,
    borderRadius: 74,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMainViewStyle: {
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: hp('32%'),
    flexDirection: 'column',
    padding: 10
  },
  sepratorStyle: {
    height: 5,
    width: 80,
    backgroundColor: colors.writePostSepratorColor,
    alignSelf: 'center',
    marginBottom: 20
  },
  titleText:{
    color: colors.blackColor,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  contentText:{
    color: colors.blackColor,
    fontSize: 16,
    lineHeight: 24,
  }
});
