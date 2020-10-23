import React, { useEffect } from 'react';
import {
  StyleSheet, View,
} from 'react-native';

import TCGradientButton from '../../components/TCGradientButton';

export default function HomeScreen({ navigation }) {
  useEffect(() => {
  });

  return (
    <View style={ styles.mainContainer }>
      <TCGradientButton
              title="Edit Profile" onPress = {() => { navigation.navigate('EditPersonalProfileScreen'); }
              }/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
