import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,

} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../../../Constants/Colors'
import strings from '../../../../Constants/String';
import TCLabel from '../../../../components/TCLabel';
import fonts from '../../../../Constants/Fonts';

export default function GameRules({ navigation }) {
  const [generalRules, setGeneralRules] = useState();
  const [specialRules, setSpecialRules] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.saveButtonStyle} onPress={() => Alert.alert('Save')}>Save</Text>
      ),
    });
  }, [navigation]);

  return (
    <View style={ styles.mainContainer }>
      <TCLabel title={strings.gameRulesTitle}/>
      <Text style={styles.subTitleText}>{strings.gameRulesSubTitle1}</Text>

      <TextInput
          style={styles.rulesText}
          onChangeText={(text) => setGeneralRules(text)}
          value={generalRules}
          multiline
          textAlignVertical={'top'}
          numberOfLines={4}
          placeholder={strings.generalRulesPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
        />
      <Text style={styles.subTitleText}>{strings.gameRulesSubTitle2}</Text>
      <TextInput
          style={styles.rulesText}
          onChangeText={(text) => setSpecialRules(text)}
          value={specialRules}
          multiline
          textAlignVertical={'top'}
          numberOfLines={4}
          placeholder={strings.specialRulesPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
        />

    </View>
  );
}

const styles = StyleSheet.create({
    rulesText: {
        height: 120,
        fontSize: 16,
        fontFamily: fonts.RRegular,
        width: wp('92%'),
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        color: colors.lightBlackColor,
        paddingRight: 30,
        backgroundColor: colors.offwhite,
        borderRadius: 5,
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 3,
      },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  subTitleText: {
      fontSize: 16,
      fontFamily: fonts.RRegular,
      color: colors.lightBlackColor,
      marginTop: 15,
      marginLeft: 15,
  },

});
