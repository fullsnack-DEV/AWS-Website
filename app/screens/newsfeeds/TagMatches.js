import React, {
 memo, useCallback,
} from 'react';
import {
 FlatList, StyleSheet, Text, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCGameCard from '../../components/TCGameCard';

const RowTitleWithTextInput = memo(({ title, selectedText, onPress }) => (
  <View style={{
 flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15,
  }}>
    <Text style={{
 flex: 0.35, fontSize: 16, fontFamily: fonts.RRegular, color: colors.lightBlackColor,
    }}>{title}</Text>
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      <TouchableOpacity
          onPress={onPress}
          style={{
              elevation: 5,
              backgroundColor: colors.offwhite,
              shadowColor: colors.googleColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              borderRadius: 10,
              width: '100%',
              alignSelf: 'center',
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
          }}>
        <Text style={{ fontSize: 16, fontFamily: fonts.RRegular, color: selectedText ? colors.lightBlackColor : colors.grayColor }}>
          {selectedText ?? `Select ${title}`}
        </Text>

      </TouchableOpacity>
    </View>
  </View>
))

// const [, setFirstTeam] = useState(null)
// const [, setSecondTeam] = useState(null)
// const [, setSports] = useState(null)
// const [, setDate] = useState(null)
const TagMatches = ({ gamesData, selectedMatch, onSelectMatch }) => {
    const renderGamesData = useCallback(({ item }) => {
        const isSelected = selectedMatch?.findIndex((it) => it?.game_id === item?.game_id) !== -1;
        return (
          <View style={{ marginVertical: 10 }}>
            <TCGameCard
                    isSelected={isSelected}
                    data={item}
                    showSelectionCheckBox={true}
                    onPress={() => onSelectMatch(item)}
                />
          </View>
        )
    }, [onSelectMatch, selectedMatch])

    return (
      <View style={styles.mainContainer}>
        {/*  Row View */}
        <View>
          {/* First Team Name */}
          <RowTitleWithTextInput title={'Team 1'}/>

          {/* Second Team Name */}
          <RowTitleWithTextInput title={'Team 2'}/>

          {/* Sports */}
          <RowTitleWithTextInput title={'Sports'}/>

          {/* Date */}
          <RowTitleWithTextInput title={'Date'}/>

          <FlatList
              keyExtractor={(item) => item?.game_id}
              data={gamesData}
              renderItem={renderGamesData}
          />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
    },
})
export default TagMatches;
