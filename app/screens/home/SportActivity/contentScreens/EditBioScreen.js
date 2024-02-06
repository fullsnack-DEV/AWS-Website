// @flow
import React, {useRef} from 'react';
import {View, StyleSheet, TextInput, Pressable} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const EditBioScreen = ({about = '', setData = () => {}}) => {
  const inputRef = useRef();
  return (
    <View style={styles.parent}>
      <Pressable
        style={styles.container}
        onPress={() => {
          inputRef.current.focus();
        }}>
        <TextInput
          defaultValue={about}
          onChangeText={(text) => setData(text)}
          style={styles.input}
          numberOfLines={4}
          blurOnSubmit={false}
          multiline
          ref={inputRef}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  container: {
    minHeight: 193,
    backgroundColor: colors.textFieldBackground,
    paddingTop: 9,
    paddingBottom: 15,
    paddingHorizontal: 13,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    height: 'auto',
  },
});
export default React.memo(EditBioScreen);
