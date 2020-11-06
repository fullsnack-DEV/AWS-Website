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

export default function EventScreen({ navigation }) {
  const actionSheet = useRef();
  const editactionsheet = useRef();

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
          title={strings.titleValue}
        >
          <Text style={styles.textValueStyle}>{strings.titleValue}</Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.about}
        >
          <Text style={styles.textValueStyle}>{strings.aboutValue}</Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.eventColorTitle}
        >
          <View style={styles.eventColorViewStyle} />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.timeTitle}
        >
          <EventTimeItem
            from={strings.from}
            fromTime={strings.fromTime}
            to={strings.to}
            toTime={strings.fromTime}
            repeat={strings.repeat}
            repeatTime={strings.repeatTime}
          />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.place}
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
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={strings.availableTitle}
        >
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Image source={images.checkWhiteLanguage} style={styles.availableImageStyle} />
            <Text style={styles.availableTextStyle}>{strings.available}</Text>
          </View>
        </EventItemRender>
      </ScrollView>
      <ActionSheet
        ref={actionSheet}
        options={['Edit', 'Delete', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            editactionsheet.current.show();
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
        onPress={(index) => {
          if (index === 1) {
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
});
