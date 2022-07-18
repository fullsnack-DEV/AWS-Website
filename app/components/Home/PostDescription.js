import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

function PostDescription({
  descriptions,
  character,
  descriptionTxt,
  descText,
  containerStyle,
  onReadMorePress,
}) {
  const [readMore] = useState();

  return (
    <View style={containerStyle}>
      {descriptions.length > 0 && (
        <Text
          style={[styles.descriptionTxt, descriptionTxt]}
          onReadMorePress={onReadMorePress}
        >
          {readMore ? descriptions : descriptions.substring(0, character)}
          {descriptions.length > character && !readMore ? '... ' : ' '}
          {descriptions.length > character && (
            <Text onPress={onReadMorePress} style={[styles.descText, descText]}>
              {readMore ? 'less' : 'more'}
            </Text>
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  descText: {
    color: 'gray',
    fontSize: 12,
  },
  descriptionTxt: {
    fontSize: 16,
    paddingVertical: '2%',
    height: 80,
  },
});

export default PostDescription;
