import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

function NewsFeedDescription({ descriptions, character }) {
  const [readMore, setReadMore] = useState();

  function toggleNumberOfLines() {
    setReadMore(!readMore);
  }

  return (
      <View>
          {descriptions.length > 0 && (
          <Text style={ styles.descriptionTxt }>
              {readMore ? descriptions : descriptions.substring(0, character)}
              {descriptions.length > character && !readMore ? '... ' : ' '}
              {descriptions.length > character && (
              <Text onPress={ () => toggleNumberOfLines() } style={ styles.descText }>
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
    padding: '2%',
  },
});

export default NewsFeedDescription;
