import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { Portal } from 'react-native-portalize';
import {
    StyleSheet, Text, View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import strings from '../../Constants/String';
import TCGameCard from '../TCGameCard';
import TaggedEntityView from '../shorts/TaggedEntityView';
import { getGameHomeScreen } from '../../utils/gameUtils';

const TaggedModal = ({ taggedModalRef, navigation, taggedData }) => {
    const [gameTagList, setGameTagList] = useState([])
    const [entityTagList, setEntityTagList] = useState([])

    useEffect(() => {
        if (taggedData) {
            const gData = taggedData?.filter((e) => e?.entity_type === 'game') ?? [];
            const eData = taggedData?.filter((e) => e?.entity_type !== 'game') ?? [];
            setGameTagList([...gData]);
            setEntityTagList([...eData]);
        }
    }, [taggedData])

    const renderSeparator = ({ section }) => {
        if (section.title === strings.taggedPeopleText) return <View style={styles.separatorLine} />;
        if (section.title === strings.taggedMatchesText) return <View style={styles.separatorLineGame} />;
        return <View/>;
    };

    const handleCloseModal = useCallback(() => taggedModalRef.current.close(), [taggedModalRef])

    const renderMatchTaggedItems = useCallback(({ item }) => (
      <TCGameCard
            data={item?.entity_data}
            cardWidth={'92%'}
            onPress={() => {
                handleCloseModal();
                const routeName = getGameHomeScreen(item?.entity_data?.sport);
                if (routeName) navigation.push(routeName, { gameId: item?.entity_id })
            }}
        />
    ), [handleCloseModal, navigation])

    const renderEntityTaggedItems = useCallback(({ item }) => {
        let teamIcon = '';
        let teamImagePH = '';
        if (item?.entity_type === 'team') {
            teamIcon = images.myTeams;
            teamImagePH = images.team_ph;
        } else if (item?.entity_type === 'club') {
            teamIcon = images.myClubs;
            teamImagePH = images.club_ph;
        } else if (item?.entity_type === 'league') {
            teamIcon = images.myLeagues;
            teamImagePH = images.leaguePlaceholder;
        } else if (item?.entity_type === 'player') {
            teamImagePH = images.profilePlaceHolder;
        }
        return (
          <TaggedEntityView
                titleStyle={{ color: colors.lightBlackColor }}
                cityStyle={{ color: colors.lightBlackColor }}
                onProfilePress={() => {
                    handleCloseModal();
                    navigation.push('HomeScreen', {
                        uid: item?.entity_id,
                        role: ['user', 'player']?.includes(item?.entity_type)
                            ? 'user'
                            : item?.entity_type,
                        backButtonVisible: true,
                        menuBtnVisible: false,
                    });
                }}
                teamImage={
                    item?.entity_data?.thumbnail
                        ? { uri: item?.entity_data?.thumbnail }
                        : teamImagePH
                }
                teamTitle={item?.entity_data?.group_name ?? item?.entity_data?.full_name}
                teamIcon={teamIcon}
                teamCityName={`${item?.entity_data?.city}`}
            />
        );
    }, [handleCloseModal, navigation]);

    const renderSectionHeader = useCallback(({ section: { title } }) => {
        if (
            gameTagList.length > 0
            && title === strings.taggedMatchesText
        ) {
            return (
              <View style={styles.closeStyle}>
                <Text style={styles.tagTitle}>{title}</Text>
              </View>
            );
        }
        if (
            entityTagList.length > 0
            && title === strings.taggedPeopleText
        ) {
            return (
              <View style={styles.closeStyle}>
                <Text style={styles.tagTitle}>{title}</Text>

              </View>
            );
        }
        return null;
    }, [entityTagList.length, gameTagList.length])

    /* SECTIONS */
    const sections = useMemo(() => [
        { title: strings.taggedMatchesText, data: gameTagList, renderItem: renderMatchTaggedItems },
        { title: strings.taggedPeopleText, data: entityTagList, renderItem: renderEntityTaggedItems },
    ], [entityTagList, gameTagList, renderEntityTaggedItems, renderMatchTaggedItems])

    const ModalHeader = () => (
      <View style={{
          backgroundColor: 'white',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
      }}>
        <View style={styles.handleStyle}/>
        <Text style={styles.titleText}>Tagged</Text>
        <View style={styles.headerSeparator}/>
      </View>
    )

    return (
      <Portal>
        <Modalize
          disableScrollIfPossible={true}
          withHandle={false}
          modalStyle={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              overflow: 'hidden',
          }}
          adjustToContentHeight={true}
          ref={taggedModalRef}
          HeaderComponent={ModalHeader}
            sectionListProps={{
                showsHorizontalScrollIndicator: false,
                showsVerticalScrollIndicator: false,
                ItemSeparatorComponent: renderSeparator,
                stickySectionHeadersEnabled: true,
                renderSectionHeader,
                sections,
            }}
        />
      </Portal>
    )
}

const styles = StyleSheet.create({
    tagTitle: {
        fontSize: 20,
        fontFamily: fonts.RRegular,
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
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
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
});

export default TaggedModal;
