import React, { useLayoutEffect, useState } from 'react';
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
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
// import ActionSheet from 'react-native-actionsheet';
// import {
//   getGameByGameID, addGameRecord, resetGame, decreaseGameScore,
// } from '../../../api/Games';
import TCGameButton from '../../../components/TCGameButton';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';

// const entity = {};
// let lastTimeStamp;
// let lastVerb;
const recordButtonList = ['Goal', 'Own Goal', 'YC', 'RC', 'In', 'Out']
const assistButtonList = ['Assist']
export default function GameDetailRecord({ navigation }) {
  const [pickerShow, setPickerShow] = useState(false);
  const [selectedMemberID, setSelectedMemberID] = useState();
  const [isAssist, setIsAssist] = useState(false);
  const [selectedAssistMemberID, setSelectedAssistMemberID] = useState();

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
  const renderGameButton = ({ item }) => (
    <TCGameButton
    title={item}
    onPress={ () => {
      if (item === 'Goal') {
        if (selectedMemberID) {
          Alert.alert(
            'Do you want to add an assist?',
            'If yes, choose a player and click the assist button.',
            [{
              text: 'No',
              style: 'no',
            },
            {
              text: 'Yes',
              onPress: () => {
                setIsAssist(true)
              },
            },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert('Please select player first.')
        }
      }
      if (item === 'Assist') {
        if (selectedAssistMemberID) {
          console.log('OK');
        } else {
          Alert.alert('Please select player first.')
        }
      }
    } }
    buttonColor={ colors.whiteColor }
    imageName={ (item === 'Goal' && images.gameGoal)
    || (item === 'Own Goal' && images.gameOwnGoal)
    || (item === 'YC' && images.gameYC)
    || (item === 'RC' && images.gameRC)
    || (item === 'In' && images.gameIn)
    || (item === 'Out' && images.gameOut)
    || (item === 'Assist' && images.assistsImage)
  }
    textColor={ colors.googleColor }
    imageSize={ 32 }
  />

  );
  const renderHomeSectionItems = ({
    item, index, section,
  }) => (
    <TouchableOpacity
    onPress={() => {
      if (isAssist) {
        setSelectedAssistMemberID(item)
      } else {
        setSelectedMemberID(item)
      }

      console.log('Pressed Item::', index, '::', section.data[index], '::', section.title, ':: Home');
    }}
     >
      {selectedMemberID === item || selectedAssistMemberID === item ? <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={ styles.orangeFieldView }
                >
        <Image
      source={ images.profilePlaceHolder }
      style={ styles.playerImage }
    />
        <View style={[styles.dividerView, { backgroundColor: colors.whiteColor }]}></View>
        <Text style={styles.whitePlayerName} key={ index }>.{item}</Text>
      </LinearGradient> : <View style={ styles.normalFieldView }>
        <Image
      source={ images.profilePlaceHolder }
      style={ styles.playerImage }
    />
        <View style={[styles.dividerView, { backgroundColor: colors.smallDividerColor }]}></View>
        <Text style={styles.blackPlayerName} key={ index }>.{item}</Text>
      </View> }
    </TouchableOpacity>
  );
  const renderAwaySectionItems = ({
    item, index, section,
  }) => (
    <TouchableOpacity
    onPress={() => {
      if (isAssist) {
        setSelectedAssistMemberID(item)
      } else {
        setSelectedMemberID(item)
      }
      console.log('Pressed Item::', index, '::', section.data[index], '::', section.title, ':: Away');
    }}
     >
      {selectedMemberID === item || selectedAssistMemberID === item ? <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={ styles.orangeFieldView }
                >
        <Image
      source={ images.profilePlaceHolder }
      style={ styles.playerImage }
    />
        <View style={[styles.dividerView, { backgroundColor: colors.whiteColor }]}></View>
        <Text style={styles.whitePlayerName} key={ index }>.{item}</Text>
      </LinearGradient> : <View style={ styles.normalFieldView }>
        <Image
      source={ images.profilePlaceHolder }
      style={ styles.playerImage }
    />
        <View style={[styles.dividerView, { backgroundColor: colors.smallDividerColor }]}></View>
        <Text style={styles.blackPlayerName} key={ index }>.{item}</Text>
      </View> }
    </TouchableOpacity>
  );
  return (
    <View style={ styles.mainContainer }>
      <View style={ styles.headerView }>
        <View style={ styles.leftView }>
          <View style={ styles.profileShadow }>
            <Image source={ images.teamPlaceholder } style={ styles.profileImg } />
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
            <Image source={ images.teamPlaceholder } style={ styles.profileImg } />
          </View>
        </View>
      </View>

      <ScrollView
      horizontal={ true }
      showsHorizontalScrollIndicator={false}>
        <SectionList
          renderItem={renderHomeSectionItems}
          renderSectionHeader={ ({ section: { title } }) => (
            <View style={ styles.sectionHeader }>
              <Image source={ images.teamPlaceholder } style={ styles.TeamImage } />
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
          style={ { width: wp('72%'), height: hp('43%') } }
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
          renderItem={ renderAwaySectionItems}
          renderSectionHeader={ ({ section: { title } }) => (
            <View style={ styles.sectionHeader }>
              <Image source={ images.teamPlaceholder } style={ styles.TeamImage } />
              <Text style={ styles.sectionText }>{title}</Text>
            </View>
          ) }
          sections={ [
            { title: 'ON FIELD', data: ['item1', 'item2', 'item7', 'item8'] },
            {
              title: 'ON BENCH',
              data: ['item3', 'item4', 'item9', 'item10', 'item11', 'item12'],
            },
          ] }
          keyExtractor={(item, index) => index.toString()}
          style={ { width: wp('72%'), height: hp('43%') } }
          showsVerticalScrollIndicator={ false }
        />
      </ScrollView>

      <View style={ styles.bottomView }>
        <View style={ styles.timeView }>
          <Text style={ styles.timer }>90 : 00 : 00</Text>
          {pickerShow && <View style={ styles.curruentTimeView }>
            <Image source={ images.curruentTime } style={ styles.curruentTimeImg } />
          </View>}
          <Text
            style={styles.startTime}
            onPress={() => {
              setPickerShow(!pickerShow);
            }}>Game start at now</Text>
          <Image source={ images.dropDownArrow } style={ styles.downArrow } />
          <View style={ styles.separatorLine }></View>
        </View>
        {pickerShow && (
          <View>
            <RNDateTimePicker value={new Date()} mode={'datetime'} />
            <View style={styles.separatorLine} />
          </View>
        )}
        <FlatList
            data={isAssist ? assistButtonList : recordButtonList}
            renderItem={renderGameButton}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
           horizontal={true}
           style={{ marginBottom: 10, alignSelf: 'center' }}
          />

        <View style={{ flex: 1 }} />
        <View style={ styles.bottomLine }></View>
        <View style={styles.gameRecordButtonView}>
          <TCGameButton
            title="Start"
            onPress={() => alert('Game Start Presses..')}
            gradientColor={[colors.yellowColor, colors.themeColor]}
            imageName={images.gameStart}
            textColor={colors.themeColor}
            imageSize={24}
          />
          <TCGameButton
            title="Records"
            onPress={() => navigation.navigate('SoccerRecordList')}
            gradientColor={[colors.veryLightBlack, colors.veryLightBlack]}
            imageName={images.gameRecord}
            textColor={colors.darkGrayColor}
            imageSize={25}
          />
          <TCGameButton
            title="Details"
            onPress={() => navigation.navigate('GameDetailRecord')}
            gradientColor={[colors.greenGradientStart, colors.greenGradientEnd]}
            imageName={images.gameDetail}
            textColor={colors.gameDetailColor}
            imageSize={30}
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
    borderRadius: 3,
  },
  bottomLine: {
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
  centerText: {
    fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
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
    fontFamily: fonts.RMedium,
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
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightView: {
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
    fontFamily: fonts.RRegular,
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
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  timeView: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
  },
  timer: {
    fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
  },
  dividerView: {
    marginLeft: 15,
    marginRight: 15,
    height: 15,
    width: 1,

  },
  normalFieldView: {
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 8,
    marginLeft: 30,
    marginRight: 30,
    height: 34,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orangeFieldView: {
    backgroundColor: colors.grayBackgroundColor,
    marginBottom: 8,
    marginLeft: 30,
    marginRight: 30,
    height: 34,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whitePlayerName: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.whiteColor,
  },
  blackPlayerName: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
