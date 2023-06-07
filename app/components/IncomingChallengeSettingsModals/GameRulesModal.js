// @flow
import React, {useRef} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';

import {strings} from '../../../Localization/translation';
import styles from './ModalStyles';
import fonts from '../../Constants/Fonts';

const GameRulesModal = ({generalRules = '', onChange = () => {}}) => {
  const inputRef = useRef();

  return (
    <View>
      <Text style={[styles.title, {fontFamily: fonts.RRegular}]}>
        {strings.matchRulesInfo}
      </Text>

      <Pressable
        style={[styles.inputContainer, {minHeight: 100, marginBottom: 10}]}
        onPress={() => {
          inputRef.current?.focus();
        }}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={strings.matchrules}
          multiline
          onChangeText={(text) => {
            onChange(text);
          }}
          value={generalRules}
        />
      </Pressable>
    </View>
  );
};

export default GameRulesModal;
