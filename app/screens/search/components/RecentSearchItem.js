// @flow
import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';
import SearchEventCard from './SearchEventCard';

const RecentSearchItem = ({
  data = {},
  eventOwnersList = [],
  onRemove = () => {},
  onPress = () => {},
}) => {
  const renderView = () => {
    if (typeof data === 'string') {
      return (
        <TouchableOpacity style={styles.parent} onPress={() => onPress(data)}>
          <View style={styles.imageContainer}>
            <Image source={images.home_search} style={styles.image} />
          </View>
          <View style={styles.innerContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.label} numberOfLines={1}>
                {data}
              </Text>
            </View>
            <TouchableOpacity
              style={{width: 16, height: 16}}
              onPress={() => onRemove(data)}>
              <Image
                source={images.closeRound}
                style={{width: '100%', height: '100%', resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    if (data?.cal_type === Verbs.eventVerb) {
      const owner = eventOwnersList.find(
        (item) =>
          data.owner_id === item.group_id || data.owner_id === item.user_id,
      );
      return (
        <SearchEventCard
          event={data}
          onPressEvent={() => {
            onPress(data);
          }}
          showCloseButton
          eventOwner={owner ?? {}}
        />
      );
    }

    return (
      <TouchableOpacity
        style={styles.innerContainer}
        onPress={() => {
          onPress(data);
        }}>
        <GroupIcon
          imageUrl={data.thumbnail}
          entityType={data.entity_type ?? Verbs.entityTypePlayer}
          groupName={data.group_name}
          containerStyle={{width: 40, height: 40, marginRight: 10}}
        />
        <View style={{flex: 1}}>
          <Text style={styles.label} numberOfLines={1}>
            {typeof data === 'string'
              ? data
              : data.full_name ?? data.group_name}
          </Text>
        </View>
        <TouchableOpacity
          style={{width: 16, height: 16}}
          onPress={() => onRemove(data)}>
          <Image
            source={images.closeRound}
            style={{width: '100%', height: '100%', resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderView()}
      <View style={styles.separator} />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.greyBorderColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  innerContainer: {
    flex: 1,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
    marginLeft: 50,
  },
});
export default RecentSearchItem;
