/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, {
  useState, useEffect, useContext, useCallback, useMemo,
} from 'react';
import {
 StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Hyperlink from 'react-native-hyperlink'
import _ from 'lodash';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi
// const tagRegex = /@\b_\.{(.*?)}\._\b/gmi;
const tagRegex = /(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/gmi
const tagPrefix = '@_.';
const tagSuffix = '._';
const NewsFeedDescription = ({
  descriptions,
  character,
  descriptionTxt,
  descText,
  containerStyle,
  tagData = [],
  navigation,
}) => {
  const authContext = useContext(AuthContext);
  const [readMore, setReadMore] = useState();
  const [taggedData, setTaggedData] = useState([]);

  useEffect(() => {
    const tagArray = []

    tagData.map((item) => {
      let joinedString = '@';
      if (item?.group_name) {
        joinedString += _.startCase(_.toLower(item?.group_name))
      } else {
        const fName = _.startCase(_.toLower(item?.first_name));
        const lName = _.startCase(_.toLower(item?.last_name));
        joinedString += fName + lName;
      }
      tagArray.push(joinedString?.replace(/ /g, ''));
      setTaggedData([...tagArray]);
      return null;
    })
  }, [tagData]);

  const toggleNumberOfLines = useCallback(() => setReadMore((val) => !val), []);

  const renderText = useCallback((matchingString) => {
    console.log(matchingString);
    const match = matchingString.match(tagRegex);
    let color = colors.black;
    const isTagName = taggedData?.includes(match?.[0])
    if (isTagName) color = colors.greeColor;
    return (
      <TouchableOpacity onPress={() => isTagName && handleNamePress(match[0])}>
        <Text style={{ ...styles.username, color }}>{match?.[0]}</Text>
      </TouchableOpacity>
    )
    // let removedPrefixSuffix = match?.[0]?.replace(tagPrefix, '')
    // removedPrefixSuffix = removedPrefixSuffix?.replace(tagSuffix, '');
    // const jsonData = JSON.parse(removedPrefixSuffix);
    // return <Text style={{ ...styles.username, color: colors.greeColor }}>@{_.startCase(matchingString) ?? ''}</Text>;
  }, [taggedData])

  const renderURLText = useCallback((matchingString) => {
    const match = matchingString.match(urlRegex);
    const color = colors.navyBlue;
    return <Text style={{ color }}>{match?.[0]}</Text>
  }, [])

  // const handleNamePress = useCallback((data) => {
  //   let removedPrefixSuffix = data?.replace(tagPrefix, '')
  //   removedPrefixSuffix = removedPrefixSuffix?.replace(tagSuffix, '');
  //   const jsonData = JSON.parse(removedPrefixSuffix);
  //   if (jsonData?.entity_id) {
  //     if (jsonData?.entity_id !== authContext?.entity?.uid) {
  //       navigation.push('HomeScreen', {
  //         uid: jsonData?.entity_id,
  //         role: jsonData?.entity_type,
  //         backButtonVisible: true,
  //         menuBtnVisible: false,
  //       })
  //     }
  //   }
  // }, [authContext?.entity?.uid, navigation])

  const getIndicesOf = (searchStr, str = descriptions) => {
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
  }

  const handleNamePress = useCallback((name) => {
    const re = new RegExp(name, 'gmi');
    const getFetchCount = getIndicesOf(name);
    const entityIndex = taggedData?.findIndex((item) => item === name);
    const fetchedEntity = tagData?.[entityIndex];
    const entity_text = ['player', 'user']?.includes(fetchedEntity?.entity_type) ? 'user_id' : 'group_id'
    if (fetchedEntity?.[entity_text]) {
      if (fetchedEntity[entity_text] !== authContext?.entity?.uid) {
        navigation.push('HomeScreen', {
          uid: fetchedEntity[entity_text],
          role: ['user', 'player']?.includes(fetchedEntity.entity_type) ? 'user' : fetchedEntity.entity_type,
          backButtonVisible: true,
        })
      }
    }
  }, [authContext?.entity?.uid, getIndicesOf, navigation, tagData, taggedData])

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      {descriptions?.length > 0 && (
        <Hyperlink>
          <Text style={[styles.descText, descText]} numberOfLines={0}>
            <ParsedText
              style={[styles.text, descriptionTxt]}
              parse={
                [
                    { pattern: tagRegex, renderText },
                    { pattern: urlRegex, renderText: renderURLText },
              ]
              }
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
