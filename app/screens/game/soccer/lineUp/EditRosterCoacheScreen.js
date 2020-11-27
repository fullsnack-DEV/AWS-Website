import React, { useLayoutEffect } from 'react';
import {
  View, StyleSheet, Text, ScrollView,
} from 'react-native';

import fonts from '../../../../Constants/Fonts'
import TCSearchBox from '../../../../components/TCSearchBox';

import TCLabel from '../../../../components/TCLabel';

import LineUpPlayerView from '../../../../components/game/soccer/home/lineUp/LineUpPlayerView';

export default function EditRosterCoacheScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => console.log('OK')}>Save</Text>
      ),
    });
  }, [])
  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <TCSearchBox style={{ alignSelf: 'center', marginTop: 15 }}/>
        <View>
          <TCLabel title={'Coaches'}/>
          <LineUpPlayerView buttonType={'movedown'}/>

        </View>
        <View>

          {/* <Text style={{
          fontFamily: fonts.RRegular, fontSize: 14, color: colors.grayColor, marginLeft: 35, marginTop: 10,
          }}>No Player</Text> */}

          <TCLabel title={'Members'}/>
          <LineUpPlayerView buttonType={'moveup'}/>
          <LineUpPlayerView buttonType={'moveup'}/>
          <LineUpPlayerView buttonType={'moveup'}/>
          <LineUpPlayerView buttonType={'moveup'}/>
        </View>
      </View>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
})
