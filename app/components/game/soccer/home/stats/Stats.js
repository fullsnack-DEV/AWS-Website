import React, { Fragment, useState, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, Text,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../../../../Constants/Colors';
import TCSwitcher from '../../../../TCSwitcher';
import { heightPercentageToDP as hp } from '../../../../../utils';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import TCGameUserStats from '../../../../TCGameUserStats';
import TCInnerLoader from '../../../../TCInnerLoader';
import TCGameCard from '../../../../TCGameCard';
import Rivalry from './Rivalry';
import { gamePlayStatsImage } from '../../../../../utils/gameUtils';

const SECTIONS = ['Goal', 'Assist', 'Yellow Card', 'Red Card', 'Injured', 'Rivalry', 'Previous Game'];
const SECTION_IMAGE_AND_COLOR = {
  Goal: { rightIconImage: gamePlayStatsImage.goal, countTextColor: colors.themeColor, emptyListMessage: 'No goal found' },
  Assist: { rightIconImage: gamePlayStatsImage.assist, countTextColor: colors.themeColor, emptyListMessage: 'No assist found' },
  'Yellow Card': { rightIconImage: gamePlayStatsImage.yc, countTextColor: colors.yellowColor, emptyListMessage: 'No yellow card found' },
  'Red Card': { rightIconImage: gamePlayStatsImage.rc, countTextColor: colors.redDelColor, emptyListMessage: 'No red card found' },
  Injured: { rightIconImage: '', countTextColor: colors.redDelColor, emptyListMessage: 'No injured found' },
}
const Stats = ({ gameData, getGameStatsData }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [selectedTeamTab, setSelectedTeamTab] = useState(0);
  const [gameStatsData, setGameStatsData] = useState(null);

  useEffect(() => {
    setLoading(true);
    getGameStatsData(gameData?.game_id).then((res) => {
      setGameStatsData(res?.payload);
    }).finally(() => setLoading(false));
  }, [isFocused])

  const getSectionData = (sectionName, statsData) => {
    const teamName = selectedTeamTab === 0 ? 'home_team' : 'away_team'
    let data;
    if (sectionName === 'Goal') {
      data = statsData[teamName]?.goal ?? [];
    } else if (sectionName === 'Assist') {
      data = statsData[teamName]?.assist_goal ?? [];
    } else if (sectionName === 'Yellow Card') {
      data = statsData[teamName]?.yc ?? [];
    } else if (sectionName === 'Red Card') {
      data = statsData[teamName]?.rc ?? [];
    } else if (sectionName === 'Injured') {
      data = statsData[teamName]?.injured ?? [];
    }
    data = data && data.map((obj) => ({ ...obj, type: sectionName, ...SECTION_IMAGE_AND_COLOR[sectionName] }))
    return data;
  }
  const renderSections = ({ item }) => {
    let SectionData;
    let renderSection = renderSingleSection;
    const stats = gameStatsData?.stats?.gameStats ?? null;
    SectionData = getSectionData(item, stats);
    if (item === 'Rivalry') SectionData = gameStatsData?.stats?.rivarly;
    if (item === 'Previous Game') {
      SectionData = gameStatsData?.games;
      renderSection = renderPreviousGame
    }
    return (
      <View style={styles.subContainer}>
        <Text style={styles.sectionTitle}>
          {item}
        </Text>
        {item === 'Rivalry' ? (
          <Rivalry gameData={gameData} rivalryData={SectionData}/>
        ) : (
          <FlatList
              listKey={item}
              keyExtractor={({ index }) => index?.toString()}
              ListEmptyComponent={<Text style={styles.emptySectionListItem}>{SECTION_IMAGE_AND_COLOR[item]?.emptyListMessage}</Text>}
              data={SectionData ?? []}
              renderItem={renderSection}
            />
        )}
      </View>
    )
  }

  const renderPreviousGame = ({ item }) => (
    <TCGameCard data={item} />
  )
  const renderSingleSection = ({ item }) => (
    <TCGameUserStats
            name={item?.by?.full_name}
            profilePic={item?.full_image ? { uri: item?.full_image } : images.profilePlaceHolder}
            count={item?.count}
            rightIconImage={item?.rightIconImage}
            countTextColor={item?.countColor}
        />
  )
  return (
    <View style={{ ...styles.mainContainer, backgroundColor: loading ? colors.whiteColor : colors.grayBackgroundColor }}>

      {/*  Team Switcher */}
      <Fragment>
        <View style={{
          ...styles.subContainer, marginBottom: 0, paddingVertical: 0,
        }}>
          <TCSwitcher
              tabs={[gameData?.home_team?.group_name, gameData?.away_team?.group_name]}
              onTabPress={(tabIndex) => setSelectedTeamTab(tabIndex)}
              selectedTab={selectedTeamTab}
            />
        </View>
        <TCInnerLoader visible={loading} size={50}/>
        {!loading
        && <FlatList
            listKey={'parentSection'}
            keyExtractor={({ index }) => index?.toString()}
          scrollEnabled={false}
          style={{ flex: 1 }}
            data={SECTIONS}
          renderItem={renderSections}/>}
      </Fragment>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  emptySectionListItem: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    marginLeft: 10,
    marginTop: 10,
  },
})

export default Stats;
