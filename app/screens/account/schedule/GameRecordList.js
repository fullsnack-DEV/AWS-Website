import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import TCButton from '../../../components/TCButton';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  SectionList,
  ScrollView,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Dash from 'react-native-dash';

import TCCheckbox from '../../../components/TCCheckbox';
import TCEventView from '../../../components/TCEventView';
import {round} from 'react-native-reanimated';
import TCGameScoreLeft from '../../../components/gameRecordList/TCGameScoreLeft';
import TCGameScoreRight from '../../../components/gameRecordList/TCGameScoreRight';
import TCGameState from '../../../components/gameRecordList/TCGameState';

import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function GameRecordList({navigation}) {
  const [editorChecked, setEditorChecked] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => alert('This is a 3 dot button!')}>
          <Image source={PATH.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
          }}>
          <Dash
            style={{
              width: 1,
              height: 36,
              flexDirection: 'column',
            }}
            dashColor={colors.lightgrayColor}
          />
        </View>
        <View style={styles.editorView}>
          <Text>Show editors</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              setEditorChecked(!editorChecked);
            }}>
            {editorChecked == true ? (
              <Image source={PATH.checkEditor} style={styles.checkboxImg} />
            ) : (
              <Image source={PATH.uncheckEditor} style={styles.checkboxImg} />
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={styles.headerView}>
        <View style={styles.leftView}>
          <View style={styles.profileShadow}>
            <Image source={PATH.team_ph} style={styles.profileImg} />
          </View>
          <Text style={styles.leftText} numberOfLines={2}>
            Kishan Makani
          </Text>
        </View>
        <View style={styles.centerView}>
          <Text style={styles.centerText}>0</Text>
          <Dash
            style={{
              width: 1,
              height: 70,
              flexDirection: 'column',
              paddingLeft: 10,
              paddingRight: 10,
            }}
            dashColor={colors.lightgrayColor}
          />
          <Text style={styles.centerText}>0</Text>
        </View>
        <View style={styles.rightView}>
          <Text style={styles.rightText} numberOfLines={2}>
            Kishan Makani
          </Text>
          <View style={styles.profileShadow}>
            <Image source={PATH.team_ph} style={styles.profileImg} />
          </View>
        </View>
      </View>

      <FlatList
        data={[
          {key: 'Schedule'},
          {key: 'Referee'},
          {key: 'Teams'},
          {key: 'Clubs'},
          {key: 'Leagues'},
        ]}
        renderItem={({item}) => (
          <>
            <TCGameScoreLeft editor={editorChecked} />
            <TCGameScoreRight editor={editorChecked} />
            <TCGameState />
          </>
        )}
        scrollEnabled={true}
      />
      <View style={styles.updatedByView}>
        <Text
          style={{
            color: colors.grayColor,
            // fontFamily: fonts.RLight,
            fontSize: 14,
            marginLeft: 10,
          }}>
          Last updated by{'\n'}(Kishan Makani Team)
        </Text>
        <Text
          style={{
            color: colors.themeColor,
            // fontFamily: fonts.RLight,
            fontSize: 14,
            marginLeft: 10,
          }}>
          This game record hasn't yet been confirmed by the teams.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerView: {
    height: 70,
    alignContent: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingTop: 10,
  },
  headerRightImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    marginRight: 20,
  },
  checkboxImg: {
    width: 15,
    height: 15,

    paddingLeft: 30,
    marginRight: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  editorView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 20,
    //backgroundColor: 'red',
  },
  rightView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    width: wp('40%'),
  },
  leftView: {
    //backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  centerView: {
    //backgroundColor: 'blue',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('20%'),
  },
  profileImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',

    marginLeft: 15,
    marginRight: 15,
    borderRadius: 3,
  },
  curruentTimeImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },

  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  centerText: {
    // fontFamily: fonts.RLight,
    fontSize: 30,
  },
  matchStartedText: {
    alignSelf: 'center',
  },
  updatedByView: {
    marginTop: 10,
    height: hp('10%'),
  },
});
