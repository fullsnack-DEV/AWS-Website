import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Portal} from 'react-native-portalize';
import {
  Dimensions,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import TCGameCard from '../TCGameCard';
import TaggedEntityView from '../shorts/TaggedEntityView';
import {getGameHomeScreen} from '../../utils/gameUtils';
import Verbs from '../../Constants/Verbs';

const TaggedModal = ({
  taggedModalRef,
  navigation,
  taggedData,
  showTaggedModal,
  onBackdropPress,
}) => {
  const [gameTagList, setGameTagList] = useState([]);
  const [entityTagList, setEntityTagList] = useState([]);

  useEffect(() => {
    if (taggedData?.length) {
      const gData = taggedData?.filter((e) => e?.entity_type === 'game') ?? [];
      const eData = taggedData?.filter((e) => e?.entity_type !== 'game') ?? [];
      setGameTagList([...gData]);
      setEntityTagList([...eData]);
    }
  }, [taggedData]);

  const renderSeparator = ({section}) => {
    if (section.title === strings.taggedPeopleText)
      return <View style={styles.separatorLine} />;
    if (section.title === strings.taggedMatchesText)
      return <View style={styles.separatorLineGame} />;
    return <View />;
  };

  const handleCloseModal = useCallback(() => {
    taggedModalRef.current.close();
  }, [taggedModalRef]);

  const renderMatchTaggedItems = useCallback(
    ({item}) => (
      <TCGameCard
        data={item?.entity_data}
        cardWidth={'92%'}
        onPress={() => {
          const routeName = getGameHomeScreen(item?.entity_data?.sport);
          if (routeName) navigation.push(routeName, {gameId: item?.entity_id});
        }}
      />
    ),
    [navigation],
  );

  const renderEntityTaggedItems = useCallback(
    ({item}) => {
      let teamIcon = '';
      let teamImagePH = '';
      if (item?.entity_type === Verbs.entityTypeTeam) {
        teamIcon = images.myTeams;
        teamImagePH = images.team_ph;
      } else if (item?.entity_type === Verbs.entityTypeClub) {
        teamIcon = images.myClubs;
        teamImagePH = images.club_ph;
      } else if (item?.entity_type === Verbs.entityTypePlayer) {
        teamImagePH = images.profilePlaceHolder;
      }
      return (
        <TaggedEntityView
          titleStyle={{
            color: colors.lightBlackColor,
            fontSize: 16,
            fontFamily: fonts.RMedium,
          }}
          cityStyle={{
            color: colors.lightBlackColor,
            fontSize: 14,
            fontFamily: fonts.RRegular,
          }}
          onProfilePress={() => {
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
          teamImage={
            item?.entity_data?.thumbnail
              ? {uri: item?.entity_data?.thumbnail}
              : teamImagePH
          }
          teamTitle={
            item?.entity_data?.group_name ?? item?.entity_data?.full_name
          }
          teamIcon={teamIcon}
          teamCityName={`${item?.entity_data?.city}`}
        />
      );
    },
    [handleCloseModal, navigation],
  );

  const renderSectionHeader = useCallback(
    ({section: {title}}) => {
      if (gameTagList.length > 0 && title === strings.taggedMatchesText) {
        return (
          <View style={styles.closeStyle}>
            <Text style={styles.tagTitle}>{title}</Text>
          </View>
        );
      }
      if (entityTagList.length > 0 && title === strings.taggedPeopleText) {
        return (
          <View style={styles.closeStyle}>
            <Text style={styles.tagTitle}>{title}</Text>
          </View>
        );
      }
      return null;
    },
    [entityTagList.length, gameTagList.length],
  );

  /* SECTIONS */
  const sections = useMemo(
    () => [
      {
        title: strings.taggedMatchesText,
        data: gameTagList,
        renderItem: renderMatchTaggedItems,
      },
      {
        title: strings.taggedPeopleText,
        data: entityTagList,
        renderItem: renderEntityTaggedItems,
      },
    ],
    [
      entityTagList,
      gameTagList,
      renderEntityTaggedItems,
      renderMatchTaggedItems,
    ],
  );

  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text style={styles.titleText}>{strings.taggedTitle}</Text>
      <View style={styles.headerSeparator} />
    </View>
  );

  return (
    <View>
      <Portal>
        <Modal
          onBackdropPress={onBackdropPress}
          isVisible={showTaggedModal}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          style={{
            margin: 0,
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
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              renderSectionHeader={renderSectionHeader}
              ItemSeparatorComponent={renderSeparator}
            />
          </View>
        </Modal>
      </Portal>
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
  },
  handleStyle: {
    marginTop: 15,
    alignSelf: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },
  separatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    width: '92%',
    alignSelf: 'center',
    height: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  separatorLineGame: {
    backgroundColor: 'transparent',
    width: '92%',
    alignSelf: 'center',
    height: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  closeStyle: {
    backgroundColor: colors.whiteColor,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 15,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
});

export default TaggedModal;
