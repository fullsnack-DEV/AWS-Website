import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import { DatePicker } from 'react-native-common-date-picker';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

export default function TCDateTimePicker({
  title = 'Choose Date',
  onDone,
  onCancel,
  visible = false,
}) {
  return (
    <SafeAreaView>
      <Modal
        isVisible={visible}
        backdropColor="black"
        backdropOpacity={0.5}
        style={{
          marginLeft: 0, marginRight: 0, marginBottom: 0,
        }}>
        <View style={styles.modelHeaderContainer}>
          <DatePicker
          cancel={() => onCancel()}
          confirm={(date) => {
            // setDateValue(date)
            onDone({ date })
          }}
          confirmText={'Done'}
          titleText = {title}
          monthDisplayMode={'en-long'}
          minDate={'1900-1-1'}
          rowHeight={45}
          toolBarConfirmStyle={styles.doneStyle}
          toolBarCancelStyle={styles.cancelStyle}
          titleStyle={styles.titleStyle}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modelHeaderContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 3.8,
    backgroundColor: colors.whiteColor,
    position: 'absolute',
    bottom: 0,
    left: 0,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  doneStyle: {
    marginRight: 10,
    fontSize: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelStyle: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  titleStyle: {
    alignSelf: 'center', fontSize: 20, fontFamily: fonts.RMedium, color: colors.lightBlackColor,
  },
});
