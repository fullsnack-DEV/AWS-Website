import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCTextGradiant from './TCTextGradiant';

const TCWinningRangeChart = ({
  heading = 'Total',
  totalCount = 0,
  teamOneCount = 0,
  drawCount = 0,
  teamTwoCount = 0,
}) => {
  const [teamOnePercent] = useState(Math.floor((teamOneCount * 100) / totalCount));
  const [drawPercent] = useState(Math.floor((drawCount * 100) / totalCount));
  const [teamTwoPercent] = useState(Math.floor((teamTwoCount * 100) / totalCount));

  const GradiantContainer = ({ gradiantColor, style }) => (<LinearGradient
          colors={gradiantColor}
          style={{ ...styles.gradiantIndicator, ...style }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
  />)
  return (
    <View style={styles.container}>
      <Text style={styles.headingTitle}>
        {heading} games
        <Text style={{ fontFamily: fonts.RBold }}>{` ${totalCount}`}</Text>
      </Text>
      <View style={styles.mainContainer}>
        {/* Team One */}
        <View style={{ ...styles.singleColumnContainer, width: `${teamOnePercent}%` }}>
          <GradiantContainer
            gradiantColor={[colors.themeColor, colors.yellowColor]}
            style={{
              borderTopRightRadius: teamTwoCount === 0 && drawCount === 0 ? 15 : 0,
              borderBottomRightRadius: teamTwoCount === 0 && drawCount === 0 ? 15 : 0,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
        />
          <TCTextGradiant
            textStyle={{ ...styles.bottomText, textAlign: 'left' }}
            text={`${teamOneCount} (${teamOnePercent}%)`}
            colors={[colors.themeColor, colors.yellowColor]}
            />
        </View>
        {/*  Draw */}
        <View style={{ ...styles.singleColumnContainer, width: `${drawPercent}%` }}>
          <GradiantContainer
                gradiantColor={[colors.greenGradientEnd, colors.greenGradientStart]}
                style={{
                  borderTopRightRadius: teamTwoCount === 0 ? 15 : 0,
                  borderBottomRightRadius: teamTwoCount === 0 ? 15 : 0,
                  borderTopLeftRadius: teamOneCount === 0 ? 15 : 0,
                  borderBottomLeftRadius: teamOneCount === 0 ? 15 : 0,
                }}
          />
          <Text style={{ ...styles.bottomText, textAlign: 'right' }}>
            {`${drawCount} (${drawPercent}%)`}
          </Text>
        </View>
        {/*  Team Two */}
        <View style={{ ...styles.singleColumnContainer, width: `${teamTwoPercent}%` }}>
          <GradiantContainer
                gradiantColor={[colors.blueGradiantEnd, colors.blueGradiantStart]}
                style={{
                  borderTopLeftRadius: teamOneCount === 0 && drawCount === 0 ? 15 : 0,
                  borderBottomLeftRadius: teamOneCount === 0 && drawCount === 0 ? 15 : 0,
                  borderTopRightRadius: 15,
                  borderBottomRightRadius: 15,
                }}
            />
          <Text style={{ ...styles.bottomText, textAlign: 'right' }}>
            {`${teamTwoCount} (${teamTwoPercent}%)`}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.darkGrayTrashColor,
    alignItems: 'center',
  },
  mainContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
  },
  headingTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  singleColumnContainer: {
  },
  gradiantIndicator: {
    height: 10,
    marginHorizontal: 1.5,
  },
  bottomText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
})
export default TCWinningRangeChart;
