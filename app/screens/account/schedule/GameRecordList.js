import React, {
  useState, useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,

  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Dash from 'react-native-dash';

import TCGameScoreLeft from '../../../components/gameRecordList/TCGameScoreLeft';
import TCGameScoreRight from '../../../components/gameRecordList/TCGameScoreRight';
import TCGameState from '../../../components/gameRecordList/TCGameState';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'

export default function GameRecordList({ navigation }) {
  const [editorChecked, setEditorChecked] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableWithoutFeedback
          onPress={ () => alert('This is a 3 dot button!') }>
              <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
          </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
      <View style={ styles.mainContainer }>
          <View style={ { flexDirection: 'row' } }>
              <View
          style={ {
            alignSelf: 'center',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
          } }>
                  <Dash
            style={ {
              width: 1,
              height: 36,
              flexDirection: 'column',
            } }
            dashColor={ colors.lightgrayColor }
          />
              </View>
              <View style={ styles.editorView }>
                  <Text>Show editors</Text>
                  <TouchableWithoutFeedback
            onPress={ () => {
              setEditorChecked(!editorChecked);
            } }>
                      {editorChecked === true ? (
                          <Image source={ images.checkEditor } style={ styles.checkboxImg } />
                      ) : (
                          <Image source={ images.uncheckEditor } style={ styles.checkboxImg } />
                      )}
                  </TouchableWithoutFeedback>
              </View>
          </View>

          <View style={ styles.headerView }>
              <View style={ styles.leftView }>
                  <View style={ styles.profileShadow }>
                      <Image source={ images.team_ph } style={ styles.profileImg } />
                  </View>
                  <Text style={ styles.leftText } numberOfLines={ 2 }>
                      Kishan Makani
                  </Text>
              </View>
              <View style={ styles.centerView }>
                  <Text style={ styles.centerText }>0</Text>
                  <Dash
            style={ {
              width: 1,
              height: 70,
              flexDirection: 'column',
              paddingLeft: 10,
              paddingRight: 10,
            } }
            dashColor={ colors.lightgrayColor }
          />
                  <Text style={ styles.centerText }>0</Text>
              </View>
              <View style={ styles.rightView }>
                  <Text style={ styles.rightText } numberOfLines={ 2 }>
                      Kishan Makani
                  </Text>
                  <View style={ styles.profileShadow }>
                      <Image source={ images.team_ph } style={ styles.profileImg } />
                  </View>
              </View>
          </View>

          <FlatList
        data={ [
          { key: 'Schedule' },
          { key: 'Referee' },
          { key: 'Teams' },
          { key: 'Clubs' },
          { key: 'Leagues' },
        ] }
        renderItem={ () => (
            <>
                <TCGameScoreLeft editor={ editorChecked } />
                <TCGameScoreRight editor={ editorChecked } />
                <TCGameState />
            </>
        ) }
        scrollEnabled={ true }
      />
          <View style={ styles.updatedByView }>
              <Text
          style={ {
            color: colors.grayColor,
            // fontFamily: fonts.RLight,
            fontSize: 14,
            marginLeft: 10,
          } }>
                  Last updated by{'\n'}(Kishan Makani Team)
              </Text>
              <Text
          style={ {
            color: colors.themeColor,
            // fontFamily: fonts.RLight,
            fontSize: 14,
            marginLeft: 10,
          } }>

              </Text>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    // fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('20%'),
  },
  checkboxImg: {
    alignSelf: 'center',
    height: 15,

    marginRight: 10,
    paddingLeft: 30,
    resizeMode: 'contain',
    width: 15,
  },

  editorView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 20,
    // backgroundColor: 'red',
  },
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  headerView: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    width: '100%',
    // paddingTop: 10,
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  leftView: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  mainContainer: {
    flex: 1,
  },

  profileImg: {
    borderRadius: 3,
    height: 30,
    marginLeft: 15,

    marginRight: 15,
    resizeMode: 'contain',
    width: 30,
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  rightView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',

    width: wp('40%'),
  },
  updatedByView: {
    height: hp('10%'),
    marginTop: 10,
  },
});
