import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function ActivityLoader({visible = false}) {
  if (!visible) return null;
  return (
    <Modal visible={true} transparent={true} style={{backgroundColor: '#fff'}}>
      <View style={styles.containerStyle}>
        <View style={styles.indicatorViewStyle}>
          <ActivityIndicator size={'large'} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  indicatorViewStyle: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(3),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActivityLoader;
