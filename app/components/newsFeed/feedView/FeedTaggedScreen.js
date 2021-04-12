import React, { useCallback, useEffect, useMemo } from 'react';
import {
    Image, SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../../Constants/Colors';
import Header from '../../Home/Header';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import { widthPercentageToDP as wp } from '../../../utils';
import strings from '../../../Constants/String';
import TCGameCard from '../../TCGameCard';
import TaggedEntityView from '../../shorts/TaggedEntityView';
import { getGameHomeScreen } from '../../../utils/gameUtils';

const FeedTaggedScreen = ({ navigation, route }) => {
    const taggedItems = route?.params?.taggedData;
    const isFocused = useIsFocused();

    const gameTagList = taggedItems.filter((e) => e?.entity_type === 'game');
    const entityTagList = taggedItems.filter((e) => e?.entity_type !== 'game');

    console.log(entityTagList);
    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor(colors.whiteColor);
        }
    }, [isFocused])

  const renderHeader = useMemo(() => (
    <>
      <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack() }>
              <Image source={images.backArrow} style={styles.backImageStyle} />
            </TouchableOpacity>
          }
          centerComponent={<Text style={styles.eventTextStyle}>{'Tagged'}</Text>}
      />
      <View style={ styles.seperateLine } />
    </>
  ), [navigation])

    const renderSeparator = ({ section }) => {
        if (section.title === strings.taggedPeopleText) return <View style={styles.separatorLine} />;
        if (section.title === strings.taggedMatchesText) return <View style={styles.separatorLineGame} />;
        return <View/>;
    };

    const renderMatchTaggedItems = useCallback(({ item }) => (
      <TCGameCard
          data={item?.entity_data}
          cardWidth={'92%'}
          onPress={() => {
              const routeName = getGameHomeScreen(item?.entity_data?.sport);
              if (routeName) navigation.push(routeName, { gameId: item?.entity_id })
          }}
      />
    ), [navigation])

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
        }, [navigation]);

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

  return (
    <View style={{ flex: 1 }}>
      {renderHeader}
      <SectionList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={renderSectionHeader}
        sections={sections}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    eventTextStyle: {
        fontSize: 16,
        fontFamily: fonts.RBold,
        alignSelf: 'center',
    },
    backImageStyle: {
        height: 20,
        width: 16,
        tintColor: colors.blackColor,
        resizeMode: 'contain',
    },
    seperateLine: {
        borderColor: colors.grayColor,
        borderWidth: 0.5,
        width: wp(100),
    },
    tagTitle: {
        fontSize: 20,
        fontFamily: fonts.RRegular,
        color: colors.lightBlackColor,
        marginLeft: 15,
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
});

export default FeedTaggedScreen;
