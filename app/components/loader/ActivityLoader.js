import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';

function ActivityLoader({visible = false}) {
  if (!visible) return null;
  return (
    <Modal visible={true} transparent={true} style={{backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={colors.ActivityLoaderColor} />
      <View style={styles.containerStyle}>
        <View style={styles.indicatorViewStyle}>
          <ActivityIndicator size={'large'} color={colors.whiteColor} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    backgroundColor: colors.ActivityLoaderColor,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  indicatorViewStyle: {
    alignItems: 'center',
    // backgroundColor: '#fff',
    borderRadius: wp(3),
    height: wp(25),
    justifyContent: 'center',
    width: wp(25),
  },
});

export default ActivityLoader;
