import React, {useContext, useState} from 'react';
import {StyleSheet, View, SafeAreaView, Alert} from 'react-native';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import TCGradientButton from '../../../components/TCGradientButton';
import TCFormProgress from '../../../components/TCFormProgress';
import ScorekeeperAgreementView from '../../../components/challenge/ScorekeeperAgreementView';
import {createChallenge} from '../../../api/Challenge';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function ScorekeeperInviteAgreementScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [opetion, setOpetion] = useState(1);
  const [challengeObj] = useState(route?.params?.challengeObj);
  const [groupObj] = useState(route?.params?.groupObj);
  const [type] = useState(route?.params?.type);

  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);

  const sendChallengeInvitation = () => {
    console.log('Challenge Object:=>', challengeObj);

    setloading(true);
    createChallenge(challengeObj, authContext)
      .then((response) => {
        console.log(' challenge response1212121212:=>', response.payload);
        navigation.navigate('InviteToChallengeSentScreen', {
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

  return (
    <View style={styles.mainContainer}>
      <TCFormProgress totalSteps={3} curruentStep={3} />
      <ActivityLoader visible={loading} />

      <ScorekeeperAgreementView
        teamA={
          authContext?.entity?.obj?.group_name ??
          authContext?.entity?.obj?.full_name
        }
        teamB={groupObj?.group_name ?? groupObj?.full_name}
        type={type}
        numberOfScorekeeper={
          challengeObj?.responsible_for_scorekeeper?.who_secure?.length ?? 0
        }
        radioOpetion={(ope) => {
          setOpetion(ope);
        }}
        agreementOpetion={opetion}
        moreButtonVisible={false}
        showRules={show}
        showPressed={(value) => {
          setShow(value);
        }}
      />

      <View style={{flex: 1}} />
      <SafeAreaView>
        <TCGradientButton
          title={strings.sendInviteTitle}
          textColor={colors.grayColor}
          startGradientColor={colors.yellowColor}
          endGradientColor={colors.themeColor}
          height={40}
          shadow={true}
          marginTop={15}
          onPress={() => {
            sendChallengeInvitation();
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
