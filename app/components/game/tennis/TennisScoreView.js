import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, View,
} from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import TCThinDivider from '../../TCThinDivider';
import colors from '../../../Constants/Colors';

export default function TennisScoreView({ scoreDataSource }) {
  const renderScores = ({ item, index }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.scoreTitle}>{index + 1}</Text>
      <View style={styles.scoreView}>
        <Text style={styles.player1Score}>{item[1]}</Text>
        <TCThinDivider />
        <Text style={styles.player2Score}>{item[2]}</Text>
      </View>
    </View>
    // <View style={{ alignItems: 'center' }}>
    //   <Text style={styles.scoreTitle}>{index + 1}</Text>
    //   <LinearGradient
    //     colors={[colors.yellowColor, colors.themeColor]}
    //     style={styles.scoreView}>
    //     <Text style={[styles.player1Score, { color: colors.whiteColor }]}>
    //       {item[1]}
    //     </Text>
    //     <TCThinDivider />
    //     <Text style={[styles.player2Score, { color: colors.whiteColor }]}>
    //       {item[2]}
    //     </Text>
    //   </LinearGradient>
    // </View>
  );

  return (
    <View style={styles.scoreContainer}>
      <View style={styles.leftScoreView}>
        <FlatList
          data={scoreDataSource}
          renderItem={renderScores}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ backgroundColor: 'transparent', width: 5 }}></View>
          )}
          style={{ alignSelf: 'center' }}
        />
      </View>
      <View style={styles.centerScoreContainer}>
        <Text style={styles.centerTitle}>Player</Text>
        <View style={styles.centerScoreView}>
          <Image
            source={images.profilePlaceHolder}
            style={styles.player1Image}
          />
          <Image
            source={images.profilePlaceHolder}
            style={styles.player2Image}
          />
        </View>
      </View>
      <View style={{ width: '44%', height: 112 }}>
        <FlatList
          data={scoreDataSource}
          renderItem={renderScores}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ backgroundColor: 'transparent', width: 5 }}></View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{ alignSelf: 'center' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: 'row',
    height: 112,
    width: '100%',
    marginTop: '10%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  leftScoreView: {
    width: '44%',
    height: 112,
  },
  centerScoreContainer: {
    width: '12%',
    height: 112,
    alignItems: 'center',
  },
  centerScoreView: {
    flex: 1,
    width: 45,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  centerTitle: {
    marginBottom: 5,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  player1Image: {
    height: 27,
    width: 27,
    marginTop: 10,
  },
  player2Image: {
    height: 27,
    width: 27,
    marginBottom: 10,
  },

  scoreTitle: {
    marginBottom: 5,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  scoreView: {
    flex: 1,
    width: 45,
    backgroundColor: colors.lightBG,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  player1Score: {
    marginTop: 10,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  player2Score: {
    marginBottom: 10,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
