import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import ParsedText from 'react-native-parsed-text';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function PostDescSection({
  descriptions,
  character,
  descriptionTxt,
  descText,
  containerStyle,
  onReadMorePress,
}) {
  function renderText(matchingString) {
    const pattern = /@(\w+)/;
    const match = matchingString.match(pattern);
    return `${match[0]}`;
  }

  function handleNamePress(name) {
    console.log(`Hello ${name}`);
  }

  return (
    <TouchableWithoutFeedback
      style={[styles.containerStyle, containerStyle]}
      onPress={onReadMorePress}>
      {descriptions.length > 0 && (
        <Text style={[styles.descText, descText]} onPress={onReadMorePress}>
          <ParsedText
            style={[styles.text, descriptionTxt]}
            parse={[
              {
                pattern: /@(\w+)/,
                style: styles.username,
                onPress: handleNamePress,
                renderText,
              },
            ]}
            childrenProps={{allowFontScaling: false}}>
            {descriptions.substring(0, character)}
          </ParsedText>
          {descriptions.length > character ? '... ' : ' '}
          {descriptions.length > character && (
            <Text onPress={onReadMorePress} style={[styles.descText, descText]}>
              {'more'}
            </Text>
          )}
        </Text>
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 15,
    
  },
  descText: {
    color: 'gray',
    fontSize: 12,
  },
  username: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
  },
  text: {
    fontSize: 16,
    paddingVertical: '2%',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default PostDescSection;
