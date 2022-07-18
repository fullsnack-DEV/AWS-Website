import React, {useRef} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import TennisMatchRecordsList from './TennisMatchRecordsList';
import Header from '../../../components/Home/Header';
import fonts from '../../../Constants/Fonts';
import {widthPercentageToDP as wp} from '../../../utils';

export default function TennisRecordList({route, navigation}) {
  const matchRecords3DotRef = useRef();
  const onThreeDotPress = () => {
    matchRecords3DotRef.current.show();
  };
  return (
    <View style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Match records</Text>
        }
        rightComponent={
          route?.params?.isAdmin && (
            <TouchableWithoutFeedback onPress={onThreeDotPress}>
              <Image
                source={images.vertical3Dot}
                style={styles.headerRightImg}
              />
            </TouchableWithoutFeedback>
          )
        }
      />
      <View style={styles.sperateLine} />
      <TennisMatchRecordsList
        navigation={navigation}
        matchRecords3DotRef={matchRecords3DotRef}
        isAdmin={route?.params?.isAdmin}
        matchData={route?.params?.gameData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
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
