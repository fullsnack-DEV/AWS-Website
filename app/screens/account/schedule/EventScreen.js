import React, { useRef } from 'react';
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
import { ScrollView } from 'react-native-gesture-handler';
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

export default function EventScreen({ navigation, route }) {
  const actionSheet = useRef();
  const editactionsheet = useRef();

  let titleValue = '';
  let description = '';
  let eventColor = '';
  let startTime = '';
  let endTime = '';
  let location = '';
  let lati = null;
  let longi = null;
  let blocked = false;
  if (route && route.params && route.params.data) {
    if (route.params.data.title) {
      titleValue = route.params.data.title;
    }
    if (route.params.data.descriptions) {
      description = route.params.data.descriptions;
    }
    if (route.params.data.color) {
      eventColor = route.params.data.color;
    }
    if (route.params.data.start_datetime) {
      startTime = new Date(route.params.data.start_datetime * 1000);
    }
    if (route.params.data.end_datetime) {
      endTime = new Date(route.params.data.end_datetime * 1000);
    }
    if (route.params.data.location) {
      location = route.params.data.location;
    }
    if (route.params.data.latitude) {
      lati = route.params.data.latitude;
    }
    if (route.params.data.longitude) {
      longi = route.params.data.longitude;
    }
    if (route.params.data.isBlocked) {
      blocked = route.params.data.isBlocked;
    }
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
          <Text style={styles.eventTextStyle}>Event</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={() => actionSheet.current.show()}>
            <Image source={images.vertical3Dot} style={styles.threeDotImageStyle} />
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView>
        <EventItemRender
          title={strings.title}
        >
          <Text style={styles.textValueStyle}>{titleValue}</Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.about}
        >
          <Text style={styles.textValueStyle}>{description}</Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.eventColorTitle}
        >
          <View style={[styles.eventColorViewStyle, { backgroundColor: eventColor[0] !== '#' ? `#${eventColor}` : eventColor }]} />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.timeTitle}
        >
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
        <EventItemRender
          title={strings.place}
        >
          <Text style={styles.textValueStyle}>{location}</Text>
          <EventMapView
            region={{
              latitude: Number(lati),
              longitude: Number(longi),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: Number(lati),
              longitude: Number(longi),
            }}
          />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.availableTitle}
        >
          {!blocked ? <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Image source={images.checkWhiteLanguage} style={styles.availableImageStyle} />
            <Text style={styles.availableTextStyle}>{strings.available}</Text>
          </View> : <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <View style={styles.blockedImageViewStyle}>
              <Image source={images.cancelImage} style={styles.cancelImageStyle} resizeMode={'contain'} />
            </View>
            <Text style={[styles.availableTextStyle, { color: colors.veryLightBlack }]}>{strings.blocked}</Text>
          </View>}
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
            if (route && route.params && route.params.data) {
              navigation.navigate('EditEventScreen', { data: route.params.data });
            }
          } else if (index === 1) {
            Alert.alert(
              'Do you want to delete this event ?',
              '',
              [{
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },

              ],
              { cancelable: false },
            );
          }
        }}
      />
      <ActionSheet
        ref={editactionsheet}
        options={['Change Event Color', 'Hide', 'Cancel']}
        cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={() => {
        }}
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
    marginVertical: hp('0.5%'),
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
  eventColorViewStyle: {
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
