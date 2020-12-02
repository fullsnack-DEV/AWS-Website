import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import { heightPercentageToDP as hp } from '../../../../../utils';
import images from '../../../../../Constants/ImagePath';

const Scores = () => {
  const SingleColumn = ({
    headerText = '-',
    firstRowText = '-',
    secondRowText = '-',
    rowTextContainerStyle = {},
    headerTextStyle = {},
    firstRowTextStyle = {},
    secondRowTextStyle = {},
    isImageContainer = false,
    firstRowImage,
    secondRowImage,
  }) => (
    <View style={styles.singleColumnContainer}>
      <Text style={{ ...styles.headerText, ...headerTextStyle }}>{headerText}</Text>
      {!isImageContainer ? (
        <View style={{ ...styles.innerColumnContainer, ...rowTextContainerStyle }}>
          <Text style={{ ...styles.contentText, ...firstRowTextStyle }}>
            {firstRowText}
          </Text>
          <View style={styles.contentSeperator}/>
          <Text style={{ ...styles.contentText, ...secondRowTextStyle }}>
            {secondRowText}
          </Text>
        </View>
      ) : (
        <View style={{
          flex: 1, justifyContent: 'space-evenly', alignItems: 'center',
        }}>
          <FastImage
              source={firstRowImage ? { uri: firstRowImage } : images.profilePlaceHolder}
              style={{ width: 25, height: 25, borderRadius: 50 }}
          />
          <FastImage
              source={secondRowImage ? { uri: secondRowImage } : images.profilePlaceHolder}
              style={{ width: 25, height: 25, borderRadius: 50 }}
          />
        </View>
      )}

    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>
        Scores
      </Text>
      <View style={styles.contentContainer}>

        {/* Previous Games */}
        <SingleColumn
            headerText={1}
            firstRowText={2}
            secondRowText={3}
        />
        <SingleColumn
            headerText={2}
            firstRowText={2}
            secondRowText={3}
        />
        <SingleColumn
            headerText={3}
            firstRowText={2}
            secondRowText={3}
        />

        {/* Player  */}
        <SingleColumn
            headerText={'Player'}
            isImageContainer={true}
        />

        {/* Sets */}
        <SingleColumn
            headerTextStyle={{ fontFamily: fonts.RRegular, fontSize: 13, color: colors.themeColor }}
            headerText={'Sets'}
            firstRowText={1}
            secondRowText={0}
            rowTextContainerStyle={{ backgroundColor: 'rgba(255,138,1, 0.15)' }}
            firstRowTextStyle={{ color: colors.themeColor }}
        />

        {/* Games */}
        <SingleColumn
            headerTextStyle={{ fontFamily: fonts.RRegular, fontSize: 13, color: colors.yellowColor }}
            headerText={'Games'}
            firstRowText={1}
            secondRowText={0}
            rowTextContainerStyle={{ backgroundColor: 'rgba(255,138,1, 0.15)' }}
            firstRowTextStyle={{ color: colors.themeColor }}
            secondRowTextStyle={{ color: colors.lightBlackColor }}
        />

        {/* Points */}
        <SingleColumn
            headerTextStyle={{ fontSize: 13 }}
            headerText={'points'}
            firstRowText={40}
            firstRowTextStyle={{ color: colors.themeColor }}
            secondRowTextStyle={{ color: colors.lightBlackColor }}
            secondRowText={15}
        />

      </View>
    </View>)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  contentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1,
    padding: 1,
  },
  singleColumnContainer: {
    padding: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerColumnContainer: {
    marginTop: 5,
    padding: 5,
    flex: 1,
    backgroundColor: '#F9F9F9',
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  contentText: {
    paddingVertical: 5,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  contentSeperator: {
    height: 2,
    backgroundColor: colors.whiteColor,
    width: '80%',
  },

})
export default Scores;
