import React, { useContext } from 'react';
import {
 StyleSheet, View, Text,
 } from 'react-native';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCLabel from '../../../components/TCLabel';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import SecureRefereeView from '../../../components/SecureRefereeView';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
import ChallengeStatusView from '../../../components/challenge/ChallengeStatusView';
import ReservationStatus from '../../../Constants/ReservationStatus';
import { widthPercentageToDP } from '../../../utils';
import TCSmallButton from '../../../components/TCSmallButton';

export default function ChallengePreviewScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  return (
    <TCKeyboardView>
      <Text style={styles.challengeNumberStyle}>Request No.111125D3</Text>
      <ChallengeHeaderView />
      <TCThinDivider />
      {/* offered: 'offered',*
  changeRequest: 'changeRequest',*
  accepted: 'accepted',*
  restored: 'restored',*
  declined: 'declined',*
  cancelled: 'cancelled',*
  pendingpayment: 'pendingpayment',*
  pendingrequestpayment: 'pendingrequestpayment',*
  requestcancelled: 'requestcancelled',*  */}
      <ChallengeStatusView
        isSender={!true}
        isTeam={true}
        senderName={'Sender Team'}
        receiverName={'Receiver Team'}
        offerExpiry={
          ReservationStatus.offered === 'offered'
          || ReservationStatus.offered === 'changeRequest'
            ? new Date().getTime()
            : ''
        } // only if status offered
        status={ReservationStatus.accepted}
      />
      <TCThickDivider />

      <View>
        <TCLabel title={'Match · Soccer'} />

        <TCInfoImageField
          title={'Home'}
          // image = {route.params.teamData[0]?.thumbnail && route.params.teamData[0].thumbnail}
          name={'Makani Team'}
          marginLeft={30}
        />
        <TCThinDivider />
        <TCInfoImageField
          title={'Away'}
          // image = {route.params.teamData[1]?.thumbnail && route.params.teamData[1].thumbnail}
          name={'Kishan Team'}
          marginLeft={30}
        />
        <TCThinDivider />

        <TCInfoField
          title={'Time'}
          value={'Feb 15, 2020  12:00pm -\nFeb 15, 2020  3:30pm\n( 3h 30m )   '}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <TCThinDivider />

        <TCInfoField
          title={'Venue'}
          value={'Test Address venue'}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <TCThinDivider />
        <TCInfoField
          title={'Address'}
          value={'Test Address sescription'}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <EventMapView
          coordinate={{
            latitude: 27.45425,
            longitude: 72.456485,
          }}
          region={{
            latitude: 27.45425,
            longitude: 72.456485,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        />
        <TCThickDivider marginTop={20} />
      </View>

      {/* {bodyParams?.sport.toLowerCase() === 'tennis' && <View>
        <TCGameDetailRules gameRules={bodyParams?.gameRules}/>
        <TCThickDivider marginTop={20} />
      </View>} */}

      <TCLabel title={'Game Duration'} />
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 15, marginBottom: 5 }}
        title={'1st period'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={'30'}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={'Interval'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={'35'}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 20 }}
        title={'2nd period'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={'25'}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <Text style={styles.normalTextStyle}>{strings.gameDurationTitle2}</Text>
      <TCThickDivider marginTop={20} />

      <View>
        <TCLabel title={'Game Rules'} style={{ marginBottom: 15 }} />
        <Text style={styles.venueTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>
          1. Tackle is not allowed 2. 3 times of 30 minute game for 90 minute
        </Text>
        <TCThickDivider marginTop={20} />
      </View>

      <TCChallengeTitle
        title={'Referees'}
        value={'2'}
        staticValueText={'Referees'}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
      />
      <SecureRefereeView
        entityName={'Makani Team'}
        entity={'Referee'}
        entityNumber={1}
      />
      <TCThickDivider marginTop={20} />

      <TCChallengeTitle
        title={'Scorekeepers'}
        value={'2'}
        staticValueText={'Scorekeepers'}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
      />
      <SecureRefereeView
        entityName={'Kishan Team'}
        entity={'Scorekeeper'}
        entityNumber={1}
      />
      <TCThickDivider marginTop={20} />

      <TCLabel title={'Payment'} style={{ marginBottom: 15 }} />
      <GameFeeCard />
      <TCThickDivider marginTop={20} />

      {/* <TCGradientButton
        title={strings.nextTitle}
        onPress={() => {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', { status: 'accept', teamObj: authContext.entity.obj })
        }}
        outerContainerStyle={{ marginBottom: 45 }}
      /> */}
      <View
        style={styles.bottomButtonContainer}>
        <TCSmallButton
          isBorderButton={true}
          borderstyle={{
            borderColor: colors.userPostTimeColor,
            borderWidth: 1,
            borderRadious: 80,
          }}
          textStyle={{ color: colors.userPostTimeColor }}
          title={strings.declineTitle}
          onPress={() => {
            navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              status: 'accept',
              teamObj: authContext.entity.obj,
            });
          }}
          style={{ width: widthPercentageToDP('45%') }}
        />
        <TCSmallButton
          title={strings.acceptTitle}
          onPress={() => {
            navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              status: 'accept',
              teamObj: authContext.entity.obj,
            });
          }}
          style={{ width: widthPercentageToDP('45%') }}
        />
      </View>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
  },

  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },

  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  normalTextStyle: {
    marginLeft: 25,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.RRegular,
  },
  challengeNumberStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    alignSelf: 'flex-end',
    margin: 15,
    marginBottom: 0,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    marginBottom: 45,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
});
