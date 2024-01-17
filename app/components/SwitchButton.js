// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const SwitchButton = ({
  options = [],
  onPress = () => {},
  selectedOption = null,
}) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <View style={styles.parent}>
      <Pressable
        style={[
          styles.container,
          options[0].value === selectedOption ? styles.activeContainer : {},
        ]}
        onPress={() => onPress(options[0])}>
        <Text
          style={[
            styles.label,
            options[0].value === selectedOption ? styles.activeLabel : {},
          ]}>
          {options[0].label}
        </Text>
      </Pressable>
      <TouchableOpacity
        style={[
          styles.container,
          options[1].value === selectedOption ? styles.activeContainer : {},
        ]}
        onPress={() => onPress(options[1])}>
        <Text
          style={[
            styles.label,
            options[1].value === selectedOption ? styles.activeLabel : {},
          ]}>
          {options[1].label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    backgroundColor: colors.textFieldBackground,
  },
  container: {
    flex: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  activeContainer: {
    backgroundColor: colors.greeColor,
  },
  activeLabel: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
});
export default SwitchButton;
