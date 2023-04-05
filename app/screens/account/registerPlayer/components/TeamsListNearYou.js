// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import {displayLocation} from '../../../../utils';
import ListShimmer from './ListShimmer';

const TeamsListNearYou = ({
  list = [],
  joinTeam = () => {},
  searchTeam = () => {},
  createTeam = () => {},
  onUserClick = () => {},
  onChanllenge = () => {},
  fromCreateTeam = false,
  loading = false,
}) => {
  const renderTeam = ({item}) =>
    item.hiringPlayers ? (
      <>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => {
              onUserClick(item);
            }}>
            {item?.thumbnail ? (
              <Image
                source={{uri: item.thumbnail}}
                style={[styles.image, {borderRadius: 20}]}
              />
            ) : (
              <Image
                source={images.teamPH}
                style={[styles.image, {borderRadius: 20}]}
              />
            )}
            <View style={styles.teamsIcon}>
              <Image source={images.teamPatch} style={styles.image} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'flex-start',
              marginHorizontal: 10,
            }}
            onPress={() => {
              onUserClick(item);
            }}>
            <Text style={styles.name} numberOfLines={1}>
              {item.group_name}
            </Text>

            <Text style={styles.address} numberOfLines={1}>
              {displayLocation(item)}
            </Text>
          </TouchableOpacity>

          {fromCreateTeam ? (
            <TouchableOpacity
              style={styles.buttonContainerChallenge}
              onPress={onChanllenge}>
              <Text style={styles.buttonTextChallenge}>
                {strings.challenge}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonContainer} onPress={joinTeam}>
              <Text style={styles.buttonText}>{strings.join}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.dividor} />
      </>
    ) : null;

  return list.length > 0 ? (
    <>
      <Text style={styles.listTitle}>{strings.teamsNearYouText}</Text>
      {loading ? (
        <ListShimmer />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.customer_id}
          renderItem={renderTeam}
          ListFooterComponent={() =>
            list.length > 0 ? (
              <>
                <TouchableOpacity
                  style={[styles.row, {justifyContent: 'flex-start'}]}
                  onPress={searchTeam}>
                  <View
                    style={[
                      styles.imageContainer,
                      {
                        padding: 8,
                        backgroundColor: 'transperant',
                        borderWidth: 1,
                        borderColor: colors.thinDividerColor,
                      },
                    ]}>
                    <Image
                      source={images.home_search}
                      style={[styles.image, {borderRadius: 20}]}
                    />
                  </View>
                  <Text style={[styles.name, {marginLeft: 10}]}>
                    Search for more teams
                  </Text>
                </TouchableOpacity>
                <View style={styles.dividor} />

                <TouchableOpacity
                  style={[styles.row, {justifyContent: 'flex-start'}]}
                  onPress={createTeam}>
                  <View
                    style={[
                      styles.imageContainer,
                      {backgroundColor: 'transperant'},
                    ]}>
                    <Image
                      source={images.createTeamRoundIcon}
                      style={[styles.image, {borderRadius: 20}]}
                    />
                  </View>
                  <Text style={[styles.name, {marginLeft: 10}]}>
                    {strings.createTeamText}
                  </Text>
                </TouchableOpacity>
                <View style={styles.dividor} />
              </>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  ) : null;
};

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    borderWidth: 1,
    borderColor: colors.thinDividerColor,
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  address: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  buttonContainer: {
    paddingVertical: 5,
    // paddingHorizontal: 25,
    width: 75,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainerChallenge: {
    paddingVertical: 5,
    // paddingHorizontal: 25,
    width: 80,
    backgroundColor: colors.orangeColor,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.themeColor,
    fontFamily: fonts.RBold,
  },
  buttonTextChallenge: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  dividor: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
  },
  teamsIcon: {
    width: 15,
    height: 15,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
export default TeamsListNearYou;
