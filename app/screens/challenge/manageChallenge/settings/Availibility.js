import React, { useState, useLayoutEffect } from 'react';
import {

  StyleSheet,
  View,
  Text,

  SafeAreaView,
} from 'react-native';

import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import ToggleView from '../../../../components/Schedule/ToggleView';

export default function Availibility({ navigation }) {
  const [acceptChallenge, setAcceptChallenge] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
              navigation.navigate('ManageChallengeScreen', { availibility: acceptChallenge })
          }}>
          Save
        </Text>
      ),
    });
  }, [acceptChallenge, navigation]);

  return (
    <SafeAreaView>
      <View>
        <TCLabel title={strings.availibilityTitle} style={{ marginRight: 15 }} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 15,
            marginTop: 35,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            {strings.AvailibilitySubTitle}
          </Text>
          <ToggleView
            isOn={acceptChallenge}
            size={20}
            onToggle={() => setAcceptChallenge(!acceptChallenge)}
            onColor={colors.themeColor}
            offColor={colors.grayBackgroundColor}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

});
