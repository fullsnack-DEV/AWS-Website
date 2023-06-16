import React, {useContext, useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Text, FlatList, Dimensions} from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';

import ParsedText from 'react-native-parsed-text';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import TagView from './TagView';
import {getGameHomeScreen} from '../../utils/gameUtils';
import {getTaggedText} from '../../utils';
import TaggedModal from '../modals/TaggedModal';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import MatchCard from '../../screens/newsfeeds/MatchCard';
import {tagRegex, urlRegex} from '../../Constants/GeneralConstants';

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
  const [showTaggedModal, setShowTaggedModal] = useState(false);
  console.log({tagData});
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
      const startTagIndex = descriptions?.indexOf(
        matchData?.input?.substr(matchData?.index, descriptions?.length),
      );
      let color = colors.black;
      let isTagName = false;

      if (tagData && tagData.length > 0) {
        isTagName =
          tagData.filter(
            (item) => item.entity_data?.tagged_formatted_name === match,
          ).length > 0;
        if (isTagName) color = colors.tagColor;
      }

      return (
        <Text
          onPress={() => isTagName && handleNamePress(match, startTagIndex)}
          style={{...styles.username, color}}>
          {match}
        </Text>
      );
    },
    [descriptions, handleNamePress, tagData],
  );

  const renderURLText = useCallback((matchingString) => {
    const match = matchingString.match(urlRegex);
    const color = colors.tagColor;
    return <Text style={{color}}>{match?.[0]}</Text>;
  }, []);

  const renderDescriptions = useMemo(
    () =>
      descriptions?.length > 0 && (
        <View>
          <ReadMore
            style={[styles.text, descText]}
            numberOfLines={numberOfLineDisplay}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeMoreOverlapCount={0}
            allowFontScaling={false}
            seeLessStyle={styles.moreText}
            seeMoreStyle={styles.moreText}
            onExpand={() => {
              console.log('called expand function');
            }}>
            <ParsedText
              style={[styles.text, descriptionTxt]}
              parse={[
                {pattern: tagRegex, renderText: renderTagText},
                {pattern: urlRegex, renderText: renderURLText},
              ]}
              childrenProps={{allowFontScaling: false}}>
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
        {tagData.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => setShowTaggedModal(true)}
              style={{marginVertical: 10}}>
              <TagView
                source={images.tagIcon}
                tagText={getTaggedText(tagData)}
              />
            </TouchableOpacity>
            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              horizontal={true}
              data={tagData.filter(
                (item) => item.entity_type === Verbs.entityTypeGame,
              )}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    width: Dimensions.get('window').width - 30,
                    flex: 1,
                    marginRight: 15,
                  }}
                  onPress={() => {
                    const routeName = getGameHomeScreen(item.matchData.sport);
                    navigation.push(routeName, {gameId: item.game_id});
                  }}>
                  <MatchCard item={item.matchData} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?.entity_id}
            />
          </>
        )}
      </View>
      <TaggedModal
        navigation={navigation}
        taggedModalRef={taggedModalRef}
        taggedData={tagData}
        showTaggedModal={showTaggedModal}
        onBackdropPress={() => setShowTaggedModal(false)}
      />
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
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  moreText: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
});

export default NewsFeedDescription;
