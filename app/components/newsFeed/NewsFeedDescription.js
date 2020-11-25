import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

function NewsFeedDescription({
  descriptions,
  character,
  descriptionTxt,
  descText,
  containerStyle,
}) {
  const [readMore, setReadMore] = useState();

  function toggleNumberOfLines() {
    setReadMore(!readMore);
  }

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      {descriptions.length > 0 && (
        <Text style={[styles.descriptionTxt, descriptionTxt]}>
          {readMore ? descriptions : descriptions.substring(0, character)}
          {descriptions.length > character && !readMore ? '... ' : ' '}
          {descriptions.length > character && (
            <Text onPress={ () => toggleNumberOfLines() } style={[styles.descText, descText]}>
              {readMore ? 'less' : 'more'}
            </Text>
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 18,
  },
  descText: {
    color: 'gray',
    fontSize: 12,
  },
  descriptionTxt: {
    fontSize: 16,
    paddingVertical: '2%',
  },
});

export default NewsFeedDescription;
