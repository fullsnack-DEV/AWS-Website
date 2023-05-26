import React, {useRef, useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import Modal from 'react-native-modal';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ReadMore from '@fawazahmed/react-native-read-more';
import ActionSheet from 'react-native-actionsheet';

import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventTimeItem from '../../../components/Schedule/EventTimeItem';
import EventMapView from '../../../components/Schedule/EventMapView';
import {strings} from '../../../../Localization/translation';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {attendEvent, deleteEvent} from '../../../api/Schedule';
import TCProfileButton from '../../../components/TCProfileButton';
import {getGroupIndex, getUserIndex} from '../../../api/elasticSearch';
import TCProfileView from '../../../components/TCProfileView';
import Verbs from '../../../Constants/Verbs';
import {
  getJSDate,
  ordinal_suffix_of,
  getDayFromDate,
  countNumberOfWeekFromDay,
} from '../../../utils';
import {getUserFollowerFollowing} from '../../../api/Users';
import {getGroupMembers} from '../../../api/Groups';
import ScreenHeader from '../../../components/ScreenHeader';

export default function EventScreen({navigation, route}) {
  const actionSheet = useRef();
  const userActionSheet = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [organizer, setOrganizer] = useState({});
  const [going, setGoing] = useState([]);
  const [eventData, setEventData] = useState(route.params.data ?? {});
  const [activeTab, setActiveTab] = useState(strings.infoTitle);
  const [myFollowers, setMyFollowers] = useState([]);
  const [myMembers, setMyMembers] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');
  const [recurringEditModal, setRecurringEditModal] = useState(false);
  const THISEVENT = 0;
  const FUTUREEVENT = 1;
  const ALLEVENT = 2;

  const recurringEditList = [
    {
      text: strings.recuringoptionOne,
      value: THISEVENT,
    },
    {
      text: strings.recurringOptionTwo,
      value: FUTUREEVENT,
    },
    {
      ext: strings.recurringOptionThree,
      value: ALLEVENT,
    },
  ];

  let titleValue = strings.gameSingular;
  let description = strings.gameWith;
  let description2 = '';
  let startTime = '';
  let endTime = '';
  let untilTime = '';
  let gameDataLati = null;
  let gameDataLongi = null;

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
      if (untilTime) {
        repeatString = format(
          strings.repeatTime,
          repeatString,
          moment(untilTime).format('MMM DD, YYYY hh:mm a'),
        );
      }
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

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.event) {
        setEventData(route?.params?.event);
      }
    }
  }, [isFocused, route?.params]);

  useEffect(() => {
    const goingData = eventData.going ?? [];

    const getUserDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        bool: {
          must: [{match: {user_id: eventData?.created_by?.uid}}],
        },
      },
    };

    const getUserGoingQuery = {
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
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }

    getUserIndex(getUserGoingQuery)
      .then((res) => {
        setGoing(res);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });

    getUserFollowerFollowing(
      eventData?.created_by?.group_id
        ? eventData?.created_by?.group_id
        : eventData?.owner_id,
      eventData?.created_by?.group_id
        ? Verbs.entityTypeGroups
        : Verbs.entityTypePlayers,
      'followers',
      authContext,
    )
      .then((res) => {
        if (res.payload.length) {
          const tempArr = [];
          res.payload.forEach((item) => {
            tempArr.push(item.user_id);
          });
          setMyFollowers(tempArr);
        }
      })
      .catch(() => {});

    if (eventData?.created_by?.group_id) {
      getGroupMembers(eventData?.created_by?.group_id, authContext)
        .then((res) => {
          const tempArr = [];
          res.payload.forEach((item) => {
            tempArr.push(item.user_id);
          });
          setMyMembers(tempArr);
        })
        .catch(() => {});
    }
  }, [eventData, authContext]);

  const checkIsGoing = () => {
    if (!['user', 'player'].includes(authContext.entity.role)) {
      return false;
    }

    if (eventData?.who_can_join?.value === 0) {
      return true;
    }

    if (eventData?.who_can_join?.value === 1) {
      if (myFollowers.includes(authContext.entity.auth.user_id)) {
        return true;
      }
    }

    if (['user', 'player'].includes(authContext.entity.role)) {
      if (eventData?.owner_id === authContext.entity.auth.user_id) {
        return true;
      }
    }

    if (eventData?.who_can_join?.value === 3) {
      if (myMembers.includes(authContext.entity.auth.user_id)) {
        return true;
      }
    }

    if (!['user', 'player'].includes(authContext.entity.role)) {
      return true;
    }

    return false;
  };

  const checkIsInvite = () => {
    if (eventData?.owner_type === 'groups') {
      return false;
    }

    if (['user', 'player'].includes(authContext.entity.role)) {
      if (eventData?.who_can_invite?.value === 0) {
        const tempArr = [];
        going.forEach((item) => {
          tempArr.push(item.user_id);
        });
        if (tempArr.includes(authContext.entity.auth.user_id)) {
          return true;
        }
      }
      if (eventData?.owner_id === authContext.entity.auth.user_id) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  };

  const attendAPICall = () => {
    setloading(true);
    const data = {
      start_datetime: eventData.start_datetime,
      end_datetime: eventData.end_datetime,
    };
    attendEvent(eventData.cal_id, data, authContext)
      .then((response) => {
        setEventData(response?.payload[0]);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert(strings.townsCupTitle, e.message);
      });
  };

  const renderGoingView = ({item}) => (
    <View style={styles.goingContainer}>
      <Image
        source={
          item?.thumbnail ? {uri: item.thumbnail} : images.profilePlaceHolder
        }
        style={styles.image}
      />
    </View>
  );

  const clickInfoIcon = (type) => {
    setInfoType(type);
    setInfoModal(true);
  };

  const handleDeleteEvent = (recurringOption = '') => {
    const data = {
      recurring_modification_type: recurringOption,
      start_datetime: eventData.start_datetime,
      end_datetime: eventData.end_datetime,
    };

    setloading(true);
    const entity = authContext.entity;
    const uid = entity.uid || entity.auth.user_id;
    const entityRole =
      entity.role === Verbs.entityTypeUser ? 'users' : 'groups';
    deleteEvent(entityRole, uid, eventData.cal_id, authContext, data)
      .then(() => {
        setTimeout(() => {
          setloading(false);
          navigation.navigate('ScheduleScreen');
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        Alert.alert('', e.messages);
      });
  };

  const renderDeleteRecurringOptions = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15,
      }}>
      <View>
        <Text
          style={styles.filterTitle}
          onPress={() => {
            setRecurringEditModal(false);
            setTimeout(() => {
              handleDeleteEvent(item.value);
            }, 1000);
          }}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      <ScreenHeader
        title={strings.event}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() =>
          isOrganizer
            ? actionSheet.current.show()
            : userActionSheet.current.show()
        }
        // loading={loading}
      />
      <ActivityLoader visible={loading} />

      <ScrollView stickyHeaderIndices={[5]}>
        <EventBackgroundPhoto
          isEdit={!!eventData?.background_thumbnail}
          isPreview={true}
          isImage={!!eventData?.background_thumbnail}
          imageURL={
            eventData?.background_thumbnail
              ? {uri: eventData?.background_thumbnail}
              : images.backgroudPlaceholder
          }
        />
        <View style={{paddingHorizontal: 15}}>
          <Text style={styles.eventTitleStyle}>{titleValue}</Text>

          <View style={styles.row}>
            <Text style={styles.sportTitleStyle}>
              {eventData.selected_sport && eventData.selected_sport.sport_name}
            </Text>
            {!eventData.is_Offline && (
              <Text style={styles.onlineText}>{strings.onlineText}</Text>
            )}
          </View>

          <EventTimeItem
            from={strings.from}
            fromTime={moment(startTime).format('MMM DD, YYYY')}
            to={strings.to}
            toTime={`${moment(startTime).format('hh:mm a')} - ${moment(
              endTime,
            ).format('hh:mm a')}`}
            repeat={strings.repeat}
            repeatTime={repeatString}
            location={eventData?.location?.location_name}
            eventOnlineUrl={eventData?.online_url}
            is_Offline={eventData?.is_Offline}
          />

          {/* Join and Invite button wrapper */}
          <View style={styles.buttonContainer}>
            {checkIsGoing() && (
              <TCProfileButton
                title={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                    ? strings.going
                    : strings.join
                }
                style={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                    ? [
                        styles.firstButtonStyle,
                        {width: checkIsInvite() ? '48%' : '100%'},
                      ]
                    : [
                        styles.firstButtonStyle,
                        {
                          width: checkIsInvite() ? '48%' : '100%',
                          backgroundColor: colors.themeColor,
                        },
                      ]
                }
                showArrow={false}
                tickImage={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                }
                imageStyle={styles.checkMarkStyle}
                textStyle={
                  (eventData.going ?? []).filter(
                    (entity) => entity === authContext.entity.uid,
                  ).length > 0
                    ? [styles.attendTextStyle, {color: colors.lightBlackColor}]
                    : [styles.attendTextStyle, {color: colors.whiteColor}]
                }
                onPressProfile={() => {
                  if (
                    (eventData.going ?? []).filter(
                      (entity) => entity === authContext.entity.uid,
                    ).length > 0
                  ) {
                    //
                  } else {
                    attendAPICall();
                  }
                }}
              />
            )}

            {checkIsInvite() && (
              <TCProfileButton
                title={strings.invite}
                style={[
                  styles.firstButtonStyle,
                  {width: checkIsGoing() ? '48%' : '100%'},
                ]}
                showArrow={false}
                imageStyle={styles.checkMarkStyle}
                textStyle={styles.inviteTextStyle}
                onPressProfile={() =>
                  navigation.navigate('InviteToEventScreen', {
                    eventId: eventData.cal_id,
                    start_datetime: eventData.start_datetime,
                    end_datetime: eventData.end_datetime,
                  })
                }
              />
            )}
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === strings.infoTitle ? styles.activeTabItem : {},
            ]}
            onPress={() => setActiveTab(strings.infoTitle)}>
            <Text
              style={[
                styles.tabItemText,
                activeTab === strings.infoTitle ? styles.activeTabItemText : {},
              ]}>
              {strings.infoTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === strings.postTitle ? styles.activeTabItem : {},
            ]}
            onPress={() => setActiveTab(strings.postTitle)}>
            <Text
              style={[
                styles.tabItemText,
                activeTab === strings.postTitle ? styles.activeTabItemText : {},
              ]}>
              {strings.postTitle}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === strings.infoTitle ? (
          <>
            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.organizerTitle}
              </Text>
              <ReadMore
                numberOfLines={3}
                style={styles.longTextStyle}
                seeMoreText={strings.moreText}
                seeLessText={strings.lessText}
                seeLessStyle={styles.moreLessText}
                seeMoreStyle={styles.moreLessText}>
                {description} {description2}
              </ReadMore>
            </View>
            <View style={[styles.divider, {marginHorizontal: 15}]} />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.organizerTitle}
              </Text>
              {organizer && (
                <View>
                  <TCProfileView
                    type="medium"
                    name={organizer.group_name ?? organizer.full_name}
                    location={`${organizer.city}, ${
                      organizer.state_abbr ? organizer.state_abbr : ''
                    }${organizer.state_abbr ? ',' : ''} ${organizer.country}`}
                    image={
                      organizer.thumbnail
                        ? {uri: organizer.thumbnail}
                        : images.teamPH
                    }
                    alignSelf={'flex-start'}
                    marginTop={10}
                  />
                  <Image
                    source={images.starProfile}
                    style={styles.starProfile}
                  />
                </View>
              )}
            </View>
            <View style={[styles.divider, {marginHorizontal: 15}]} />

            {eventData.going?.length > 0 && (
              <>
                <View style={styles.containerStyle}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 15,
                    }}>
                    <Text style={[styles.headerTextStyle, {marginBottom: 0}]}>
                      {`${strings.goingTitle} (${going?.length})`}
                    </Text>

                    <Text
                      onPress={() => {
                        navigation.navigate('GoingListScreen', {
                          showRemove:
                            authContext.entity.uid === organizer.user_id,
                          going_ids: eventData?.going ?? [],
                          eventData,
                        });
                      }}
                      style={styles.seeAllText}>
                      {`${strings.seeAllText}`}
                    </Text>
                  </View>

                  <FlatList
                    data={going}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderGoingView}
                  />
                </View>
                <View style={[styles.divider, {marginHorizontal: 15}]} />
              </>
            )}

            <EventItemRender title={strings.place}>
              {eventData?.is_Offline ? (
                <>
                  <Text
                    style={[styles.textValueStyle, {fontFamily: fonts.RBold}]}>
                    {eventData?.location?.venue_name}
                  </Text>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData?.location?.location_name}
                  </Text>
                  <EventMapView
                    region={{
                      latitude:
                        eventData?.location?.latitude ?? Number(gameDataLati),
                      longitude:
                        eventData?.location?.longitude ?? Number(gameDataLongi),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    coordinate={{
                      latitude:
                        eventData?.location?.latitude ?? Number(gameDataLati),
                      longitude:
                        eventData?.location?.longitude ?? Number(gameDataLongi),
                    }}
                  />
                  <Text style={[styles.textValueStyle, {marginTop: 10}]}>
                    {eventData?.location?.venue_detail}
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.textValueStyle,
                    eventData.online_url && styles.textUrl,
                  ]}>
                  {eventData.online_url
                    ? eventData?.online_url
                    : strings.emptyEventUrl}
                </Text>
              )}
            </EventItemRender>

            <View style={styles.sepratorViewStyle} />

            <View style={styles.containerStyle}>
              <Text style={styles.headerTextStyle}>
                {strings.timeUppercase}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                }}>
                <View>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {color: colors.veryLightBlack},
                    ]}>
                    {strings.starts}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {`${moment(startTime).format('MMM DD, YYYY')}`}
                  </Text>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular, marginLeft: 25},
                    ]}>{`${moment(startTime).format('hh:mm a')}`}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                }}>
                <View>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {color: colors.veryLightBlack},
                    ]}>
                    {strings.ends}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {`${moment(endTime).format('MMM DD, YYYY')}`}
                  </Text>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular, marginLeft: 25},
                    ]}>{`${moment(endTime).format('hh:mm a')}`}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    color: colors.lightBlackColor,
                    fontFamily: fonts.RLight,
                  }}>
                  {strings.timezone} &nbsp;
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(strings.timezoneAvailability);
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 21,
                      color: colors.lightBlackColor,
                      fontFamily: fonts.RRegular,
                      textDecorationLine: 'underline',
                    }}>
                    {Intl.DateTimeFormat()
                      ?.resolvedOptions()
                      .timeZone.split('/')
                      .pop()}
                  </Text>
                </TouchableOpacity>
              </View>

              {isOrganizer && (
                <>
                  <View style={[styles.divider, {marginVertical: 15}]} />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.textValueStyle,
                        {color: colors.veryLightBlack},
                      ]}>
                      {strings.repeat}
                    </Text>
                    <Text
                      style={[
                        styles.textValueStyle,
                        {fontFamily: fonts.RRegular},
                      ]}>
                      {repeatString}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                      marginTop: 25,
                    }}>
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        marginRight: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          !eventData?.blocked
                            ? images.roundTick
                            : images.roundCross
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.textValueStyle,
                        {
                          color: !eventData?.blocked
                            ? colors.greeColor
                            : colors.veryLightBlack,
                          fontFamily: fonts.RRegular,
                        },
                      ]}>
                      {!eventData?.blocked
                        ? strings.available
                        : strings.blockedForChallenge}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.sepratorViewStyle} />
            <EventItemRender
              title={strings.eventFeeTitle}
              icon={images.infoIcon}
              clickInfoIcon={clickInfoIcon}
              type={'fee'}>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {`${parseFloat(eventData.event_fee?.value).toFixed(2)} ${
                  eventData.event_fee?.currency_type
                }`}
              </Text>
            </EventItemRender>

            <View style={styles.sepratorViewStyle} />
            <EventItemRender title={strings.refundPolicyTitle}>
              <ReadMore
                numberOfLines={2}
                style={styles.longTextStyle}
                seeMoreText={strings.moreText}
                seeLessStyle={styles.moreLessText}
                seeMoreStyle={styles.moreLessText}
                seeLessText={strings.lessText}>
                {strings.attendeesMustRefundedText} {eventData?.refund_policy}
              </ReadMore>
            </EventItemRender>

            <View style={styles.sepratorViewStyle} />
            <EventItemRender
              title={strings.numberOfAttend}
              icon={images.infoIcon}
              clickInfoIcon={clickInfoIcon}
              type={'attendee'}>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {format(
                  strings.minMaxText_dy,
                  `${eventData?.min_attendees}   `,
                  eventData?.max_attendees,
                )}
              </Text>
            </EventItemRender>

            {isOrganizer && (
              <>
                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanSee}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData?.who_can_see?.text}
                  </Text>
                </EventItemRender>

                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanJoin}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData?.who_can_join?.text}
                  </Text>
                </EventItemRender>

                <View style={styles.sepratorViewStyle} />
                <EventItemRender title={strings.whoCanInvite}>
                  <Text
                    style={[
                      styles.textValueStyle,
                      {fontFamily: fonts.RRegular},
                    ]}>
                    {eventData?.who_can_invite?.text}
                  </Text>
                </EventItemRender>
                <View style={styles.sepratorViewStyle} />
              </>
            )}

            {/* <View marginBottom={70} /> */}
          </>
        ) : null}
      </ScrollView>

      <ActionSheet
        ref={actionSheet}
        options={[strings.edit, strings.delete, strings.cancel]}
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
            if (eventData.rrule) {
              setRecurringEditModal(true);
            } else {
              handleDeleteEvent();
            }
          }
        }}
      />
      <ActionSheet
        ref={userActionSheet}
        options={[
          strings.reportText,
          strings.blockEventOrganiser,
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={() => {}}
      />

      <Modal
        isVisible={recurringEditModal}
        backdropColor="black"
        onBackdropPress={() => setRecurringEditModal(false)}
        onRequestClose={() => setRecurringEditModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 4,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
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
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 10,
                fontSize: 16,
                fontFamily: fonts.RRegular,
              }}>
              {strings.deleteRecurringEvent}{' '}
            </Text>
          </View>
          {/* <TCThinDivider width="92%" /> */}
          <FlatList
            // ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
            showsVerticalScrollIndicator={false}
            data={recurringEditList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderDeleteRecurringOptions}
          />
        </View>
      </Modal>

      {/* Modal Style 3 */}
      <Modal
        isVisible={infoModal}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={() => {
          setInfoModal(false);
        }}
        backdropOpacity={0.7}>
        <SafeAreaView style={styles.modalMainViewStyle}>
          <View style={{padding: 20}}>
            <View style={styles.sepratorStyle} />
            {infoType === 'attendee' ? (
              <View>
                <Text style={styles.titleText}>{strings.numberOfAttend}</Text>
                <Text style={styles.contentText}>{strings.attendyText}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.titleText}>{strings.eventFeeTitle}</Text>
                <Text style={styles.contentText}>{strings.feeText}</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  onlineText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    marginLeft: 10,
  },
  mainContainerStyle: {
    flex: 1,
  },
  sepratorViewStyle: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  textValueStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  eventTitleStyle: {
    fontSize: 25,
    lineHeight: 35,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportTitleStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  firstButtonStyle: {
    margin: 0,
    height: 27,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
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
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  headerTextStyle: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 15,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  goingContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.thinDividerColor,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
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
    padding: 10,
  },
  sepratorStyle: {
    height: 5,
    width: 80,
    backgroundColor: colors.writePostSepratorColor,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleText: {
    color: colors.blackColor,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentText: {
    color: colors.blackColor,
    fontSize: 16,
    lineHeight: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: '#0093FF',
  },
  moreLessText: {
    fontSize: 12,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  starProfile: {
    width: 15,
    height: 15,
    position: 'absolute',
    left: 30,
    top: 40,
  },
  seeAllText: {
    color: colors.themeColor,
  },
  textUrl: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  buttonContainer: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
    paddingBottom: 9,
  },
  tabItemText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  activeTabItem: {
    paddingBottom: 7,
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
  },
  activeTabItemText: {
    fontFamily: fonts.RBlack,
    color: colors.tabFontColor,
  },
  longTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
