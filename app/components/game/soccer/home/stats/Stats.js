import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList, Text,
} from 'react-native';
import colors from '../../../../../Constants/Colors';
import TCSwitcher from '../../../../TCSwitcher';
import { heightPercentageToDP as hp } from '../../../../../utils';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import TCGameUserStats from '../../../../TCGameUserStats';

const SECTIONS = ['Goal', 'Assist', 'Yellow Card', 'Red Card', 'Injured', 'Rivalry', 'Previous Game'];
const Stats = ({ gameData }) => {
  const [selectedTeamTab, setSelectedTeamTab] = useState(1);
  const GoalData = [
    {
      id: 1,
      name: 'Ederson Potter',
      profilePic: images.profilePlaceHolder,
      rightIconImage: images.gameRC,
      countColor: colors.redDelColor,
      count: 1,
    },
  ]
  const renderSections = ({ item }) => {
    let SectionData = GoalData;
    if (item === 'Goal') SectionData = GoalData;
    return (
      <View style={styles.subContainer}>
        <Text style={styles.sectionTitle}>
          {item}
        </Text>
        <FlatList
                  data={SectionData}
                  renderItem={renderSingleSection}
              />
      </View>
    )
  }

  const renderSingleSection = ({ item }) => (
    <TCGameUserStats
                name={item.name}
                profilePic={item.profilePic}
                count={item.count}
                rightIconImage={item.rightIconImage}
                countTextColor={item.countColor}
            />
  )
  return (
    <View style={styles.mainContainer}>
      {/*  Team Switcher */}
      <View style={{
        ...styles.subContainer, marginBottom: 0, paddingVertical: 0,
      }}>
        <TCSwitcher
                onFirstTabPress={() => setSelectedTeamTab(1)}
                onSecondTabPress={() => setSelectedTeamTab(2)}
                selectedTab={selectedTeamTab}
                firstTabText={gameData?.home_team?.group_name}
                secondTabText={gameData?.away_team?.group_name}
            />
      </View>
      <FlatList
          scrollEnabled={false}
          style={{ flex: 1 }}
            data={SECTIONS}
          renderItem={renderSections}/>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
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
})

export default Stats;
