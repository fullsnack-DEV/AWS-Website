import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCLabel from '../../../components/TCLabel';
import TCTextField from '../../../components/TCTextField';

export default function CreateChallengeForm2({ navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {

  }, [isFocused]);

  return (
    <View>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>
      <View>

        <TCLabel title={'Rules'}/>
        <Text style={styles.responsibilityText}>Please, add the rules of the match.</Text>
        <TCTextField height={100} multiline={true} placeholder={strings.writedownRulesPlaceholder} keyboardType={'default'}/>

      </View>
      <View style={{ flex: 1 }}/>
      <View style={{ marginBottom: 20 }}>
        <TCGradientButton title={strings.nextTitle} onPress={() => navigation.navigate('CreateChallengeForm3')}/>
      </View>

    </View>
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
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form5: {
    backgroundColor: colors.lightgrayColor,
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

  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },

});
