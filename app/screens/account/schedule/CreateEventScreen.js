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
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../components/Home/Header';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

export default function CreateEventScreen({ navigation }) {
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
            <Text>Done</Text>
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
  },
});
