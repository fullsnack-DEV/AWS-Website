import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

// import { getFeesEstimation } from '../../../api/Challenge'
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCLabel from '../../../components/TCLabel';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';

export default function CreateChallengeForm5({ navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {

  }, [isFocused]);

  return (

    <TCKeyboardView>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>
      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment'}/>
        <MatchFeesCard/>
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Payment Method'}/>
        <View >
          <TCTouchableLabel title={'+ Add a payment method'} showNextArrow={true}/>
        </View>
      </View>

      <View style={styles.viewMarginStyle}>
        <TCLabel title={'Cancellation Policy'} />
        <Text style={styles.responsibilityText}>When you cancel this game reservation before 3:55pm on August 11, you will get a 50% refund, minus the service fee. </Text>
        <Text style={styles.responsibilityNote}>
          By selecting the button below, I agree to the cancellation policy, and also agree to pay the total amount shown above.
        </Text>
      </View>
      <View style={{ flex: 1 }}/>
      <View style={{ marginBottom: 10 }}>
        <TCGradientButton title={strings.confirmAndPayTitle} onPress={() => navigation.navigate('CreateChallengeForm2')}/>
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
