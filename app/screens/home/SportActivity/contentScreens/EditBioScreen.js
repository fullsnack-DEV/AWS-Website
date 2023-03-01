// @flow
import React from 'react';
import {View, StyleSheet, TextInput, Pressable} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const EditBioScreen = ({bio = '', setData = () => {}}) => (
  <View style={styles.parent}>
    <Pressable style={styles.container}>
      <TextInput
        value={bio}
        onChangeText={(text) => setData(text)}
        multiline
        style={styles.label}
      />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  container: {
    // minHeight: 193,
    backgroundColor: colors.textFieldBackground,
    paddingTop: 9,
    paddingBottom: 15,
    paddingHorizontal: 13,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default EditBioScreen;
