import React, {memo} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {strings} from '../../Localization/translation';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import {getSportName} from '../utils';
import Verbs from '../Constants/Verbs';

function TCTagsFilter({dataSource, onTagCancelPress, filter, authContext}) {
  const renderTags = ({item, index}) => (
    <>
      {Object.values(item)[0] !== strings.allType &&
        Object.values(item)[0] !== strings.worldTitleText &&
        Object.values(item)[0] !== strings.allSport &&
        Object.keys(item)[0] !== Verbs.entityID &&
        Object.keys(item)[0] !== Verbs.searchText &&
        Object.keys(item)[0] !== Verbs.sport_type &&
        Object.keys(item)[0] !== Verbs.sport_name &&
        Object.keys(item)[0] !== Verbs.location_Type &&
        Object.keys(item)[0] !== Verbs.locationOption &&
        Object.keys(item)[0] !== Verbs.sportType_tag &&
        Object.keys(item)[0] !== Verbs.isSearchPlaceholder &&
        Object.keys(item)[0] !== Verbs.minFee &&
        Object.keys(item)[0] !== Verbs.maxFee &&
        Object.keys(item)[0] !== Verbs.sortOption &&
        Object.keys(item)[0] !== Verbs.searchCityLoc &&
        Object.keys(item)[0] !== Verbs.fromDateTime &&
        Object.keys(item)[0] !== Verbs.toDateTime && (
          <View
            style={styles.textContainer}
            onPress={() => onTagCancelPress({item, index})}>
            <Text style={styles.tagTitleText}>
              {Object.keys(item)[0] === 'sport'
                ? getSportName(filter, authContext)
                : Object.values(item)}
            </Text>
            {/* <Image source={images.tagDivider} style={styles.dividerImage} /> */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => onTagCancelPress({item, index})}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
          </View>
        )}
    </>
  );

  return (
    <View>
      <FlatList
        data={dataSource}
        renderItem={renderTags}
        keyExtractor={(item, index) => index.toString()}
        style={styles.tagListStyle}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    height: 25,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
    flex: 1,
  },

  closeButton: {
    alignSelf: 'center',
    width: 8,
    height: 8,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 7,
  },
  // dividerImage: {
  //   alignSelf: 'center',
  //   width: 1,
  //   height: 25,
  //   resizeMode: 'contain',
  //   marginLeft: 5,
  //   marginRight: 5,
  // },
  tagListStyle: {
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 0,
  },
  tagTitleText: {
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: '#000000',
  },
});

export default memo(TCTagsFilter);
