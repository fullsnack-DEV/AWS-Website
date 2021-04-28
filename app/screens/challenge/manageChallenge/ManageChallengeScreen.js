/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,

} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
// import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function ManageChallengeScreen({ navigation }) {
  const [showBottomNotes, setShowBottomNotes] = useState(true);
//   const authContext = useContext(AuthContext);
  //  const [availibility, setAvailibility] = useState(route?.params?.availibility ?? '');
  //  const [gameType, setGameType] = useState(route?.params?.gameType ?? '');
  //  const [gameFee, setGameFee] = useState(route?.params?.gameFee ?? '');
//   const [refundPolicy, setRefundPolicy] = useState();
//   const [challenge, setChallenge] = useState();
//   const [homeAway, setHomeAway] = useState();
//   const [gameDuration, setGameDuration] = useState();
//   const [venue, setVenue] = useState();
//   const [gameRules, setGameRules] = useState();
//   const [referees, setReferees] = useState();
//   const [scorekeepers, setScorekeepers] = useState();

  const challengeSettingMenu = [
    { key: 'Availability', id: 1 },
    { key: 'Game Type', id: 2 },
    { key: 'Game Fee', id: 3 },
    { key: 'Refund Policy', id: 4 },
    { key: 'Home & Away', id: 5 },
    { key: 'Game Duration', id: 6 },
    { key: 'Venue', id: 7 },
    { key: 'Game Rules', id: 8 },
    { key: 'Referees', id: 9 },
    { key: 'Scorekeepers', id: 10 },
  ];
  const handleOpetions = async (opetions) => {
    if (opetions === 'Availability') {
      navigation.navigate('Availibility');
    } else if (opetions === 'Game Type') {
      navigation.navigate('GameType');
    } else if (opetions === 'Game Fee') {
        navigation.navigate('GameFee');
    } else if (opetions === 'Refund Policy') {
        navigation.navigate('RefundPolicy');
    } else if (opetions === 'Home & Away') {
      navigation.navigate('HomeAway');
    } else if (opetions === 'Game Duration') {
      navigation.navigate('GameDuration');
    } else if (opetions === 'Venue') {
        navigation.navigate('Venue');
    } else if (opetions === 'Game Rules') {
        navigation.navigate('GameRules');
    } else if (opetions === 'Referees') {
      navigation.navigate('RefereesSetting');
    } else if (opetions === 'Scorekeepers') {
      navigation.navigate('ScorekeepersSetting');
    }
  };
  // const getSettingValue = (item) => {
  //   if (item.key === 'Availability') {
  //     if (availibility !== '') {
  //       if (availibility === true) {
  //         return 'On'
  //       }
  //       if (availibility === false) {
  //         return 'Off'
  //       }
  //     }
  //   }

  //   if (item.key === 'Game Type') {
  //     if (gameType !== '') {
  //       if (gameType === strings.officialOnly) {
  //         return 'Official'
  //       }
  //       if (gameType === strings.friendlyOnly) {
  //         return 'Friendly'
  //       }
  //       if (gameType === strings.allType) {
  //         return 'All'
  //       }
  //     }
  //   }
  //   if (item.key === 'Game Fee') {
  //     if (gameFee !== '') {
  //         return `$${gameFee} CAD`
  //     }
  //   }

  //     return 'incomplete'
  // }
  const renderMenu = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.listItems}>{item.key}</Text>

        <Text style={styles.incompleteStyle}>
          {/* {getSettingValue(item)} */}
          incomplete
        </Text>

        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <View
          style={{ padding: 15, backgroundColor: colors.grayBackgroundColor }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            {strings.challengeSettingTitle}
          </Text>
        </View>
        <FlatList
          data={challengeSettingMenu}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
      {showBottomNotes && <LinearGradient
        colors={[colors.yellowColor, colors.orangeGradientColor]}
        style={styles.challengeNotesView}>

        <Text
            style={{
              color: colors.whiteColor,
              fontFamily: fonts.RBold,
              fontSize: 14,
              width: '88%',
            }}>
          {strings.challengeSettingNotes}
        </Text>
        <TouchableOpacity onPress={() => setShowBottomNotes(false)}>
          <Image
              source={images.cancelWhite}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: colors.whiteColor,
              }}
            />
        </TouchableOpacity>

      </LinearGradient>}
    </>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  incompleteStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.redColor,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  challengeNotesView: {
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
});
