import React from 'react';
import {StyleSheet, Image, View, TouchableOpacity, Text} from 'react-native';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import Header from '../../../components/Home/Header';
import fonts from '../../../Constants/Fonts';
import {widthPercentageToDP as wp} from '../../../utils';
import TennisDeletedRecordsList from '../../../components/game/tennis/TennisDeletedRecordsList';

export default function TennisDeletedRecordScreen({route, navigation}) {
  return (
    <View style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Deleted records</Text>
        }
      />
      <View style={styles.sperateLine} />
      <TennisDeletedRecordsList
        navigation={navigation}
        isAdmin={route?.params?.isAdmin}
        matchData={route?.params?.gameData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  sperateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
});
