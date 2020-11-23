import React, { useLayoutEffect } from 'react';
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

import TCGameButton from '../../../components/TCGameButton';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'

export default function GameDetailRecord({ navigation }) {
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
          <Text style={ styles.centerText }>0 : 0</Text>
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
      <ScrollView horizontal={ true }>
        <SectionList
          renderItem={ ({ item, index }) => (
            <View
              style={ {
                backgroundColor: colors.grayBackgroundColor,
                marginBottom: 8,
                marginLeft: 30,
                marginRight: 30,
                height: 34,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
              } }>
              <Image
                source={ images.deleteRecentGoal }
                style={ styles.playerImage }
              />
              <Text key={ index }>.{item}</Text>
            </View>
          ) }
          renderSectionHeader={ ({ section: { title } }) => (
            <View style={ styles.sectionHeader }>
              <Image source={ images.team_ph } style={ styles.TeamImage } />
              <Text style={ styles.sectionText }>{title}</Text>
            </View>
          ) }
          sections={ [
            { title: 'ON FIELD', data: ['item1', 'item2', 'item7', 'item8'] },
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
          ] }
          keyExtractor={(item, index) => index.toString()}
          style={ { width: wp('72%'), height: hp('46%') } }
          showsVerticalScrollIndicator={ false }
        />
        <View
          style={ {
            height: hp('80%'),
            width: 1,
            backgroundColor: colors.lightgrayColor,
          } }
        />
        <SectionList
          renderItem={ ({ item, index }) => (
            <View
              style={ {
                backgroundColor: colors.grayBackgroundColor,
                marginBottom: 8,
                marginLeft: 30,
                marginRight: 30,
                height: 34,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
              } }>
              <Image
                source={ images.deleteRecentGoal }
                style={ styles.playerImage }
              />
              <Text key={ index }>.{item}</Text>
            </View>
          ) }
          renderSectionHeader={ ({ section: { title } }) => (
            <View style={ styles.sectionHeader }>
              <Image source={ images.team_ph } style={ styles.TeamImage } />
              <Text style={ styles.sectionText }>{title}</Text>
            </View>
          ) }
          sections={ [
            { title: 'ON FIELD', data: ['item1', 'item2', 'item7', 'item8'] },
            {
              title: 'ON BENCH',
              data: ['item3', 'item4', 'item9', 'item10', 'item11'],
            },
          ] }
          keyExtractor={(item, index) => index.toString()}
          style={ { width: wp('72%'), height: hp('46%') } }
          showsVerticalScrollIndicator={ false }
        />
      </ScrollView>

      <View style={ styles.bottomView }>
        <View style={ styles.timeView }>
          <Text style={ styles.timer }>90 : 00 : 00</Text>
          <View style={ styles.curruentTimeView }>
            <Image source={ images.curruentTime } style={ styles.curruentTimeImg } />
          </View>
          <Text style={ styles.startTime }>Game start at now</Text>
          <Image source={ images.dropDownArrow } style={ styles.downArrow } />
          <View style={ styles.separatorLine }></View>
        </View>

        <View style={ styles.buttonsView }>
          <TCGameButton
            title="Goal"
            onPress={ () => alert('Game Start Presses..') }
            buttonColor={ colors.whiteColor }
            imageName={ images.gameGoal }
            textColor={ colors.googleColor }
            imageSize={ 32 }
          />
          <TCGameButton
            title="Own Goal"
            onPress={ () => alert('Game Start Presses..') }
            buttonColor={ colors.whiteColor }
            imageName={ images.gameOwnGoal }
            textColor={ colors.googleColor }
            imageSize={ 32 }
          />
          <TCGameButton
            title="YC"
            onPress={ () => alert('Game Start Presses..') }
            buttonColor={ colors.whiteColor }
            imageName={ images.gameYC }
            textColor={ colors.googleColor }
            imageSize={ 32 }
          />
          <TCGameButton
            title="RC"
            onPress={ () => alert('Game Start Presses..') }
            buttonColor={ colors.whiteColor }
            imageName={ images.gameRC }
            textColor={ colors.googleColor }
            imageSize={ 32 }
          />
        </View>

        <View style={ styles.bottomLine }></View>
        <View style={ styles.gameRecordButtonView }>
          <TCGameButton
            title="Game Start"
            onPress={ () => alert('Game Start Presses..') }
            buttonColor={ colors.themeColor }
            imageName={ images.gameStart }
            textColor={ colors.themeColor }
            imageSize={ 15 }
          />
          <TCGameButton
            title="Records"
            onPress={ () => navigation.navigate('SoccerRecordList') }
            buttonColor={ colors.darkGrayColor }
            imageName={ images.gameRecord }
            textColor={ colors.darkGrayColor }
            imageSize={ 25 }
          />
          <TCGameButton
            title="Simple"
            onPress={ () => alert('Game Details Presses..') }
            buttonColor={ colors.gameDetailColor }
            imageName={ images.gameDetail }
            textColor={ colors.gameDetailColor }
            imageSize={ 25 }
            // extraImageStyle={{tintColor: colors.whiteColor}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  TeamImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    alignSelf: 'center',

    // marginRight: 15,
    borderRadius: 3,
  },
  bottomLine: {
    // position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },
  bottomView: {
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,

    height: hp('34%'),
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  buttonsView: {
    flexDirection: 'row',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
  },
  centerText: {
    // fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
    // backgroundColor: 'blue',
    alignItems: 'center',
    width: wp('20%'),
  },
  curruentTimeImg: {
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  curruentTimeView: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    elevation: 10,
    height: 30,
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    shadowColor: colors.googleColor,

    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: 30,
  },
  downArrow: {
    height: 12,
    marginLeft: 10,
    marginRight: 15,

    resizeMode: 'contain',
    width: 12,
  },
  gameRecordButtonView: {
    flexDirection: 'row',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.whiteColor,
    elevation: 10,
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: '100%',
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
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
  playerImage: {
    height: 20,
    marginLeft: 15,
    marginRight: 15,
    resizeMode: 'contain',
    width: 20,
  },
  profileImg: {
    borderRadius: 3,
    height: 30,
    marginLeft: 15,

    marginRight: 15,
    resizeMode: 'contain',
    width: 30,
  },
  profileShadow: {
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },

  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    width: wp('40%'),
  },
  sectionHeader: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    marginBottom: 5,
    paddingBottom: 8,
    paddingLeft: 30,

    paddingTop: 10,
  },
  sectionText: {
    fontSize: wp('3.2%'),
    // fontFamily: fonts.RRegular,
    color: colors.themeColor,
    marginLeft: 15,
    backgroundColor: colors.whiteColor,
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    bottom: 0,
    height: 0.5,
    position: 'absolute',
    width: wp('100%'),
  },
  startTime: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    // fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  timeView: {
    // position: 'absolute',
    // bottom: 170,
    flexDirection: 'row',
    // backgroundColor: 'green',
    height: 70,
    alignItems: 'center',
  },
  timer: {
    // fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
  },
});
