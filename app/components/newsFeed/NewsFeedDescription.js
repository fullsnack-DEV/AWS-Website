/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Hyperlink from 'react-native-hyperlink'
import _ from 'lodash';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi
const tagRegex = /\B@\w+/gmi
function NewsFeedDescription({
  descriptions,
  character,
  descriptionTxt,
  descText,
  containerStyle,
  tagData = [],
  navigation,
}) {
  const authContext = useContext(AuthContext);
  const [readMore, setReadMore] = useState();
  const [taggedData, setTaggedData] = useState([]);

  useEffect(() => {
    const tagArray = []

    tagData.map((item) => {
      let joinedString = '@';
      if (item?.group_name) {
        joinedString += _.startCase(item?.group_name.toLowerCase())
      } else {
        const fName = _.startCase(item?.first_name?.toLowerCase());
        const lName = _.startCase(item?.last_name?.toLowerCase());
        joinedString += fName + lName;
      }
      tagArray.push(joinedString?.replace(/ /g, ''));
      setTaggedData([...tagArray]);
      return null;
    })
  }, [tagData]);

  const toggleNumberOfLines = () => setReadMore(!readMore);

  function renderText(matchingString) {
    const pattern = tagRegex;
    const match = matchingString.match(pattern);
    let color = colors.black;
    if (taggedData?.includes(match?.[0])) color = colors.greeColor;
    return <Text style={{ ...styles.username, color }}>{match?.[0]}</Text>
  }
  const renderURLText = (matchingString) => {
    const pattern = urlRegex;
    const match = matchingString.match(pattern);
    const color = colors.navyBlue;
    return <Text style={{ color }}>{match?.[0]}</Text>
  }
  function handleNamePress(name) {
    const entityIndex = taggedData?.findIndex((item) => item === name);
    const fetchedEntity = tagData?.[entityIndex];
    const entity_text = ['player', 'user']?.includes(fetchedEntity?.entity_type) ? 'user_id' : 'group_id'
    if (fetchedEntity?.[entity_text]) {
      if (fetchedEntity[entity_text] !== authContext?.entity?.uid) {
        navigation.push('HomeScreen', {
          uid: fetchedEntity[entity_text],
          role: ['user', 'player']?.includes(fetchedEntity.entity_type) ? 'user' : fetchedEntity.entity_type,
          backButtonVisible: true,
          menuBtnVisible: false,
        })
      }
    }
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
                [
                    { pattern: tagRegex, onPress: handleNamePress, renderText },
                    { pattern: urlRegex, renderText: renderURLText },
              ]
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
