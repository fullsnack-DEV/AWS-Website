import React, {useContext, useCallback, useRef, useState} from 'react';
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
  moreTextStyle = {},
  setReadMoreCollapsed = () => {},
  onCollapse = () => {},
  tagStyle = {},
}) => {
  const taggedModalRef = useRef(null);
  const authContext = useContext(AuthContext);
  const [showTaggedModal, setShowTaggedModal] = useState(false);

  const handleNamePress = useCallback(
    (name) => {
      const fetchedEntity = tagData.find(
        (tag) => tag.entity_data?.tagged_formatted_name.trim() === name,
      );

      if (fetchedEntity) {
        if (
          fetchedEntity.entity_id !== openProfilId ||
          (fetchedEntity.entity_id === authContext.entity.uid &&
            isNewsFeedScreen)
        ) {
          navigation.push('HomeScreen', {
            uid: fetchedEntity.entity_id,
            role: fetchedEntity.entity_type ?? Verbs.entityTypePlayer,
          });
        }
      }
    },
    [
      authContext.entity.uid,
      tagData,
      isNewsFeedScreen,
      navigation,
      openProfilId,
    ],
  );

  const renderTagText = useCallback(
    (match, matchData) => {
      const startTagIndex = descriptions?.indexOf(
        matchData?.input?.substr(matchData?.index, descriptions?.length),
      );

      const isTagName = tagData.find(
        (item) => item.entity_data?.tagged_formatted_name.trim() === match,
      );

      if (!isTagName) {
        return null;
      }
      return (
        <TouchableOpacity
          onPress={() => isTagName && handleNamePress(match, startTagIndex)}>
          <Text
            style={{...styles.username, color: colors.tagColor, ...tagStyle}}>
            {match}
          </Text>
        </TouchableOpacity>
      );
    },
    [descriptions, handleNamePress, tagData, tagStyle],
  );

  const renderURLText = useCallback(
    (matchingString) => {
      const match = matchingString.match(urlRegex);
      const color = colors.tagColor;
      return (
        <Text style={{...styles.username, color, ...tagStyle}}>
          {match?.[0]}
        </Text>
      );
    },
    [tagStyle],
  );

  return (
    <View style={containerStyle}>
      <View pointerEvents={disableTouch ? 'none' : 'auto'}>
        {descriptions?.length > 0 && (
          <View>
            <ReadMore
              style={[styles.text, descText]}
              numberOfLines={numberOfLineDisplay}
              seeMoreText={strings.moreText}
              seeLessText={strings.lessText}
              seeMoreOverlapCount={7}
              allowFontScaling={false}
              onPressIn={() => setReadMoreCollapsed(true)}
              seeLessStyle={[styles.moreText, moreTextStyle]}
              seeMoreStyle={[styles.moreText, moreTextStyle]}
              onCollapse={onCollapse}>
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
        )}
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
              keyExtractor={(item, index) => index.toString()}
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
