import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';

import TCMessageButton from '../../../components/TCMessageButton';

export default function CreateChallengeForm3() {
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

      <View>
        <TCLabel title={'Responsibility To Secure Referees'} />
        <Text style={styles.responsibilityText}>Which team ought to secure and pay for
          referees for this game? </Text>
        <View>
          <Text style={styles.refereeCountTitle}>Referee 1 (Chief)</Text>
          <View style={styles.viewContainer}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>None</Text>
              <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
            </View>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>Vancouver Whitecaps FC’s home</Text>
              <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
            </View>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>New York City FC’s home</Text>
              <Image source={images.radioCheckGreenBG} style={styles.radioSelectStyle}/>
            </View>
          </View>
        </View>
        <TCMessageButton title={'+ Add Referee'} width={120} alignSelf={'center'} marginTop={15} marginBottom={20}/>
        <TCThickDivider/>

        <TCLabel title={'Responsibility To Scorekeeper'} />
        <Text style={styles.responsibilityText}>Who ought to secure and pay for scorekeeper
          for this game?  </Text>
        <View>
          <Text style={styles.refereeCountTitle}>Scorekeeper 1</Text>
          <View style={styles.viewContainer}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>None</Text>
              <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
            </View>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>Vancouver Whitecaps FC’s home</Text>
              <Image source={images.radioUnselect} style={styles.radioSelectStyle}/>
            </View>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>New York City FC’s home</Text>
              <Image source={images.radioCheckGreenBG} style={styles.radioSelectStyle}/>
            </View>
          </View>
        </View>
        <TCMessageButton title={'+ Add Scorekeeper'} width={120} alignSelf={'center'} marginTop={15} marginBottom={20}/>

        <Text style={styles.responsibilityNote}>
          The match fee doesn’t include the <Text style = {styles.responsibilityNoteMedium}>Match Place Fee, Referee Fee
          </Text> and <Text style = {styles.responsibilityNoteMedium}>Scorekeeper Fee.</Text> The match place, referees and
          scorekeepers should be secured by the team who has charge of
          them at its own expense.
        </Text>
      </View>

      <TCGradientButton title={strings.nextTitle} onPress={() => console.log('NEXT')}/>
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

  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  radioSelectStyle: {
    resizeMode: 'cover',
    height: 22,
    width: 22,
    marginRight: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  refereeCountTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginTop: 15,
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
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.orangeNotesColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  responsibilityNoteMedium: {
    fontFamily: fonts.RMedium,
  },
});
