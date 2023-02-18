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
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';

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

export default function EventScreen({navigation, route}) {
  const actionSheet = useRef();
  const isFocused = useIsFocused();
  const editactionsheet = useRef();
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [organizer, setOrganizer] = useState();
  const [going, setGoing] = useState([]);
  const [eventData, setEventData] = useState(route?.params?.data);
  let titleValue = 'Game';
  let description = 'Game With';
  let description2 = '';
  let startTime = '';
  let endTime = '';
  let untilTime = '';
  let gameDataLati = null;
  let gameDataLongi = null;
  let blocked = false;
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
    if(eventData.repeat === Verbs.eventRecurringEnum.Daily){
      repeatString = strings.daily;
    }
    else if(eventData.repeat === Verbs.eventRecurringEnum.Weekly){
      repeatString = strings.weekly;
    }
    else if(eventData.repeat === Verbs.eventRecurringEnum.WeekOfMonth){
      repeatString = format(
        strings.monthlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    }
    else if(eventData.repeat === Verbs.eventRecurringEnum.DayOfMonth){
      repeatString = format(
        strings.monthlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    }
    else if(eventData.repeat === Verbs.eventRecurringEnum.WeekOfYear){
      repeatString = format(
        strings.yearlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    }
    else if(eventData.repeat === Verbs.eventRecurringEnum.DayOfYear){
      repeatString = format(
        strings.yearlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    }

    if(eventData.repeat !== Verbs.eventRecurringEnum.Never){
      repeatString = format(
        strings.repeatTime,
        repeatString,
        moment(untilTime).format('MMM DD, YYYY hh:mm a')
      );
    }

    if (eventData.blocked) {
      blocked = eventData.blocked;
    }
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
          onPress={() => actionSheet.current.show()}>
          <Image
            source={images.vertical3Dot}
            style={styles.threeDotImageStyle}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
          console.log('dsfdsfasd', res[0]);
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
          console.log('dsfdsfasd', res);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [
    eventData?.created_by?.group_id,
    eventData?.created_by?.uid,
    eventData.going,
  ]);

  const attendAPICall = () => {
    setloading(true);
    attendEvent(eventData.cal_id, authContext)
      .then((response) => {
        console.log('response of attend', response);
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

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      <ActivityLoader visible={loading} />

      <View style={styles.sperateLine} />
      <ScrollView>
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
          <Text style={styles.sportTitleStyle}>
            {' '}
            {eventData?.selected_sport && eventData?.selected_sport?.sport_name}
          </Text>
        </Text>

        <EventTimeItem
          from={strings.from}
          fromTime={moment(startTime).format('MMM DD, YYYY hh:mm a')}
          to={strings.to}
          toTime={moment(endTime).format('MMM DD, YYYY hh:mm a')}
          repeat={strings.repeat}
          repeatTime={repeatString}
        />

        {!blocked ? (
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
        )}

        <Text style={[styles.textValueStyle, {marginLeft: 15}]}>
          {eventData?.location?.location_name}
        </Text>
        <TCThinDivider marginTop={15} marginBootom={15} />
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
        <EventItemRender title={strings.whoCanJoin}>
          <Text style={styles.textValueStyle}>
            {eventData?.who_can_join?.text}
          </Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender title={strings.numberOfAttend}>
          <Text style={styles.textValueStyle}>
            {format(
              strings.minMaxText_dy,
              eventData?.min_attendees,
              eventData?.max_attendees,
            )}
          </Text>
        </EventItemRender>

        <View style={styles.sepratorViewStyle} />
        <EventItemRender title={strings.eventFeeTitle}>
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

        <View marginBottom={70} />
      </ScrollView>

      <View
        style={{
          flex: 1,
          backgroundColor: colors.whiteColor,
          zIndex: 1000,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
          position: 'absolute',
          top: Dimensions.get('window').height - 190,
          width: '100%',
          height: '80%',
          shadowColor: colors.blackColor,
          shadowOffset: {width: 0, height: 5},
          shadowOpacity: 1.0,
          shadowRadius: 4,
          elevation: 2,
        }}>
        <TCProfileButton
          title={
            eventData?.going?.filter(
              (entity) => entity === authContext.entity.uid,
            ).length > 0
              ? 'Going'
              : 'Join'
          }
          style={[
            styles.firstButtonStyle,
            {width: isOrganizer ? '48%' : '100%'},
          ]}
          showArrow={false}
          imageStyle={styles.checkMarkStyle}
          textStyle={
            eventData?.going?.filter(
              (entity) => entity === authContext.entity.uid,
            ).length > 0
              ? [styles.attendTextStyle, {color: colors.lightBlackColor}]
              : styles.attendTextStyle
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

        {isOrganizer && (
          <TCProfileButton
            title={'Invite'}
            style={styles.firstButtonStyle}
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
        ref={editactionsheet}
        options={[strings.changeEventColor, strings.hide, strings.cancel]}
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
    tintColor: colors.blackColor,
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
    fontFamily: fonts.RRegular,
  },
  availableImageStyle: {
    width: 15,
    height: 15,
  },
  availableTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 10,
    color: colors.greeColor,
  },
  blockTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 10,
    color: colors.googleColor,
  },

  firstButtonStyle: {
    margin: 0,
    height: 28,
    width: '48%',
    borderRadius: 5,
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
});
