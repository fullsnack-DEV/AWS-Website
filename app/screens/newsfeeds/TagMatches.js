import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import MatchCard from './MatchCard';

const TagMatches = ({
  gamesData = [],
  selectedMatch = [],
  onSelectMatch = () => {},
}) => (
  <FlatList
    keyExtractor={(item) => item.game_id}
    data={gamesData}
    contentContainerStyle={{
      paddingVertical: 20,
      paddingHorizontal: 15,
      backgroundColor: colors.whiteColor,
    }}
    renderItem={({item}) => {
      const isSelected =
        selectedMatch?.findIndex((match) => match.game_id === item.game_id) !==
        -1;
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <MatchCard item={item} />
          </View>
          <TouchableOpacity
            style={styles.checkBoxContainer}
            onPress={() => onSelectMatch(item)}>
            <Image
              source={isSelected ? images.orangeCheckBox : images.uncheckWhite}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      );
    }}
    showsVerticalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  checkBoxContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default TagMatches;
