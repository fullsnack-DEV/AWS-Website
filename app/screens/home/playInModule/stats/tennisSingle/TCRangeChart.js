import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';

const TCRangeChart = ({
  heading = 'Total',
  totalCount = 0,
  progressCount = 0,
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
      </Text>
      {totalCount > 0 ? <View style={styles.mainContainer}>
        {/* Win Count */}
        <View style={{ ...styles.singleColumnContainer, width: `${(100 * progressCount) / totalCount}%` }}>
          <GradiantContainer
              gradiantColor={[colors.userPostTimeColor, colors.lightBlackColor]}

            style={{
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
        />
          <Text style={{ ...styles.bottomText, flex: 1, textAlign: 'left' }}>
            {`${Math.floor((100 * progressCount) / totalCount)}%`}
          </Text>
        </View>
        <View style={{
          marginLeft: progressCount > 0 ? -5 : 0,
          zIndex: -1,
          ...styles.singleColumnContainer,
        width: `${100 - (100 * progressCount) / totalCount}%`,
        }}>
          <GradiantContainer
              gradiantColor={[colors.veryLightGray, colors.veryLightGray]}

              style={{
                borderTopRightRadius: 15,
                borderBottomRightRadius: 15,
                borderTopLeftRadius: progressCount > 0 ? 0 : 15,
                borderBottomLeftRadius: progressCount > 0 ? 0 : 15,
              }}
          />
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
    borderBottomWidth: 0.3,
    borderBottomColor: colors.thinDividerColor,
    alignItems: 'center',
  },
  mainContainer: {
    alignItems: 'flex-start',
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
  },
  bottomText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
})
export default TCRangeChart;
