import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from '../../../../utils';
import colors from '../../../../Constants/Colors';
import TCWinningRangeChart from '../../../TCWinningRangeChart';
import TCTeamVS from '../../../TCTeamVS';

const Rivalry = ({ gameData, rivalryData }) => {
  const GradiantIndicator = ({ gradiantColor, style }) => (<LinearGradient
        colors={gradiantColor}
        style={{ ...styles.gradiantIndicator, ...style }}/>)
  return (<View>
    <View style={styles.mainContainer}>
      <TCTeamVS
        firstTeamName={gameData?.home_team?.group_name}
        secondTeamName={gameData?.away_team?.group_name}
        firstTeamProfilePic={gameData?.home_team?.background_thumbnail}
        secondTeamProfilePic={gameData?.away_team?.background_thumbnail}
      />
      <View style={styles.teamIndicatorContainer}>
        <View style={{ ...styles.teamIndicatorContentContainer, flex: 0.4 }}>
          <GradiantIndicator gradiantColor={[colors.themeColor, colors.yellowColor]}/>
          <Text style={{ flex: 1 }}>{gameData?.home_team?.group_name} Win</Text>
        </View>
        <View style={{ ...styles.teamIndicatorContentContainer, flex: 0.2 }}>
          <GradiantIndicator gradiantColor={[colors.greenGradientStart, colors.greenGradientEnd]}/>
          <Text style={{ flex: 1 }}>{'Draw'}</Text>
        </View>
        <View style={{ ...styles.teamIndicatorContentContainer, flex: 0.4 }}>
          <GradiantIndicator gradiantColor={[colors.blueGradiantStart, colors.blueGradiantEnd]}/>
          <Text style={{ flex: 1 }}>{gameData?.away_team?.group_name} Win</Text>
        </View>
      </View>
      {/* Total */}
      <TCWinningRangeChart
          heading={'Total'}
          totalCount={rivalryData?.all?.total ?? 0}
          teamOneCount={rivalryData?.all?.team_id === gameData?.home_team?.group_id ? rivalryData?.all?.result?.win : 0}
          teamTwoCount={rivalryData?.all?.opp_team_id === gameData?.away_team?.group_id ? rivalryData?.all?.result?.loose : 0}
          drawCount={rivalryData?.all?.result?.draw ?? 0}
      />
      {/* First Team */}
      <TCWinningRangeChart
          heading={`${gameData?.home_team?.group_name} fc's homes`}
          totalCount={rivalryData?.homeGames[0]?.total ?? 0}
          teamOneCount={rivalryData?.homeGames[0]?.team_id === gameData?.home_team?.group_id ? rivalryData?.homeGames[0]?.result?.win : 0}
          teamTwoCount={rivalryData?.homeGames[0]?.opp_team_id === gameData?.away_team?.group_id ? rivalryData?.homeGames[0]?.result?.loose : 0}
          drawCount={rivalryData?.homeGames[0]?.result?.draw ?? 0}
      />
      {/* Second Team */}
      <TCWinningRangeChart
          heading={`${gameData?.away_team?.group_name} fc's homes`}
          totalCount={rivalryData?.homeGames[1]?.total ?? 0}
          teamOneCount={rivalryData?.homeGames[1]?.opp_team_id === gameData?.home_team?.group_id ? rivalryData?.homeGames[1]?.result?.loose : 0}
          teamTwoCount={rivalryData?.homeGames[1]?.team_id === gameData?.away_team?.group_id ? rivalryData?.homeGames[1]?.result?.win : 0}
          drawCount={rivalryData?.homeGames[1]?.result?.draw ?? 0}
      />
    </View>
  </View>)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    marginTop: hp(1),
  },
  teamIndicatorContainer: {
    flex: 1,
    marginTop: hp(4),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  teamIndicatorContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  gradiantIndicator: {
    height: 14,
    width: 14,
    borderRadius: 15,
    marginRight: 5,
  },
})

export default Rivalry;
