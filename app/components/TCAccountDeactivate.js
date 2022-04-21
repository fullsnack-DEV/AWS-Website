import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts'

const TCActionButton = ({onPress,type}) => (
  <View style={styles.deactivateContainer}>
    <Text style={styles.deactivateText}>
      {type === 'terminate' ? 'Your account has been deactivated.' : 'This team account has been paused.'}
    </Text>
    <TouchableOpacity
      style={styles.reactivateButtonView}
      onPress={onPress}>
      <Text style={styles.reactivateTitle}>{type === 'terminate' ? 'REACTIVATE' : 'UNPAUSED'}</Text>
    </TouchableOpacity>
  </View>
  )

const styles = StyleSheet.create({
    reactivateTitle: {
        fontFamily: fonts.RBold,
        fontSize: 12,
        color: colors.googleColor,
      },
      reactivateButtonView: {
        backgroundColor: colors.whiteColor,
        height: 20,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
      },
      deactivateText: {
        fontFamily: fonts.RMedium,
        fontSize: 14,
        color: colors.googleColor,
      },
      deactivateContainer: {
        backgroundColor: colors.writePostSepratorColor,
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
      },
});

export default memo(TCActionButton);
