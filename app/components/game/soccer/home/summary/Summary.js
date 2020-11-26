import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import { heightPercentageToDP as hp } from '../../../../../utils';
import MatchRecords from './MatchRecords';
import SpecialRules from './SpecialRules';
import Referees from './Referees';
import Scorekeepers from './Scorekeepers';
import TCGradientButton from '../../../../TCGradientButton';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import ApproveDisapprove from './approveDisapprove/ApproveDisapprove';
import { getGameMatchRecords } from '../../../../../api/Games';
import FeedsScreen from '../../../../../screens/newsfeeds/FeedsScreen';

const Summary = ({
  gameData,
  isAdmin,
  userRole,
  navigation,
  followSoccerUser,
  unFollowSoccerUser,
  approveDisapproveGameScore,
  getGameData,
}) => (<View style={styles.mainContainer}>
  <View style={{ marginBottom: hp(1), backgroundColor: colors.whiteColor, padding: 10 }}>
    {isAdmin && (
      <TCGradientButton
          onPress={() => navigation.navigate('SoccerRecording')}
              startGradientColor={colors.yellowColor}
              endGradientColor={colors.themeColor}
              title={'RECORD MATCH'}
              style={{
                borderRadius: 5,
              }}
              outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
          />
    )}
    {gameData?.status === 'ended' && !isAdmin && (
      <View>
        <TCGradientButton
          startGradientColor={colors.yellowColor}
          endGradientColor={colors.themeColor}
          title={'LEAVE REVIEW'}
          style={{
            borderRadius: 5,
          }}
          outerContainerStyle={{ marginHorizontal: 5, marginTop: 5, marginBottom: 0 }}
        />
        <Text style={styles.reviewPeriod}>
          Review period: <Text style={{ fontFamily: fonts.RBold }}>4d 23h 59m left</Text>
        </Text>
      </View>
    )}
  </View>
  {gameData?.status === 'ended' && (
    <ApproveDisapprove
        getGameData={getGameData}
        navigation={navigation}
        gameId={gameData?.game_id}
        gameData={gameData}
        approveDisapproveGameScore={approveDisapproveGameScore}
      />
  )}
  <MatchRecords
      navigation={navigation}
      gameId={gameData?.game_id}
      gameData={gameData}
      getGameMatchRecords={getGameMatchRecords}
  />
  <SpecialRules specialRulesData={gameData?.special_rule ?? ''} isAdmin={isAdmin}/>
  <Referees
      refereesData={gameData?.referees ?? []}
      isAdmin={isAdmin}
      userRole={userRole}
      followSoccerUser={followSoccerUser}
      unFollowSoccerUser={unFollowSoccerUser}
  />
  <Scorekeepers scorekeepersData={gameData?.scorekeepers ?? []} isAdmin={isAdmin} userRole={userRole}/>
  <View style={{ backgroundColor: colors.whiteColor }}>
    <FeedsScreen navigation={navigation}/>
  </View>
</View>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  reviewPeriod: {
    marginHorizontal: 5,
    fontSize: 12,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
})
export default Summary;
