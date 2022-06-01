import React, {useRef, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventTimeItem from '../../../components/Schedule/EventTimeItem';
import EventMapView from '../../../components/Schedule/EventMapView';
import strings from '../../../Constants/String';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import {getSportName} from '../../../utils';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import { deleteEvent } from '../../../api/Schedule';

export default function EventScreen({navigation, route}) {
  const actionSheet = useRef();
  const editactionsheet = useRef();
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [eventData] = useState(route?.params?.data);
  let titleValue = 'Game';
  let description = 'Game With';
  let description2 = '';
  let eventColor = colors.themeColor;
  let startTime = '';
  let endTime = '';
  let location = '';
  let lati = null;
  let longi = null;
  let gameDataLati = null;
  let gameDataLongi = null;
  let blocked = false;
  let venue = '';
  if (eventData) {
    if (eventData.title) {
      titleValue = eventData.title;
    }
    if (eventData.descriptions) {
      description = eventData.descriptions;
    }
    if (eventData.color) {
      eventColor = eventData.color;
    }
    if (eventData.start_datetime) {
      startTime = new Date(eventData.start_datetime * 1000);
    }
    if (eventData.end_datetime) {
      endTime = new Date(eventData.end_datetime * 1000);
    }
    if (eventData.location) {
      location = eventData.location;
    }
    if (eventData.latitude) {
      lati = eventData.latitude;
    }
    if (eventData.longitude) {
      longi = eventData.longitude;
    }
    if (eventData.isBlocked) {
      blocked = eventData.isBlocked;
    }
  }
  if (route && route.params && route.params.gameData) {
    if (route.params.gameData.game && route.params.gameData.game.away_team) {
      description2 = route.params.gameData.game.away_team.group_name;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      venue = route.params.gameData.game.venue.address;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      gameDataLati = route.params.gameData.game.venue.lat;
    }
    if (route.params.gameData.game && route.params.gameData.game.venue) {
      gameDataLongi = route.params.gameData.game.venue.long;
    }
  }

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      <ActivityLoader visible={loading} />

      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={<Text style={styles.eventTextStyle}>Event</Text>}
        rightComponent={
          <TouchableOpacity
            style={{padding: 2}}
            onPress={() => actionSheet.current.show()}>
            <Image
              source={images.vertical3Dot}
              style={styles.threeDotImageStyle}
            />
          </TouchableOpacity>
        }
      />
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

        <Text style={styles.eventTitleStyle}>
          {titleValue}
          <Text style={styles.sportTitleStyle}>
            {eventData?.selected_sport &&
              getSportName(eventData?.selected_sport, authContext)}
          </Text>
        </Text>

        <TCThinDivider marginTop={15} marginBootom={15}/>
        <EventItemRender title={strings.description}>
          <Text style={styles.textValueStyle}>
            {description} {description2}
          </Text>
        </EventItemRender>
        <TCThinDivider/>
        <EventItemRender title={strings.eventColorTitle}>
          <View
            style={[
              styles.eventColorViewStyle,
              {
                backgroundColor:
                  eventColor[0] !== '#' ? `#${eventColor}` : eventColor,
              },
            ]}
          />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender title={strings.timeTitle}>
          <EventTimeItem
            from={strings.from}
            fromTime={moment(startTime).format('MMM DD, YYYY hh:mm a')}
            to={strings.to}
            toTime={moment(endTime).format('MMM DD, YYYY hh:mm a')}
            repeat={strings.repeat}
            repeatTime={strings.repeatTime}
          />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender title={strings.place}>
          <Text style={styles.textValueStyle}>
            {location !== '' ? location : venue}
          </Text>
          <Text style={styles.textValueStyle}>
            {location !== '' ? location : venue}
          </Text>
          <EventMapView
            region={{
              latitude: lati !== null ? Number(lati) : Number(gameDataLati),
              longitude: longi !== null ? Number(longi) : Number(gameDataLongi),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: lati !== null ? Number(lati) : Number(gameDataLati),
              longitude: longi !== null ? Number(longi) : Number(gameDataLongi),
            }}
          />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender title={strings.availableTitle}>
          {!blocked ? (
            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Image
                source={images.checkWhiteLanguage}
                style={styles.availableImageStyle}
              />
              <Text style={styles.availableTextStyle}>{strings.available}</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', marginTop: 3}}>
              <View style={styles.blockedImageViewStyle}>
                <Image
                  source={images.cancelImage}
                  style={styles.cancelImageStyle}
                  resizeMode={'contain'}
                />
              </View>
              <Text
                style={[
                  styles.availableTextStyle,
                  {color: colors.veryLightBlack},
                ]}>
                {strings.blocked}
              </Text>
            </View>
          )}
        </EventItemRender>
      </ScrollView>
      <ActionSheet
        ref={actionSheet}
        options={['Edit', 'Delete', 'Cancel']}
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
              'Do you want to delete this event ?',
              '',
              [
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    setloading(true);
                        const entity = authContext.entity;
                        const uid = entity.uid || entity.auth.user_id;
                        const entityRole =
                          entity.role === 'user' ? 'users' : 'groups';
                        deleteEvent(
                          entityRole,
                          uid,
                          eventData.cal_id,
                          authContext,
                        )
                          .then(() =>
                          navigation.goBack()
                          )
                          .catch((e) => {
                            setloading(false);
                            Alert.alert('', e.messages);
                          });
                  },
                },
                {
                  text: 'Cancel',
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
        options={['Change Event Color', 'Hide', 'Cancel']}
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
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  threeDotImageStyle: {
    height: 18,
    width: 18,
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
  eventTitleStyle: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    marginTop: 3,
    marginLeft: 15,
    color: colors.lightBlackColor,
  },
  eventColorViewStyle: {
    width: wp('16%'),
    height: hp('3.5%'),
    marginTop: 3,
    borderRadius: 5,
  },
  sportTitleStyle: {
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
  blockedImageViewStyle: {
    height: 26,
    width: 26,
    borderRadius: 26 / 2,
    backgroundColor: colors.veryLightBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelImageStyle: {
    width: 10,
    height: 10,
    tintColor: colors.whiteColor,
  },
});
