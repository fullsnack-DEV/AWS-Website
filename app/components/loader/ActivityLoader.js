import React from 'react';
import {
  ActivityIndicator, Modal, StyleSheet, View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';

const { colors } = constants;

function ActivityLoader({ visible = false }) {
  if (!visible) return null;
  return (
      <Modal visible={ true } transparent={ true } style={ { backgroundColor: '#fff' } }>
          <View style={ styles.containerStyle }>
              <View style={ styles.indicatorViewStyle }>
                  <ActivityIndicator size={ 'large' } color={ colors.blackColor } />
              </View>
          </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  indicatorViewStyle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(3),
    height: wp(25),
    justifyContent: 'center',
    width: wp(25),
  },
});

export default ActivityLoader;
