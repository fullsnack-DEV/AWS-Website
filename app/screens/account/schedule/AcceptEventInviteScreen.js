import React, {useRef, useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {format} from 'react-string-format';
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
import {deleteEvent} from '../../../api/Schedule';
import {getGroupIndex, getUserIndex} from '../../../api/elasticSearch';
import TCProfileView from '../../../components/TCProfileView';
import TCGradientButton from '../../../components/TCGradientButton';
import {acceptRequest, declineRequest} from '../../../api/Notificaitons';
import Verbs from '../../../Constants/Verbs';

export default function AcceptEventInviteScreen({navigation, route}) {
  const actionSheet = useRef();
  const editactionsheet = useRef();
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [organizer, setOrganizer] = useState();
  const [going, setGoing] = useState([]);
  const [eventData] = useState(route?.params?.data);
  const [requestID] = useState(route?.params?.requestID);
  let titleValue = 'Game';
  let description = 'Game With';
  let description2 = '';
  let startTime = '';
  let endTime = '';
  let gameDataLati = null;
  let gameDataLongi = null;
  if (eventData) {
    if (eventData.title) {
      titleValue = eventData.title;
    }
    if (eventData.descriptions) {
      description = eventData.descriptions;
    }

    if (eventData.start_datetime) {
      startTime = new Date(eventData.start_datetime * 1000);
    }
    if (eventData.end_datetime) {
      endTime = new Date(eventData.end_datetime * 1000);
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

  useEffect(() => {
    const goingData = eventData.going ?? [];
    const getUserDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        terms: {
          'user_id.keyword': [...goingData, eventData.created_by.uid],
        },
      },
    };

    const getGroupDetailQuery = {
      size: 1000,
      from: 0,
      query: {
        bool: {
          must: [{match: {group_id: eventData.created_by.group_id}}],
        },
      },
    };

    if (eventData.created_by.group_id) {
      getGroupIndex(getGroupDetailQuery)
        .then((res) => {
          setOrganizer(res[0]);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e);
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
            Alert.alert(strings.alertmessagetitle, e);
          }, 10);
        });
    }
  }, [
    eventData.created_by.group_id,
    eventData.created_by.uid,
    eventData.going,
  ]);

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

  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest(requestId, authContext)
      .then(() => {
        navigation.pop(2);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);
    declineRequest(requestId, authContext)
      .then(() => {
        navigation.pop(2);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      <ActivityLoader visible={loading} />

      <View style={styles.sperateLine} />
      <ScrollView>
        <EventBackgroundPhoto
          isEdit={!!route?.params?.data?.background_thumbnail}
          isPreview={true}
          imageURL={
            route?.params?.data?.background_thumbnail
              ? {uri: route?.params?.data?.background_thumbnail}
              : images.backgroundGrayPlceholder
          }
        />

        <Text
          style={{
            fontFamily: fonts.RBold,
            fontSize: 20,
            color: colors.lightBlackColor,
            textAlign: 'center',
            marginLeft: 15,
            marginRight: 15,
          }}>
          {organizer?.full_name ?? organizer?.group_name}
          <Text
            style={{
              fontFamily: fonts.RMedium,
              fontSize: 20,
              color: colors.lightBlackColor,
            }}>
            {' '}
            {strings.inviteYouToJoinEventText}
          </Text>
        </Text>

        <View style={{alignSelf: 'center', margin: 15}}>
          <View style={styles.photoContainer}>
            <FastImage
              source={
                organizer?.thumbnail
                  ? {uri: organizer?.thumbnail}
                  : images.profilePlaceHolder
              }
              resizeMode={'contain'}
              style={styles.photoImageStyle}
            />
          </View>
          <Text style={styles.nameText}>
            {organizer?.full_name ?? organizer?.group_name}
          </Text>
          <Text
            style={
              styles.locationText
            }>{`${organizer?.city}, ${organizer?.state_abbr}`}</Text>
        </View>

        <Text style={[styles.textValueStyle, {margin: 15}]}>
          {description} {description2}
        </Text>

        <TCThinDivider marginBottom={15} />
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
          repeatTime={strings.repeatTime}
        />

        <Text style={[styles.textValueStyle, {marginLeft: 15}]}>
          {eventData?.location?.location_name}
        </Text>
        <TCThinDivider marginTop={15} marginBottom={15} />

        <TCThinDivider marginTop={10} />

        <View style={styles.containerStyle}>
          <Text
            style={
              styles.headerTextStyle
            }>{`${strings.goingTitle} (${going?.length})`}</Text>
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
        </View>

        <TCThinDivider marginTop={10} />
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
        <View style={styles.containerStyle}>
          <Text style={styles.headerTextStyle}>{strings.eventHost}</Text>
          <TCProfileView
            type="medium"
            name={organizer?.group_name ?? organizer?.full_name}
            location={`${organizer?.city}, ${organizer?.state_abbr}, ${organizer?.country}`}
            image={
              organizer?.thumbnail ? {uri: organizer?.thumbnail} : images.teamPH
            }
            alignSelf={'flex-start'}
            marginTop={10}
          />
        </View>

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

        <View style={styles.sepratorViewStyle} />
        <TCGradientButton
          title={strings.JOIN}
          onPress={() => {
            onAccept(requestID);
          }}
        />
        <TouchableOpacity
          style={{margin: 15}}
          onPress={() => {
            onDecline(requestID);
          }}>
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.lightBlackColor,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}>
            {strings.DECLINE}
          </Text>
        </TouchableOpacity>
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
  photoContainer: {
    backgroundColor: colors.whiteColor,
    height: 56,
    width: 56,
    borderRadius: 112,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
  locationText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
  photoImageStyle: {height: 54, width: 54, borderRadius: 108},
});
