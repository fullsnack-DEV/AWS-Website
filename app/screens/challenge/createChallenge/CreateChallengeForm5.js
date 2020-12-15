import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import { getFeesEstimation, createChallenge } from '../../../api/Challenge';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCLabel from '../../../components/TCLabel';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import ActivityLoader from '../../../components/loader/ActivityLoader';

let entity = {};
let body = {};
export default function CreateChallengeForm5({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  // const [paymentInfo, setPaymentInfo] = useState();
  // const [homeTeam, setHomeTeam] = useState();
  // const [awayTeam, setAwayTeam] = useState();

  useEffect(() => {
    getAuthEntity();
    getFeeDetail();
  }, [isFocused]);
  const getAuthEntity = async () => {
    entity = authContext.entity;
  };
  const getFeeDetail = () => {
    if (route && route.params && route.params.teamData && route.params.body) {
      if (route.params.teamData[0].group_id === entity.uid) {
        // setHomeTeam(route.params.teamData[0])
        // setAwayTeam(route.params.teamData[1])

        body.start_datetime = route.params.body.start_datetime / 1000;
        body.end_datetime = route.params.body.end_datetime / 1000;
        body.manual_fee = false;

        console.log('Body data of fee:', body);
        setloading(true);
        getFeesEstimation(route.params.teamData[1].group_id || route.params.teamData[1].user_id, body, authContext)
          .then((response) => {
            setloading(false);
            console.log('fee data :', response.payload);
            if (route && route.params && route.params.body) {
              body = route.params.body;
              body.total_payout = response.payload.total_payout;
              body.service_fee1_charges = response.payload.total_service_fee1;
              body.service_fee2_charges = response.payload.total_service_fee2;
              body.total_charges = response.payload.total_amount;
              body.total_game_charges = response.payload.total_game_fee;
              body.hourly_game_fee = 0;
              body.currency_type = 'CAD';
              body.payment_method_type = 'card';
            }
            console.log('fee BODY :', body);
            // setPaymentInfo(response.payload)
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 0.7);
          });
      }
    }
  };

  const createChallengeTeam = () => {
    if (route && route.params && route.params.teamData && route.params.body) {
      body = route.params.body;
      body.userChallenge = false;
      body.total_charges = 0.0;
      body.total_game_charges = 0.0;
      body.total_payout = 0.0;
      body.service_fee1_charges = 0.0;
      body.service_fee2_charges = 0.0;
      body.manual_fee = false;
      body.currency_type = 'CAD';
      body.payment_method_type = 'card';

      const home_id = route.params.teamData[0].group_id || route.params.teamData[0].user_id
      const away_id = route.params.teamData[1].group_id || route.params.teamData[1].user_id
      delete body.home_team;
      delete body.away_team;
      body.home_team = home_id;
      body.away_team = away_id;
      if (route.params.teamData[0].group_id) {
        body.userChallenge = false;
      } else {
        // body.home_user = home_id;
        // body.away_user = away_id;
        body.userChallenge = true;
      }

      console.log('BODY OF CREATE CHALLENGE API:', body);
      setloading(true);

      let entityID;
      let type;
      if (route.params.teamData[0].group_id) {
        type = 'teams'
        if (route.params.teamData[0].group_id === entity.uid) {
          entityID = route.params.teamData[1].group_id
        } else {
          entityID = route.params.teamData[0].group_id
        }
      } else {
        type = 'users'
        if (route.params.teamData[0].user_id === entity.uid) {
          entityID = route.params.teamData[1].user_id
        } else {
          entityID = route.params.teamData[0].user_id
        }
      }
      createChallenge(
        entityID,
        type,
        body,
        authContext,
      )
        .then((response) => {
          setloading(false);
          console.log('RESPONSE OF CREATE CHALLENGE:', response);
          navigation.navigate('ChallengeSentScreen', {
            groupObj: route.params.teamData[0].group_id === entity.uid
              ? route.params.teamData[1]
              : route.params.teamData[0],
          });
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 0.7);
        });
    }
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>
      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment'} />
        {/* paymentData={paymentInfo} homeTeam={homeTeam && homeTeam} awayTeam={awayTeam && awayTeam} */}
        <MatchFeesCard challengeObj={body} senderOrReceiver={'sender'} />
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment Method'} />
        <View>
          <TCTouchableLabel
            title={'+ Add a payment method'}
            showNextArrow={true}
          />
        </View>
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Cancellation Policy'} />
        <Text style={styles.responsibilityText}>
          When you cancel this game reservation before 3:55pm on August 11, you
          will get a 50% refund, minus the service fee.{' '}
        </Text>
        <Text style={styles.responsibilityNote}>
          By selecting the button below, I agree to the cancellation policy, and
          also agree to pay the total amount shown above.
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ marginBottom: 10 }}>
        <TCGradientButton
          title={strings.confirmAndPayTitle}
          onPress={() => {
            createChallengeTeam();
          }}
        />
      </View>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form5: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },

  viewMarginStyle: {
    marginTop: 10,
    marginBottom: 10,
  },

  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
  responsibilityNote: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 10,
  },
});
