// @flow
import React, {useRef} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {strings} from '../../../Localization/translation';
import styles from './ModalStyles';

const GameRulesModal = ({
  generalRules = '',
  specialRules = '',
  onChange = () => {},
}) => {
  const inputRef = useRef();
  // const inputRef1 = useRef();
  return (
    <View>
      <Text style={styles.title}>{strings.gameRulesTitle}</Text>

      <Text style={styles.inputLabel}>{strings.gameRulesSubTitle1}</Text>
      <Pressable
        style={[styles.inputContainer, {minHeight: 100, marginBottom: 10}]}
        onPress={() => {
          inputRef.current?.focus();
        }}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={strings.generalRulesPlaceholder}
          multiline
          onChangeText={(text) => {
            onChange({
              generalRules: text,
              specialRules,
            });
          }}
          value={generalRules}
          maxLength={50}
        />
      </Pressable>

      {/* <Text style={styles.inputLabel}>{strings.gameRulesSubTitle2}</Text>
      <Pressable
        style={[styles.inputContainer, {minHeight: 100, marginBottom: 10}]}
        onPress={() => {
          inputRef1.current?.focus();
        }}>
        <TextInput
          ref={inputRef1}
          style={styles.input}
          placeholder={strings.specialRulesPlaceholder}
          multiline
          onChangeText={(text) => {
            onChange({
              generalRules,
              specialRules: text,
            });
          }}
          value={specialRules}
          maxLength={50}
        />
      </Pressable> */}
    </View>
  );
};

export default GameRulesModal;
