/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
  import ActivityLoader from '../../../components/loader/ActivityLoader';

  import AuthContext from '../../../auth/context';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import * as Utility from '../../../utils';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import images from '../../../Constants/ImagePath';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import {
  acceptDeclineChallenge,
  createChallenge,
} from '../../../api/Challenge';

let entity = {};
export default function ChallengePaymentScreen({ route, navigation }) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
    const isFocused = useIsFocused();
    const [loading, setloading] = useState(false);

    const [challengeData] = useState(
      route?.params?.challengeObj,
    );
    console.log(' route?.params?.challengeObj,', route?.params?.challengeObj);
    const [groupObj] = useState(
      route?.params?.groupObj,
    );
    const [defaultCard, setDefaultCard] = useState();

    useEffect(() => {
        if (isFocused) {
          if (route?.params?.paymentMethod) {
            setDefaultCard(route?.params?.paymentMethod);
          }
        }
      }, [isFocused, route?.params?.paymentMethod]);

      const getTimeDifferent = (sDate, eDate) => {
        let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

        const days = Math.floor(delta / 86400);
        delta -= days * 86400;

        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        return `${hours}h ${minutes}m`;
      };

      const sendChallenge = () => {
        entity = authContext.entity;
        console.log('Entity:=>', entity);

        const body = {
          ...challengeData,
          payment_method_type: 'card',
        };
        const homeID = body.home_team.group_id ?? body.home_team.user_id;
        const awayID = body.away_team.group_id ?? body.away_team.user_id;
        delete body.home_team;
        delete body.away_team;
        body.home_team = homeID;
        body.away_team = awayID;

        if (defaultCard) {
          body.source = defaultCard.id
        }

        console.log('Challenge Object:=>', body);

        setloading(true);
        createChallenge(body, authContext)
          .then((response) => {
            console.log(' challenge response:=>', response.payload);
            navigation.navigate('ChallengeSentScreen', {
              groupObj,
            });
            setloading(false);
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      };

      const challengeOperation = (teamID, ChallengeId, versionNo, status, payment) => {
        setloading(true);
        acceptDeclineChallenge(
          teamID,
          ChallengeId,
          versionNo,
          status,
          payment,
          authContext,
        )
          .then((response) => {
            setloading(false);
            let obj;
            if (challengeData?.home_team?.full_name) {
              if (challengeData?.home_team?.user_id === authContext?.entity?.uid) {
                obj = challengeData?.away_team;
              } else {
                obj = challengeData?.home_team;
              }
            } else if (
              challengeData?.home_team?.group_id === authContext?.entity?.uid
            ) {
              obj = challengeData?.away_team;
            } else {
              obj = challengeData?.home_team;
            }

            if (status === 'accept') {
              navigation.navigate('ChallengeAcceptedDeclinedScreen', {
                teamObj: {
                  ...obj,
                  game_id: response?.payload?.game_id,
                  sport: challengeData?.sport,
                },
                status: 'accept',
              });
            }
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <ChallengeHeaderView
        challenger={
          challengeData?.challenger === challengeData?.home_team?.user_id
          || challengeData?.challenger === challengeData?.home_team?.group_id
            ? challengeData?.home_team
            : challengeData?.away_team
        }
        challengee={
          challengeData?.challengee === challengeData?.home_team?.user_id
          || challengeData?.challengee === challengeData?.home_team?.group_id
            ? challengeData?.home_team
            : challengeData?.away_team
        }
        role={challengeData?.home_team?.user_id ? 'user' : 'team'}
      />
      <TCThinDivider />

      {route?.params?.type === 'challenge' && <View>

        <TCLabel title={`Game · ${challengeData?.sport}`} />
        <TCInfoImageField
          title={'Home'}
          image={
            challengeData?.home_team?.thumbnail
              ? { uri: challengeData?.home_team?.thumbnail }
              : challengeData?.home_team?.full_name
              ? images.profilePlaceHolder
              : images.teamPlaceholder
          }
          name={
            challengeData?.home_team?.group_name
            ?? challengeData?.home_team?.full_name
          }
          marginLeft={30}
        />
        <TCThinDivider />
        <TCInfoImageField
          title={'Away'}
          image={
            challengeData?.away_team?.thumbnail
              ? { uri: challengeData?.away_team?.thumbnail }
              : challengeData?.away_team?.full_name
              ? images.profilePlaceHolder
              : images.teamPlaceholder
          }
          name={
            challengeData?.away_team?.group_name
            ?? challengeData?.away_team?.full_name
          }
          marginLeft={30}
        />
        <TCThinDivider />

        <TCInfoField
          title={'Time'}
          value={`${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format('MMM DD, YYYY  hh:mm a')} -\n${moment(
            new Date(challengeData?.end_datetime * 1000),
          ).format('MMM DD, YYYY  hh:mm a')}\n( ${getTimeDifferent(
            new Date(challengeData?.start_datetime * 1000),
            new Date(challengeData?.end_datetime * 1000),
          )} )   `}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <TCThinDivider />

        <TCInfoField
          title={'Venue'}
          value={challengeData?.venue?.name}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <TCThinDivider />
        <TCInfoField
          title={'Address'}
          value={challengeData?.venue?.address}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <EventMapView
          coordinate={challengeData?.venue?.coordinate}
          region={challengeData?.venue?.region}
          style={styles.map}
        />
        <TCThickDivider marginTop={20} />
      </View>}

      <TCLabel title={'Payment details'} style={{ marginBottom: 15 }} />
      <GameFeeCard
        feeObject={{
          total_game_fee: challengeData?.total_game_fee,
          total_service_fee1: challengeData?.total_service_fee1,
          total_service_fee2: challengeData?.total_service_fee2,
          total_stripe_fee: challengeData?.total_stripe_fee,
          total_payout: challengeData?.total_payout,
          total_amount: challengeData?.total_amount,
        }}
        currency={challengeData?.game_fee?.currency_type}
        isChallenger={challengeData?.challenger === entity.uid}
      />
      <TCThickDivider marginTop={20} />

      <View >
        <TCLabel title={'Payment Method'} />
        <View style={styles.viewMarginStyle}>
          <TCTouchableLabel
            title={
              defaultCard && defaultCard?.card?.brand && defaultCard?.card?.last4
                ? `${Utility.capitalize(defaultCard?.card?.brand)} ****${defaultCard?.card?.last4}`
                : strings.addOptionMessage
            }
            showNextArrow={true}
            onPress={() => {
              navigation.navigate('PaymentMethodsScreen', {
                comeFrom: 'ChallengePaymentScreen',
              })
            }}
          />
        </View>
      </View>
      <TCThickDivider marginTop={20} />

      <TCChallengeTitle
            title={'Refund Policy'}
            value={challengeData?.refund_policy}
            tooltipText={
            '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
            }
            tooltipHeight={hp('18%')}
            tooltipWidth={wp('50%')}
          />
      <Text style={styles.normalTextStyle}>When you cancel this game reservation before
        3:55pm on August 11, you will get a 50% refund,
        minus the service fee. </Text>
      <TCThickDivider />

      <Text style={styles.termsTextStyle}>By selecting the button below, I agree to the Game Rules
        cancellation policy and refund policy. I also agree to pay
        the total amount shown above.</Text>

      <TCGradientButton
      isDisabled={!defaultCard}
        title={strings.confirmAndPayTitle}
        onPress={() => {
            // navigation.push('ChallengeSentScreen');

            if (route?.params?.type === 'challenge') {
              sendChallenge()
            } else {
              const paymentObj = { source: defaultCard.id, payment_method_type: 'card' }
              challengeOperation(
                entity.uid,
                challengeData?.challenge_id,
                challengeData?.version,
                'accept',
                paymentObj,
              );
            }
        }}
        outerContainerStyle={{ marginBottom: 45 }}
      />
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
  viewMarginStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  normalTextStyle: {
   margin: 15,
   marginTop: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  termsTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
  },
});
