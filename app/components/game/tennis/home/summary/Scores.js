import React, { Fragment, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet, ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp } from '../../../../../utils';
import images from '../../../../../Constants/ImagePath';
import TCInnerLoader from '../../../../TCInnerLoader';

const Scores = ({ gameId, getTennisGameData }) => {
  const isFocused = useIsFocused();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamIds, setTeamIds] = useState(null);
  useEffect(() => {
    getGameData();
  }, [isFocused]);

  const getGameData = () => {
    setLoading(true);
    getTennisGameData(gameId).then((res) => {
      setGameData(res?.payload);
      if (res?.payload?.singlePlayerGame) {
        setTeamIds({
          home_team: { group_id: res?.payload?.home_team?.user_id },
          away_team: { group_id: res?.payload?.away_team?.user_id },
        })
      } else {
        setTeamIds({
          home_team: { group_id: res?.payload?.home_team?.group_id },
          away_team: { group_id: res?.payload?.away_team?.group_id },
        })
      }
    }).finally(() => setLoading(false))
  }

  const SingleColumn = ({
    headerText = '-',
    firstRowText = '-',
    secondRowText = '-',
    rowTextContainerStyle = {},
    headerTextStyle = {},
    firstRowTextStyle = {},
    secondRowTextStyle = {},
    isImageContainer = false,
    firstRowImage,
    secondRowImage,
  }) => (
    <View style={styles.singleColumnContainer}>
      <Text style={{ ...styles.headerText, ...headerTextStyle }}>{headerText}</Text>
      {!isImageContainer ? (
        <View style={{ ...styles.innerColumnContainer, ...rowTextContainerStyle }}>
          <Text style={{ ...styles.contentText, ...firstRowTextStyle }}>
            {firstRowText}
          </Text>
          <View style={styles.contentSeperator}/>
          <Text style={{ ...styles.contentText, ...secondRowTextStyle }}>
            {secondRowText}
          </Text>
        </View>
      ) : (
        <View style={{
          flex: 1, justifyContent: 'space-evenly', alignItems: 'center',
        }}>
          <FastImage
              source={firstRowImage ? { uri: firstRowImage } : images.profilePlaceHolder}
              style={{ width: 25, height: 25, borderRadius: 50 }}
          />
          <FastImage
              source={secondRowImage ? { uri: secondRowImage } : images.profilePlaceHolder}
              style={{ width: 25, height: 25, borderRadius: 50 }}
          />
        </View>
      )}

    </View>
  )

  const getTextGreterScoreTeamColor = (teamOneScore = 0, teamTwoScore = 0, teamNo = 1) => {
    let color = colors.lightBlackColor;
    if (teamOneScore !== teamTwoScore) {
      if (teamNo === 1 && teamOneScore > teamTwoScore) {
        color = colors.themeColor;
      } else if (teamNo === 2 && teamTwoScore > teamOneScore) {
        color = colors.themeColor;
      }
    }
    return color;
  }
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>
        Scores
      </Text>
      <TCInnerLoader visible={loading}/>
      {!loading && (
        <View style={styles.contentContainer}>

          {/* Previous Games */}
          <ScrollView
              style={{ maxWidth: '45%', flexWrap: 'wrap' }}
              bounces={false}
              bouncesZoom={false}
              horizontal={true}>
            {Array(gameData?.scoreboard?.sets?.length < 4 ? 4 : gameData?.scoreboard?.sets?.length).fill(0).map((item, index) => (
              <Fragment key={index}>
                <SingleColumn
                  headerText={index + 1}
                  firstRowText={gameData?.scoreboard?.sets?.[index]?.home_team_win_count ?? 0}
                  secondRowText={gameData?.scoreboard?.sets?.[index]?.away_team_win_count ?? 0}
                  rowTextContainerStyle={{ width: 35 }}
              />
              </Fragment>
            ))}
          </ScrollView>

          {/* Player  */}
          <SingleColumn
            headerText={'Player'}
            isImageContainer={true}
            firstRowImage={gameData?.home_team?.background_thumbnail}
            secondRowImage={gameData?.away_team?.background_thumbnail}
        />
          <ScrollView
              style={{ maxWidth: '40%', flexWrap: 'wrap' }}
              bounces={false}
              bouncesZoom={false}
              horizontal={true}>
            {/* Sets */}
            <SingleColumn
              headerTextStyle={{ fontFamily: fonts.RRegular, fontSize: 13, color: colors.themeColor }}
              headerText={'Sets'}
              firstRowText={
                gameData?.scoreboard?.sets?.length > 0
                  ? gameData?.scoreboard?.sets?.[gameData?.scoreboard?.sets?.length - 1]?.home_team_win_count
                  : 0}
              secondRowText={
                gameData?.scoreboard?.sets?.length > 0
                  ? gameData?.scoreboard?.sets?.[gameData?.scoreboard?.sets?.length - 1]?.away_team_win_count
                  : 0}
              rowTextContainerStyle={{ backgroundColor: 'rgba(255,138,1, 0.15)' }}
              firstRowTextStyle={{ color: getTextGreterScoreTeamColor(gameData?.scoreboard?.sets?.[gameData?.scoreboard?.sets?.length - 1]?.home_team_win_count, gameData?.scoreboard?.sets?.[gameData?.scoreboard?.sets?.length - 1]?.away_team_win_count, 1) }}
              secondRowTextStyle={{ color: getTextGreterScoreTeamColor(gameData?.scoreboard?.sets?.[gameData?.scoreboard?.sets?.length - 1]?.home_team_win_count, gameData?.scoreboard?.sets?.[gameData?.scoreboard?.sets?.length - 1]?.away_team_win_count, 2) }}
          />

            {/* Games */}
            <SingleColumn
              headerTextStyle={{ fontFamily: fonts.RRegular, fontSize: 13, color: colors.yellowColor }}
              headerText={'Games'}
              firstRowText={gameData?.scoreboard?.game_inprogress?.winner === teamIds?.home_team?.group_id ? 1 : 0}
              secondRowText={gameData?.scoreboard?.game_inprogress?.winner === teamIds?.away_team?.group_id ? 1 : 0}
              rowTextContainerStyle={{ backgroundColor: 'rgba(255,138,1, 0.15)' }}
              firstRowTextStyle={{ color: colors.themeColor }}
              secondRowTextStyle={{ color: colors.lightBlackColor }}
          />

            {/* Points */}
            <SingleColumn
            headerTextStyle={{ fontSize: 13 }}
            headerText={'points'}
            firstRowText={gameData?.scoreboard?.game_inprogress?.home_team_point ?? 0}
            secondRowText={gameData?.scoreboard?.game_inprogress?.away_team_point ?? 0}
            firstRowTextStyle={{ color: colors.themeColor }}
            rowTextContainerStyle={{ backgroundColor: 'rgba(255,138,1, 0.2)' }}
            secondRowTextStyle={{ color: colors.lightBlackColor }}
        />
          </ScrollView>
        </View>
      )}
    </View>)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  contentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleColumnContainer: {
    padding: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerColumnContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#F9F9F9',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  contentText: {
    paddingVertical: 5,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  contentSeperator: {
    height: 2,
    backgroundColor: colors.whiteColor,
    width: 22,
  },

})
export default Scores;
