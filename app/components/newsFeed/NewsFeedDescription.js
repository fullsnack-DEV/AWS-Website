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
  const [regX, setRegX] = useState();

  useEffect(() => {
    console.table('Tags::', tags);
    createRegXString()
  }, [tags])
  function toggleNumberOfLines() {
    setReadMore(!readMore);
  }
  const createRegXString = () => {
    const list = tags.map((e) => e.first_name || e.group_name)
    const str = list.join('|')

    const re = `/@\b(${str})(\b\s*([A-Z]\w+)){0,2}/`;

    setRegX(re)
    console.log(regX);
  }
  function renderText(matchingString) {
    const pattern = /@(\w+)/;
    const match = matchingString.match(pattern);
    return `${match[0]}`;
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
                  style: styles.username,
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
    color: colors.greeColor,
  },
  text: {
    fontSize: 16,
    paddingVertical: '2%',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

});

export default NewsFeedDescription;
