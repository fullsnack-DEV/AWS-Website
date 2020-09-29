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
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import TCGameButton from '../../../components/TCGameButton';
import TCEventView from '../../../components/TCEventView';

import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function GameDetailRecord({navigation}) {
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
          <Text style={styles.centerText}>0 : 0</Text>
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
      <ScrollView horizontal={true}>
        <SectionList
          renderItem={({item, index, section}) => (
            <View
              style={{
                backgroundColor: colors.grayBackgroundColor,
                marginBottom: 8,
                marginLeft: 30,
                marginRight: 30,
                height: 34,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={PATH.deleteRecentGoal}
                style={styles.playerImage}
              />
              <Text key={index}>.{item}</Text>
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.sectionHeader}>
              <Image source={PATH.team_ph} style={styles.TeamImage} />
              <Text style={styles.sectionText}>{title}</Text>
            </View>
          )}
          sections={[
            {title: 'ON FIELD', data: ['item1', 'item2', 'item7', 'item8']},
            {
              title: 'ON BENCH',
              data: [
                'item3',
                'item4',
                'item9',
                'item10',
                'item11',
                'item12',
                'item13',
              ],
            },
          ]}
          keyExtractor={(item, index) => item + index}
          style={{width: wp('72%'), height: hp('46%')}}
          showsVerticalScrollIndicator={false}
        />
        <View
          style={{
            height: hp('80%'),
            width: 1,
            backgroundColor: colors.lightgrayColor,
          }}
        />
        <SectionList
          renderItem={({item, index, section}) => (
            <View
              style={{
                backgroundColor: colors.grayBackgroundColor,
                marginBottom: 8,
                marginLeft: 30,
                marginRight: 30,
                height: 34,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={PATH.deleteRecentGoal}
                style={styles.playerImage}
              />
              <Text key={index}>.{item}</Text>
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.sectionHeader}>
              <Image source={PATH.team_ph} style={styles.TeamImage} />
              <Text style={styles.sectionText}>{title}</Text>
            </View>
          )}
          sections={[
            {title: 'ON FIELD', data: ['item1', 'item2', 'item7', 'item8']},
            {
              title: 'ON BENCH',
              data: ['item3', 'item4', 'item9', 'item10', 'item11'],
            },
          ]}
          keyExtractor={(item, index) => item + index}
          style={{width: wp('72%'), height: hp('46%')}}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      <View style={styles.bottomView}>
        <View style={styles.timeView}>
          <Text style={styles.timer}>90 : 00 : 00</Text>
          <View style={styles.curruentTimeView}>
            <Image source={PATH.curruentTime} style={styles.curruentTimeImg} />
          </View>
          <Text style={styles.startTime}>Game start at now</Text>
          <Image source={PATH.dropDownArrow} style={styles.downArrow} />
          <View style={styles.separatorLine}></View>
        </View>

        <View style={styles.buttonsView}>
          <TCGameButton
            title="Goal"
            onPress={() => alert('Game Start Presses..')}
            buttonColor={colors.whiteColor}
            imageName={PATH.gameGoal}
            textColor={colors.googleColor}
            imageSize={32}
          />
          <TCGameButton
            title="Own Goal"
            onPress={() => alert('Game Start Presses..')}
            buttonColor={colors.whiteColor}
            imageName={PATH.gameOwnGoal}
            textColor={colors.googleColor}
            imageSize={32}
          />
          <TCGameButton
            title="YC"
            onPress={() => alert('Game Start Presses..')}
            buttonColor={colors.whiteColor}
            imageName={PATH.gameYC}
            textColor={colors.googleColor}
            imageSize={32}
          />
          <TCGameButton
            title="RC"
            onPress={() => alert('Game Start Presses..')}
            buttonColor={colors.whiteColor}
            imageName={PATH.gameRC}
            textColor={colors.googleColor}
            imageSize={32}
          />
        </View>

        <View style={styles.bottomLine}></View>
        <View style={styles.gameRecordButtonView}>
          <TCGameButton
            title="Game Start"
            onPress={() => alert('Game Start Presses..')}
            buttonColor={colors.themeColor}
            imageName={PATH.gameStart}
            textColor={colors.themeColor}
            imageSize={15}
          />
          <TCGameButton
            title="Records"
            onPress={() => navigation.navigate('GameRecordList')}
            buttonColor={colors.darkGrayColor}
            imageName={PATH.gameRecord}
            textColor={colors.darkGrayColor}
            imageSize={25}
          />
          <TCGameButton
            title="Simple"
            onPress={() => alert('Game Details Presses..')}
            buttonColor={colors.gameDetailColor}
            imageName={PATH.gameDetail}
            textColor={colors.gameDetailColor}
            imageSize={25}
            // extraImageStyle={{tintColor: colors.whiteColor}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerView: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    height: 70,
    alignContent: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRightImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    marginRight: 20,
  },
  rightView: {
    //backgroundColor: 'red',
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
  curruentTimeView: {
    height: 30,
    width: 30,
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  profileShadow: {
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  centerText: {
    // fontFamily: fonts.RLight,
    fontSize: 30,
  },
  timeView: {
    // position: 'absolute',
    // bottom: 170,
    flexDirection: 'row',
    //backgroundColor: 'green',
    height: 70,
    alignItems: 'center',
  },
  separatorLine: {
    position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },
  timer: {
    // fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
  },
  startTime: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    // fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  downArrow: {
    height: 12,
    width: 12,
    resizeMode: 'contain',

    marginLeft: 10,
    marginRight: 15,
  },

  bottomView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.whiteColor,
    height: hp('34%'),

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  bottomLine: {
    //position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },
  gameRecordButtonView: {
    flexDirection: 'row',
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsView: {
    flexDirection: 'row',
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
  },
  sectionHeader: {
    paddingBottom: 8,
    marginBottom: 5,
    paddingLeft: 30,
    paddingTop: 10,
    backgroundColor: colors.whiteColor,

    flexDirection: 'row',
  },
  TeamImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    alignSelf: 'center',

    //marginRight: 15,
    borderRadius: 3,
  },
  sectionText: {
    fontSize: wp('3.2%'),
    // fontFamily: fonts.RRegular,
    color: colors.themeColor,
    marginLeft: 15,
    backgroundColor: colors.whiteColor,
  },
  playerImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 15,
    marginRight: 15,
  },
});
