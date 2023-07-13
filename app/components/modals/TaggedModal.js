import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {
  Dimensions,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import {getGameHomeScreen} from '../../utils/gameUtils';
import Verbs from '../../Constants/Verbs';
import MatchCard from '../../screens/newsfeeds/MatchCard';
import GroupIcon from '../GroupIcon';
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';

const TaggedModal = ({
  navigation,
  taggedData,
  showTaggedModal,
  onBackdropPress,
}) => {
  const [gameTagList, setGameTagList] = useState([]);
  const [entityTagList, setEntityTagList] = useState([]);
  const [teamTagList, setTeamTagList] = useState([]);

  useEffect(() => {
    if (taggedData?.length) {
      const gData = taggedData?.filter((e) => e?.entity_type === 'game') ?? [];

      const eData =
        taggedData?.filter((e) => e?.entity_type === Verbs.entityTypePlayer) ??
        [];

      const teamData =
        taggedData?.filter(
          (e) =>
            e?.entity_type === Verbs.entityTypeTeam ||
            e?.entity_type === Verbs.entityTypeClub,
        ) ?? [];

      setGameTagList([...gData]);
      setEntityTagList([...eData]);
      setTeamTagList([...teamData]);
    }
  }, [taggedData]);

  const renderMatchTaggedItems = useCallback(
    ({item}) => (
      <View style={{marginHorizontal: 15}}>
        <Pressable
          onPress={() => {
            onBackdropPress();
            const routeName = getGameHomeScreen(item?.matchData?.sport);
            if (routeName)
              navigation.navigate(routeName, {gameId: item?.entity_id});
          }}>
          <MatchCard
            style={{marginBottom: 15}}
            item={item?.matchData}
            onPress={() => {
              const routeName = getGameHomeScreen(item?.matchData?.sport);
              if (routeName)
                navigation.push(routeName, {gameId: item?.entity_id});
            }}
          />
        </Pressable>
      </View>
    ),
    [navigation],
  );

  const renderEntityTaggedItems = useCallback(
    ({item}) => (
      <>
        <TouchableOpacity
          onPress={() => {
            onBackdropPress();
            navigation.push('HomeScreen', {
              uid: item?.entity_id,
              role: [Verbs.entityTypePlayer, Verbs.entityTypeUser]?.includes(
                item?.entity_type,
              )
                ? Verbs.entityTypeUser
                : item?.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
            });
          }}
          style={{
            flexDirection: 'row',
            marginHorizontal: 17,
            paddingVertical: 15,
          }}>
          <GroupIcon
            entityType={item.entity_type}
            containerStyle={styles.grpIconContainer}
            imageUrl={item?.entity_data?.thumbnail}
          />

          <View style={{marginLeft: 10}}>
            <Text
              style={{
                color: colors.lightBlackColor,
                fontSize: 16,
                fontFamily: fonts.RMedium,
              }}>
              {item?.entity_data?.group_name ?? item?.entity_data?.full_name}
            </Text>
            <Text
              style={{
                color: colors.lightBlackColor,
                fontSize: 14,
                fontFamily: fonts.RRegular,
              }}>{`${item?.entity_data?.city}`}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.separatorLineGame} />
      </>
    ),
    [],
  );

  const renderSectionHeader = useCallback(
    ({section: {title}}) => {
      if (gameTagList.length > 0 && title === strings.matchesTitleText) {
        return (
          <View style={[styles.closeStyle, {marginBottom: 15}]}>
            <Text style={styles.tagTitle}>{title}</Text>
          </View>
        );
      }
      if (entityTagList.length > 0 && title === strings.peopleTitleText) {
        return (
          <View style={styles.closeStyle}>
            <Text style={styles.tagTitle}>{title}</Text>
          </View>
        );
      }

      if (teamTagList.length > 0 && title === strings.group) {
        return (
          <View style={styles.closeStyle}>
            <Text style={styles.tagTitle}>{title}</Text>
          </View>
        );
      }
      return null;
    },
    [entityTagList.length, gameTagList.length, teamTagList.length],
  );

  /* SECTIONS */
  const sections = useMemo(
    () => [
      {
        title: strings.matchesTitleText,
        data: gameTagList,
        renderItem: renderMatchTaggedItems,
      },
      {
        title: strings.peopleTitleText,
        data: entityTagList,
        renderItem: renderEntityTaggedItems,
      },
      {
        title: strings.group,
        data: teamTagList,
        renderItem: renderEntityTaggedItems,
      },
    ],
    [
      entityTagList,
      gameTagList,
      renderEntityTaggedItems,
      renderMatchTaggedItems,
      teamTagList,
    ],
  );

  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <Text style={styles.titleText}>{strings.taggedTitle}</Text>
      <View style={styles.headerSeparator} />
    </View>
  );

  return (
    <View>
      <CustomModalWrapper
        closeModal={onBackdropPress}
        isVisible={showTaggedModal}
        modalType={ModalTypes.style2}
        containerStyle={{
          padding: 0,
          height:
            Dimensions.get('window').height -
            Dimensions.get('window').height / 2.5,
        }}>
        <View
          style={[
            styles.bottomPopupContainer,
            {
              height:
                Dimensions.get('window').height -
                Dimensions.get('window').height / 2.5,
            },
          ]}>
          {ModalHeader()}
          <SectionList
            sections={sections}
            stickyHeaderHiddenOnScroll={false}
            StickyHeaderComponent={false}
            scrollEnabled
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={renderSectionHeader}
          />
        </View>
      </CustomModalWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  tagTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 15,
    textTransform: 'uppercase',
  },

  separatorLineGame: {
    backgroundColor: colors.grayBackgroundColor,
    width: '92%',
    alignSelf: 'center',
    height: 1,
  },
  closeStyle: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  titleText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
  },
  headerSeparator: {
    width: '100%',
    backgroundColor: colors.grayBackgroundColor,
    height: 2,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  grpIconContainer: {
    width: 40,
    height: 40,
  },
});

export default TaggedModal;
