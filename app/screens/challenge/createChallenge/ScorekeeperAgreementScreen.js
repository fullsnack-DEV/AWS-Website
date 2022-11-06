import React, {useContext, useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import TCGradientButton from '../../../components/TCGradientButton';
import TCFormProgress from '../../../components/TCFormProgress';
import ScorekeeperAgreementView from '../../../components/challenge/ScorekeeperAgreementView';

export default function ScorekeeperAgreementScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [opetion, setOpetion] = useState(1);
  const [challengeObj] = useState(route?.params?.challengeObj);
  const [groupObj] = useState(route?.params?.groupObj);
  const [type] = useState(route?.params?.type);

  console.log('challengeObj scorekeeper agree screen : ', challengeObj);

  return (
    <View style={styles.mainContainer}>
      <TCFormProgress totalSteps={4} curruentStep={3} />

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
        comeFrom={route?.params?.comeFrom}
      />

      <View style={{flex: 1}} />
      <SafeAreaView>
        <TCGradientButton
          title={strings.nextTitle}
          textColor={colors.grayColor}
          startGradientColor={colors.yellowColor}
          endGradientColor={colors.themeColor}
          height={40}
          shadow={true}
          marginTop={15}
          onPress={() => {
            navigation.push('ChallengePaymentScreen', {
              challengeObj: {
                ...challengeObj,
                min_scorekeeper:
                  opetion === 1
                    ? challengeObj?.responsible_for_scorekeeper?.who_secure
                        ?.length ?? 0
                    : 0,
              },
              groupObj,
              type,
            });
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
