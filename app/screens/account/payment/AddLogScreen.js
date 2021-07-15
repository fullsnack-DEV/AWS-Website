import React, { useState, useLayoutEffect } from 'react';
import {
 View, StyleSheet, Text, TouchableOpacity,
 } from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import TCTabView from '../../../components/TCTabView';

export default function AddLogScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();
  const [paymentModeSelection, setPaymentModeSelection] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.rightHeaderView}>
          <Text>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <TCTabView
        totalTabs={2}
        firstTabTitle={'PAYMENT'}
        secondTabTitle={'REFUND'}
        indexCounter={paymentModeSelection}
        eventPrivacyContianer={{ width: 100 }}
        onFirstTabPress={() => setPaymentModeSelection(0)}
        onSecondTabPress={() => setPaymentModeSelection(1)}
        activeHeight={36}
        inactiveHeight={40}
      />

    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
});
