import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';

const TCWinDrawLooseChart = ({
  heading = 'Total',
  totalCount = 0,
  winCount = 0,
  drawCount = 0,
  lossCount = 0,
}) => {
  const GradiantContainer = ({ gradiantColor, style }) => (<LinearGradient
          colors={gradiantColor}
          style={{ ...styles.gradiantIndicator, ...style }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
  />)

  return (
    <View style={styles.container}>
      <Text style={styles.headingTitle}>
        {heading}
        <Text style={{ fontFamily: fonts.RBold }}>{` ${totalCount}`}</Text>
      </Text>
      {totalCount > 0 ? <View style={styles.mainContainer}>
        {/* Win Count */}
        <View style={{ ...styles.singleColumnContainer, width: `${(100 * winCount) / totalCount}%` }}>
          <GradiantContainer
              gradiantColor={[colors.blueGradiantEnd, colors.blueGradiantStart]}

            style={{
              borderTopRightRadius: lossCount === 0 && drawCount === 0 ? 15 : 0,
              borderBottomRightRadius: lossCount === 0 && drawCount === 0 ? 15 : 0,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
        />
          <Text style={{ ...styles.bottomText, textAlign: 'left' }}>
            {`${winCount} (${Math.floor((100 * winCount) / totalCount)}%)`}
          </Text>
        </View>

        {/*  Draw */}
        <View style={{ ...styles.singleColumnContainer, width: `${(100 * drawCount) / totalCount}%` }}>
          <GradiantContainer
                gradiantColor={[colors.greenGradientEnd, colors.greenGradientStart]}
                style={{
                  borderTopRightRadius: lossCount === 0 ? 15 : 0,
                  borderBottomRightRadius: lossCount === 0 ? 15 : 0,
                  borderTopLeftRadius: winCount === 0 ? 15 : 0,
                  borderBottomLeftRadius: winCount === 0 ? 15 : 0,
                }}
          />
          <Text style={{ ...styles.bottomText, textAlign: 'right' }}>
            {`${drawCount} (${Math.floor((100 * drawCount) / totalCount)}%)`}
          </Text>
        </View>

        {/*  Loss Count */}
        <View style={{ ...styles.singleColumnContainer, width: `${(100 * lossCount) / totalCount}%` }}>
          <GradiantContainer
              gradiantColor={[colors.themeColor, colors.themeColor2]}
                style={{
                  borderTopLeftRadius: winCount === 0 && drawCount === 0 ? 15 : 0,
                  borderBottomLeftRadius: winCount === 0 && drawCount === 0 ? 15 : 0,
                  borderTopRightRadius: 15,
                  borderBottomRightRadius: 15,
                }}
            />
          <Text style={{ ...styles.bottomText, textAlign: 'right' }}>
            {`${lossCount} (${Math.floor((100 * lossCount) / totalCount)}%)`}
          </Text>
        </View>
      </View> : <View style={{ ...styles.singleColumnContainer, width: '100%', marginTop: 30 }}>
        <GradiantContainer
            gradiantColor={[colors.veryLightGray, colors.veryLightGray]}
            style={{
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
        />
      </View>}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    // borderBottomWidth: 0.3,
    // borderBottomColor: colors.thinDividerColor,
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
    fontSize: 16,
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
export default TCWinDrawLooseChart;
