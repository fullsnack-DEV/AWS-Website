/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Hyperlink from 'react-native-hyperlink'
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function NewsFeedDescription({
  descriptions,
  character,
  descriptionTxt,
  descText,
  containerStyle,
  tags = [],
}) {
  const [readMore, setReadMore] = useState();

  function toggleNumberOfLines() {
    setReadMore(!readMore);
  }
  function renderText(matchingString) {
    const pattern = /@(\w+)/;
    const match = matchingString.match(pattern);
    return <Text style={{ ...styles.username, color: colors.greeColor }}>{match[0]}</Text>;
  }
  function handleNamePress(name) {
    console.log(`Hello ${name}`);
  }

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      {descriptions?.length > 0 && (
        <Hyperlink
        // linkStyle={{ color: colors.skyBlue }}
        >
          <Text style={[styles.descText, descText]}>
            <ParsedText
              style={[styles.text, descriptionTxt]}
              parse={
                [{
                  pattern: /@(\w+)/,
                  onPress: handleNamePress,
                  renderText,

                }]
              }
              childrenProps={{ allowFontScaling: false }}
            >
              {readMore ? descriptions : descriptions.substring(0, character)}
            </ParsedText>
            {descriptions?.length > character && !readMore ? '... ' : ' '}
            {descriptions?.length > character && (
              <Text onPress={ () => toggleNumberOfLines() } style={[styles.descText, descText]}>
                {readMore ? 'less' : 'more'}
              </Text>
            )}
          </Text>
        </Hyperlink>
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
  username: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  text: {
    fontSize: 16,
    paddingVertical: '2%',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

});

export default NewsFeedDescription;
