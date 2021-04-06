/* eslint-disable no-useless-escape */

import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi
// const tagRegex = /(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/gmi
const tagRegex = /(?!\w)@\w+/gmi

const FeedDescriptionSection = ({
  descriptions,
  descriptionTxt,
  descText,
  tagData,
  setReadMore,
  readMore,
  navigation,
  isLandscape,
}) => {
  const authContext = useContext(AuthContext);
  const [character, setCharacter] = useState(30);
  const toggleNumberOfLines = useCallback(() => setReadMore(!readMore), [readMore, setReadMore]);

  useEffect(() => {
    if (isLandscape) setCharacter(65)
    else setCharacter(30)
  }, [isLandscape])
  const getIndicesOf = useCallback((searchStr, str = descriptions) => {
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
      return [];
    }
    let startIndex = 0;
    let index
    const indices = [];
    // eslint-disable-next-line no-cond-assign
    while ((index = str.toLowerCase().indexOf(searchStr.toLowerCase(), startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }, [descriptions])

  const handleNamePress = useCallback((name, startTagIndex) => {
    // console.log(`${name} - ${startTagIndex}`, getIndicesOf(name));
    const currentIndexsOfMatch = getIndicesOf(name);
    const isExistIndex = currentIndexsOfMatch?.findIndex((item) => item === startTagIndex)
    const fetchedAllEntity = tagData?.filter((item) => item?.entity_data?.tagged_formatted_name === name);
    if (fetchedAllEntity?.length > 0) {
      let fetchedEntity = fetchedAllEntity?.[0];
      if (fetchedAllEntity?.length > 1 && isExistIndex !== -1) fetchedEntity = fetchedAllEntity?.[isExistIndex];
      if (fetchedEntity?.entity_id) {
        if (fetchedEntity?.entity_id !== authContext?.entity?.uid) {
          navigation.push('HomeScreen', {
            uid: fetchedEntity?.entity_id,
            role: ['user', 'player']?.includes(fetchedEntity?.entity_type) ? 'user' : fetchedEntity?.entity_type,
            backButtonVisible: true,
          })
        }
      }
    }
  }, [authContext?.entity?.uid, getIndicesOf, navigation, tagData])

  const renderTagText = useCallback((match, matchData) => {
    // console.log(matchData);
    const startTagIndex = descriptions?.indexOf(matchData?.input?.substr(matchData?.index, descriptions?.length))
    let color = colors.whiteColor;
    const isTagName = tagData?.filter((item) => item?.entity_data?.tagged_formatted_name === match)?.length > 0;
    if (isTagName) color = colors.greeColor;
    return (
      <Text
            onPress={() => isTagName && handleNamePress(match, startTagIndex)}
            style={{ ...styles.username, color }}>
        {match}
      </Text>
    )
  }, [descriptions, handleNamePress, tagData])

  const renderURLText = useCallback((matchingString) => {
    const match = matchingString.match(urlRegex);
    const color = colors.navyBlue;
    return <Text style={{ color }}>{match?.[0]}</Text>
  }, [])

  return useMemo(() => descriptions?.length > 0 && (
    <View style={{ paddingHorizontal: 15 }}>
      <Text style={[styles.descText, descText]} numberOfLines={0}>
        <ParsedText
              style={[styles.text, descriptionTxt]}
              parse={
                [
                  { pattern: tagRegex, renderText: renderTagText },
                  { pattern: urlRegex, renderText: renderURLText },
              ]}
              childrenProps={{ allowFontScaling: false }}
          >
          {readMore ? descriptions : descriptions.substring(0, character)}
        </ParsedText>
        {descriptions?.length > character && !readMore ? '... ' : ' '}
        {descriptions?.length > character && (
          <Text onPress={toggleNumberOfLines} style={[styles.descText, descText]}>
            {readMore ? 'less' : 'more'}
          </Text>
          )}
      </Text>
    </View>
  ), [character, descText, descriptionTxt, descriptions, readMore, renderTagText, renderURLText, toggleNumberOfLines]);
}

const styles = StyleSheet.create({
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

export default FeedDescriptionSection;
