import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,

} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../../../Constants/Colors'
import strings from '../../../../Constants/String';
import TCLabel from '../../../../components/TCLabel';
import fonts from '../../../../Constants/Fonts';

export default function GameFee({ navigation, route }) {
  const isFocused = useIsFocused();
  const [basicFee, setBasicFee] = useState(0.0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.saveButtonStyle} onPress={() => {
          navigation.navigate('ManageChallengeScreen', { gameFee: basicFee })
        }}>Save</Text>
      ),
    });
  }, [basicFee, navigation]);

  useEffect(() => {
    if (route && route.params && route.params.editableAlter && route.params.body) {
      console.log('EDIT FEES::', route.params.body);

      setBasicFee(route.params.body.total_game_charges)
    }
  }, [isFocused, route]);

  const IsNumeric = (num) => (num >= 0 || num < 0)
  return (
    <View style={ styles.mainContainer }>
      <TCLabel title={strings.gameFeeTitle}/>
      <View style={ styles.matchFeeView }>
        <TextInput
            placeholder={ strings.enterFeePlaceholder }
            style={ styles.feeText }
            onChangeText={ (text) => {
                if (IsNumeric(text)) {
                    setBasicFee(text)
                }
            }}
            value={ basicFee }
            keyboardType={ 'decimal-pad' }></TextInput>
        <Text style={ styles.curruency }>CAD</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  feeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '96%',
  },
  curruency: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

});
