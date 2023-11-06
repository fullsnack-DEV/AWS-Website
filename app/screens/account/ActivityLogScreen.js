// @flow
import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';

const ActivityLogScreen = ({navigation}) => (
  <SafeAreaView style={styles.parent}>
    <ScreenHeader
      leftIcon={images.backArrow}
      leftIconPress={() =>
        navigation.navigate('App', {
          screen: 'Account',
        })
      }
      title={strings.activityLog}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
});
export default ActivityLogScreen;
