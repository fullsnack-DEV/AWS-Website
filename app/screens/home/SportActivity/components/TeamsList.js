// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, FlatList} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import TeamCard from '../../../../components/TeamCard';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';

const TeamsList = ({
  list = [],
  sport = '',
  sportType = '',
  showHorizontalList = false,
}) => {
  const [teamsList, setTeamsList] = useState([]);

  useEffect(() => {
    if (list.length > 0) {
      const newList = list.filter(
        (item) => item.sport === sport && item.sport_type === sportType,
      );
      setTeamsList(newList);
    }
  }, [sport, list, sportType]);

  if (showHorizontalList && teamsList.length === 0) {
    return null;
  }

  return teamsList.length > 0 ? (
    <>
      {showHorizontalList ? (
        <View style={{marginTop: 15}}>
          <FlatList
            data={teamsList}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            renderItem={({item}) => (
              <View style={{width: 83, alignItems: 'center', marginRight: 15}}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      item?.thumbnail
                        ? {uri: item.thumbnail}
                        : images.teamPatchIcon
                    }
                    style={styles.image}
                  />
                  <View style={styles.patchIcon}>
                    <Image source={images.teamPatchIcon} style={styles.image} />
                  </View>
                </View>
                <Text style={styles.teamName} numberOfLines={2}>
                  {item.group_name}
                </Text>
              </View>
            )}
          />
        </View>
      ) : (
        teamsList.map((item, index) => (
          <View key={index}>
            <TeamCard item={item} />
            {index !== teamsList.length - 1 ? (
              <View style={styles.lineSpearator} />
            ) : null}
          </View>
        ))
      )}
    </>
  ) : (
    <Text style={styles.label}>{strings.noneText}</Text>
  );
};

const styles = StyleSheet.create({
  lineSpearator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  imageContainer: {
    width: 45,
    height: 45,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOpacity: 0.16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 23,
  },
  teamName: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
    marginTop: 11,
  },
  patchIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    bottom: 0,
  },
});
export default TeamsList;
