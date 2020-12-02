import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import images from '../../../../../Constants/ImagePath';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../../../utils';
import MatchRecordsList from './MatchRecordsList';
import { getGameMatchRecords } from '../../../../../api/Games';

const MatchRecords = ({ gameData, gameId, navigation }) => (
  <View style={styles.mainContainer}>
    {/*      Match Records Sections */}
    <View style={styles.contentContainer}>
      <TouchableOpacity style={{ flexDirection: 'row', padding: 10 }} onPress={() => {
        navigation.navigate('SoccerRecordList', { gameId, gameData })
      }}>
        <Text style={styles.title}>
          Match records
        </Text>
        <FastImage
                resizeMode={'contain'}
                source={images.arrowGraterthan}
                style={{
                  width: 8,
                  height: 12,
                  alignSelf: 'center',
                  marginLeft: wp(1),
                }}/>
      </TouchableOpacity>
      <MatchRecordsList
          gameData={gameData}
          gameId={gameId}
          getGameMatchRecords={getGameMatchRecords}
      />
    </View>
  </View>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  contentContainer: {

  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
})
export default MatchRecords;
