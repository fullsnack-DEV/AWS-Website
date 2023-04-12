import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {strings} from '../../Localization/translation';

function CustomIosAlert({
  visibleAlert,
  onGoBack = () => {},
  alertTitle = '',
  onCancetTerminationPress = () => {},
}) {
  return (
    <Modal
      isVisible={visibleAlert}
      transparent
      animationInTiming={300}
      animationOutTiming={800}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={800}
      animationType="fade">
      <View style={styles.container}>
        <Text style={styles.alertTitle}>{alertTitle}</Text>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={onGoBack} style={styles.btnStyles1}>
            <Text style={[styles.textStyle, {paddingVertical: 12}]}>
              {strings.goBack}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancetTerminationPress}
            style={styles.btnStyle2}>
            <Text style={styles.textStyle}>{strings.cancelTerminateTxr}</Text>
            <Text style={[styles.textStyle, {marginTop: -4}]}>
              {strings.terminateText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: colors.whiteColor,

    alignSelf: 'center',
    borderRadius: 15,
  },
  btnStyles1: {
    alignItems: 'center',
    justifyContent: 'center',

    flex: 1,
    borderBottomLeftRadius: 15,
    borderRightColor: colors.grayColor,
    borderRightWidth: 1,
  },
  alertTitle: {
    marginTop: 25,
    fontSize: 17,
    lineHeight: 20,
    fontFamily: fonts.RBold,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginBottom: 15,
  },
  wrapper: {
    flexDirection: 'row',

    borderTopColor: colors.grayColor,
    borderTopWidth: 1,
  },
  btnStyle2: {
    alignItems: 'center',
    justifyContent: 'center',

    flex: 1,
    borderBottomRightRadius: 15,
    paddingVertical: 2,
  },
  textStyle: {
    fontFamily: fonts.RBold,
    fontSize: 17,

    color: '#0093ff',
  },
});

export default CustomIosAlert;
