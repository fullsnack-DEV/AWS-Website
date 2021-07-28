import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from '../../../../../utils';
import colors from '../../../../../Constants/Colors';
import TCWinningRangeChart from '../../../../TCWinningRangeChart';
import TCTeamVS from '../../../../TCTeamVS';
import TCThinDivider from '../../../../TCThinDivider';

const Rivalry = ({ gameData, rivalryData }) => {
const getHomeName = () => {
  if (gameData?.home_team?.group_name) {
    return `${gameData?.home_team?.group_name}`
  }
    return `${gameData?.home_team?.first_name} ${gameData?.home_team?.last_name}`
}

const getAwayName = () => {
  if (gameData?.away_team?.group_name) {
    return `${gameData?.away_team?.group_name}`
  }
    return `${gameData?.away_team?.first_name} ${gameData?.away_team?.last_name}`
}

const getHomeID = () => {
  if (gameData?.home_team?.group_id) {
    return gameData?.home_team?.group_id
  }
    return gameData?.home_team?.user_id
}

const getAwayID = () => {
  if (gameData?.away_team?.group_id) {
    return gameData?.away_team?.group_id
  }
    return gameData?.away_team?.user_id
}

  const GradiantIndicator = ({ gradiantColor, style }) => (
    <LinearGradient
      colors={gradiantColor}
      style={{ ...styles.gradiantIndicator, ...style }}
    />
  );
  return (
    <View>
      <View style={styles.mainContainer}>
        <TCTeamVS
          firstTeamName={
            getHomeName()
          }
          secondTeamName={
            getAwayName()
          }
          firstTeamProfilePic={gameData?.home_team?.thumbnail}
          secondTeamProfilePic={gameData?.away_team?.thumbnail}
        />
        <TCThinDivider width={'96%'} marginTop={8} />
        <View style={styles.teamIndicatorContainer}>
          <View style={styles.teamIndicatorContentContainer}>
            <GradiantIndicator
              gradiantColor={[colors.themeColor, colors.yellowColor]}
            />
            <Text>
              {getHomeName()}{' '}
              Win
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <GradiantIndicator
              gradiantColor={[
                colors.greenGradientStart,
                colors.greenGradientEnd,
              ]}
            />
            <Text>{'Draw'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <GradiantIndicator
              gradiantColor={[colors.blueGradiantStart, colors.blueGradiantEnd]}
            />
            <Text>
              {getAwayName()}{' '}
              Win
            </Text>
          </View>
        </View>
        {/* Total */}
        <TCWinningRangeChart
          heading={'Total'}
          totalCount={rivalryData?.all?.total ?? 0}
          teamOneCount={
            rivalryData?.all?.team_id === getHomeID()
              ? rivalryData?.all?.result?.win
              : 0
          }
          teamTwoCount={
            rivalryData?.all?.opp_team_id === getAwayID()
              ? rivalryData?.all?.result?.loose
              : 0
          }
          drawCount={rivalryData?.all?.result?.draw ?? 0}
        />
        {/* First Team */}
        <TCWinningRangeChart
          heading={`${getHomeName()}'s homes`}
          totalCount={rivalryData?.homeGames[0]?.total ?? 0}
          teamOneCount={
            rivalryData?.homeGames[0]?.team_id === getHomeID()
              ? rivalryData?.homeGames[0]?.result?.win
              : 0
          }
          teamTwoCount={
            rivalryData?.homeGames[0]?.opp_team_id
            === getAwayID()
              ? rivalryData?.homeGames[0]?.result?.loose
              : 0
          }
          drawCount={rivalryData?.homeGames[0]?.result?.draw ?? 0}
        />
        {/* Second Team */}
        <TCWinningRangeChart
          heading={`${getAwayName()}'s homes`}
          totalCount={rivalryData?.homeGames[1]?.total ?? 0}
          teamOneCount={
            rivalryData?.homeGames[1]?.opp_team_id
            === getHomeID()
              ? rivalryData?.homeGames[1]?.result?.loose
              : 0
          }
          teamTwoCount={
            rivalryData?.homeGames[1]?.team_id === getAwayID()
              ? rivalryData?.homeGames[1]?.result?.win
              : 0
          }
          drawCount={rivalryData?.homeGames[1]?.result?.draw ?? 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    marginTop: hp(1),
  },
  teamIndicatorContainer: {
    marginTop: hp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamIndicatorContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradiantIndicator: {
    marginTop: hp(0.3),
    height: 7,
    width: 7,
    borderRadius: 4,
    marginRight: 5,
    alignSelf: 'center',
  },
});

export default Rivalry;
