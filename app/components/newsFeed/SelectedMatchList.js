import {View, Text, StyleSheet, Pressable, FlatList, Image} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';

export default function SelectedMatchList({matches, onTagCancelPress}) {
  const RenderSelectedMatch = ({item}) => (
    <Pressable style={styles.parent}>
      <Pressable
        style={[
          styles.mainContaianer,
          {
            backgroundColor: colors.textFieldBackground,
          },
        ]}>
        <View style={[styles.teamContainer, {paddingLeft: 10, marginTop: 1}]}>
          <FastImage source={images.teamCover} style={styles.teamImg} />
          <Text
            numberOfLines={1}
            style={[styles.teamNameStyle, {marginLeft: 5}]}>
            {item.home_team_name}
          </Text>
        </View>

        <View style={{paddingLeft: 5, paddingRight: 10}}>
          <Text style={styles.scoreStyleContainer}>
            {item.home_team_goal ?? 0} : {item.away_team_goal ?? 0}
          </Text>
        </View>
        <View style={[styles.teamContainer, {paddingRight: 10, marginTop: 1}]}>
          <Text
            style={[styles.teamNameStyle, {marginRight: 5}]}
            numberOfLines={1}>
            {item.away_team_name}
          </Text>
          <FastImage source={images.teamCover} style={styles.teamImg} />
        </View>
      </Pressable>
      <Pressable
        style={styles.imgContainer}
        onPress={() => onTagCancelPress(item)}>
        <Image source={images.crossImage} style={styles.imgstyle} />
      </Pressable>
    </Pressable>
  );

  return (
    <View>
      <FlatList
        nestedScrollEnabled
        data={matches}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({item}) => <RenderSelectedMatch item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  imgContainer: {
    height: 25,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: colors.bgColor,
    backgroundColor: colors.textFieldBackground,
    paddingHorizontal: 7,
    alignItems: 'center',
  },
  imgstyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },
  mainContaianer: {
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'center',
  },
  teamImg: {
    height: 15,
    width: 15,
  },
  teamNameStyle: {
    width: 25,
    lineHeight: 12,
    fontSize: 11,
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
    color: '#333333',
    marginTop: 2,
  },
  scoreStyleContainer: {
    fontSize: 11,
    fontFamily: fonts.RRegular,
    lineHeight: 18,
  },
});
