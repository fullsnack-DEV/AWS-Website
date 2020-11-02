import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import EventTimeItem from '../../../components/Schedule/EventTimeItem';
import EventMapView from '../../../components/Schedule/EventMapView';

export default function EventScreen({ navigation }) {
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
          <TouchableOpacity style={{ padding: 2 }}>
            <Image source={images.vertical3Dot} style={styles.threeDotImageStyle} />
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <ScrollView>
        <EventItemRender
          title={'Title'}
        >
          <Text style={styles.textValueStyle}>{'Games with Vancouver Whitecaps'}</Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={'About'}
        >
          <Text style={styles.textValueStyle}>{'I love playing soccer, Association football, more more commonly known as football or soccer, [a] is a team sport played between seven teams of eleven players with a spherical ball.'}</Text>
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={'Event Color'}
        >
          <View style={styles.eventColorViewStyle} />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={'Time'}
        >
          <EventTimeItem
            from={'From'}
            fromTime={'Feb 15, 2019 1:00 am'}
            to={'To'}
            toTime={'Feb 15, 2019 1:00 am'}
            repeat={'Repeat'}
            repeatTime={'Weekly \n(Until Mar 25, 2019 12:00 am)'}
          />
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={'Place'}
        >
          <Text style={styles.textValueStyle}>{'800 Griffiths Way, Vancouver, BC V6B 6G1'}</Text>
          {/* {Platform.OS === 'ios' && ( */}
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
          {/* )} */}
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
          title={'Challenge Availability'}
        >
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            <Image source={images.checkWhiteLanguage} style={styles.availableImageStyle} />
            <Text style={styles.availableTextStyle}>{'Available'}</Text>
          </View>
        </EventItemRender>
      </ScrollView>
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
    fontFamily: fonts.RRegular,
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
