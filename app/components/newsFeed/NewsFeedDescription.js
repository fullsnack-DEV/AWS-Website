/* eslint-disable no-useless-escape */
import React, {useContext, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';

import ParsedText from 'react-native-parsed-text';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import TCGameCard from '../TCGameCard';
import images from '../../Constants/ImagePath';
import TagView from './TagView';
import {getGameHomeScreen} from '../../utils/gameUtils';
import {getTaggedText} from '../../utils';
import TaggedModal from '../modals/TaggedModal';

const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim;
// const tagRegex = /(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/gmi
const tagRegex = /(?!\w)@\w+/gim;

const NewsFeedDescription = ({
  descriptions,
  descriptionTxt,
  descText,
  containerStyle,
  tagData = [],
  navigation,
  disableTouch = false,
  numberOfLineDisplay,
  isNewsFeedScreen,
  openProfilId,
}) => {
  const taggedModalRef = useRef(null);
  const authContext = useContext(AuthContext);

  const getIndicesOf = useCallback(
    (searchStr, str = descriptions) => {
      const searchStrLen = searchStr.length;
      if (searchStrLen === 0) {
        return [];
      }
      let startIndex = 0;
      let index;
      const indices = [];
      // eslint-disable-next-line no-cond-assign
      while (
        // eslint-disable-next-line no-cond-assign
        (index = str
          .toLowerCase()
          .indexOf(searchStr.toLowerCase(), startIndex)) > -1
      ) {
        indices.push(index);
        startIndex = index + searchStrLen;
      }
      return indices;
    },
    [descriptions],
  );

  const handleNamePress = useCallback(
    (name, startTagIndex) => {
      // console.log(`${name} - ${startTagIndex}`, getIndicesOf(name));
      const currentIndexsOfMatch = getIndicesOf(name);
      const isExistIndex = currentIndexsOfMatch?.findIndex(
        (item) => item === startTagIndex,
      );
      const fetchedAllEntity = tagData?.filter(
        (item) => item?.entity_data?.tagged_formatted_name === name,
      );

      if (fetchedAllEntity?.length > 0) {
        let fetchedEntity = fetchedAllEntity?.[0];
        if (fetchedAllEntity?.length > 1 && isExistIndex !== -1)
          fetchedEntity = fetchedAllEntity?.[isExistIndex];
        if (fetchedEntity?.entity_id) {
          // if (
          //   fetchedEntity?.entity_id !== authContext?.entity?.uid ||
          //   (fetchedEntity?.entity_id === authContext?.entity?.uid &&
          //     isNewsFeedScreen)
          // ) {
          //   navigation.push('HomeScreen', {
          //     uid: fetchedEntity?.entity_id,
          //     role: ['user', 'player']?.includes(fetchedEntity?.entity_type)
          //       ? 'user'
          //       : fetchedEntity?.entity_type,
          //     backButtonVisible: true,
          //   });
          // }
          if (
            fetchedEntity?.entity_id !== openProfilId ||
            (fetchedEntity?.entity_id === authContext?.entity?.uid &&
              isNewsFeedScreen)
          ) {
            navigation.push('HomeScreen', {
              uid: fetchedEntity?.entity_id,
              role: ['user', 'player']?.includes(fetchedEntity?.entity_type)
                ? 'user'
                : fetchedEntity?.entity_type,
              backButtonVisible: true,
            });
          }
        }
      }
    },
    [
      authContext?.entity?.uid,
      getIndicesOf,
      isNewsFeedScreen,
      navigation,
      openProfilId,
      tagData,
    ],
  );

  const renderTagText = useCallback(
    (match, matchData) => {
      // console.log(matchData);
      const startTagIndex = descriptions?.indexOf(
        matchData?.input?.substr(matchData?.index, descriptions?.length),
      );
      let color = colors.black;
      const isTagName =
        tagData?.filter(
          (item) => item?.entity_data?.tagged_formatted_name === match,
        )?.length > 0;
      if (isTagName) color = colors.greeColor;
      return (
        <Text
          onPress={() => isTagName && handleNamePress(match, startTagIndex)}
          style={{...styles.username, color}}
        >
          {match}
        </Text>
      );
    },
    [descriptions, handleNamePress, tagData],
  );

  const renderURLText = useCallback((matchingString) => {
    const match = matchingString.match(urlRegex);
    const color = colors.eventBlueColor;
    return <Text style={{color}}>{match?.[0]}</Text>;
  }, []);

  const renderSelectedGame = useCallback(
    ({item}) => (
      <View style={{marginLeft: 15}}>
        <TCGameCard
          data={item?.entity_data}
          onPress={() => {
            const routeName = getGameHomeScreen(item?.entity_data?.sport);
            navigation.push(routeName, {gameId: item?.entity_id});
          }}

          // cardWidth={'92%'}
        />
      </View>
    ),
    [navigation],
  );

  const renderGameTags = useMemo(
    () =>
      tagData?.length > 0 && (
        <View style={{marginVertical: 15}}>
          <TouchableOpacity onPress={() => taggedModalRef.current.open()}>
            <TagView
              tagTextStyle={{color: colors.greeColor}}
              source={images.tagGreenImage}
              tagText={getTaggedText(tagData)}
            />
          </TouchableOpacity>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            horizontal={true}
            data={tagData?.filter((item) => item?.entity_type === 'game')}
            renderItem={renderSelectedGame}
            keyExtractor={(item) => item?.entity_id}
          />
        </View>
      ),
    [renderSelectedGame, tagData],
  );

  const renderDescriptions = useMemo(
    () =>
      descriptions?.length > 0 && (
        <View style={{paddingHorizontal: 10}}>
          <ReadMore
            style={[styles.text, descText]}
            numberOfLines={numberOfLineDisplay}
            seeMoreText={'more'}
            seeLessText={'less'}
            seeMoreOverlapCount={0}
            allowFontScaling={false}
            seeLessStyle={[styles.lessText, 'less']}
            seeMoreStyle={[styles.moreText, 'more']}
            onExpand={() => {
              console.log('called expand function');
            }}
          >
            <ParsedText
              style={[styles.text, descriptionTxt]}
              parse={[
                {pattern: tagRegex, renderText: renderTagText},
                {pattern: urlRegex, renderText: renderURLText},
              ]}
              childrenProps={{allowFontScaling: false}}
            >
              {descriptions}
            </ParsedText>
          </ReadMore>
        </View>
      ),
    [
      descText,
      descriptionTxt,
      descriptions,
      renderTagText,
      renderURLText,
      numberOfLineDisplay,
    ],
  );

  return (
    <View style={containerStyle}>
      <View pointerEvents={disableTouch ? 'none' : 'auto'}>
        {renderDescriptions}
        <TaggedModal
          navigation={navigation}
          taggedModalRef={taggedModalRef}
          taggedData={tagData}
        />
      </View>
      {renderGameTags}
    </View>
  );
};

const styles = StyleSheet.create({
  username: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  text: {
    fontSize: 16,
    // paddingVertical: '2%',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  moreText: {
    color: 'gray',
    fontFamily: fonts.RRegular,
    fontSize: 12,
    top: 3,
  },
  lessText: {
    color: 'gray',
    fontSize: 12,
  },
});

export default NewsFeedDescription;
