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
import Verbs from '../../../../Constants/Verbs';
import ListShimmer from './ListShimmer';

const PlayersListNearYou = ({
  sportType,
  list = [],
  onChanllenge = () => {},
  searchPlayer = () => {},
  onUserClick = () => {},
  onChoose = () => {},
  loading = false,
}) => {
  const renderPlayerCard = ({item}) => (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => onUserClick(item)}>
          {item?.full_image ? (
            <Image
              source={{uri: item.full_image}}
              style={[styles.image, {borderRadius: 20}]}
            />
          ) : (
            <Image
              source={images.profilePlaceHolder}
              style={[styles.image, {borderRadius: 20}]}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 1, alignItems: 'flex-start', marginHorizontal: 10}}
          onPress={() => onUserClick(item)}>
          <Text style={styles.name} numberOfLines={1}>
            {item.full_name}
          </Text>

          <Text style={styles.address} numberOfLines={1}>
            {`${item.state ? `${item.state}, ` : ''}${item.country}`}
          </Text>
        </TouchableOpacity>
        {sportType === Verbs.sportTypeSingle ? (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onChanllenge}>
            <Text style={styles.buttonText}>{strings.challenge}</Text>
          </TouchableOpacity>
        ) : null}
        {sportType === Verbs.sportTypeDouble ? (
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {backgroundColor: colors.lightGrayBackground},
            ]}
            onPress={onChoose}>
            <Text style={[styles.buttonText, {color: colors.themeColor}]}>
              {strings.choose}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.dividor} />
    </>
  );

  if (list.length > 0) {
    return (
      <>
        <Text style={styles.listTitle}>
          {sportType === Verbs.sportTypeSingle
            ? strings.playersNearYouText
            : strings.partnersNearYouText}
        </Text>
        {loading ? (
          <ListShimmer />
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item.customer_id}
            renderItem={renderPlayerCard}
            ListFooterComponent={() =>
              list.length > 0 ? (
                <>
                  <TouchableOpacity
                    style={[styles.row, {justifyContent: 'flex-start'}]}
                    onPress={searchPlayer}>
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
                      {strings.searchForPlayer}
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
    );
  }
  return null;
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
    backgroundColor: colors.grayBackgroundColor,
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
    padding: 5,
    backgroundColor: colors.themeColor,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
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
});
export default PlayersListNearYou;
