import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import TCSwitcher from '../../../../TCSwitcher';

const ReviewsList = ({gameData}) => {
  const [selectedTeamTab, setSelectedTeamTab] = useState(0);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>Reviews (1)</Text>
      <TCSwitcher
        tabs={[
          gameData?.home_team?.group_name,
          gameData?.away_team?.group_name,
        ]}
        onTabPress={(tabIndex) => setSelectedTeamTab(tabIndex)}
        selectedTab={selectedTeamTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
});
export default ReviewsList;
