import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

const RowTitleWithTextInput = ({ title, selectedText, onPress }) => (
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
    )
// const [, setFirstTeam] = useState(null)
// const [, setSecondTeam] = useState(null)
// const [, setSports] = useState(null)
// const [, setDate] = useState(null)
const TagMatches = () => (
  <View style={styles.mainContainer}>
    {/*  Row View */}
    <View>
      {/* First Team Name */}
      <RowTitleWithTextInput title={'Team 1'}/>
      <RowTitleWithTextInput title={'Team 2'}/>
      <RowTitleWithTextInput title={'Sports'}/>
      <RowTitleWithTextInput title={'Date'}/>
      {/* Second Team Name */}
      {/* Sports */}
      {/* Date */}
    </View>
  </View>
)

const styles = StyleSheet.create({
    mainContainer: {
    },
})
export default TagMatches;
