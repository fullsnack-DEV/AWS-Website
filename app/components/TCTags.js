import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCTags({dataSource, titleKey, onTagCancelPress}) {
  const renderTags = ({item, index}) => (
    <>
      {item.isChecked && (
        <View
          style={styles.textContainer}
          onPress={() => onTagCancelPress({item, index})}
        >
          <Text style={styles.tagTitleText}>{item[titleKey]}</Text>
          <Image source={images.tagDivider} style={styles.dividerImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => onTagCancelPress({item, index})}
          >
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
    backgroundColor: colors.offwhite,
    borderRadius: 13,
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
    marginRight: 10,
  },
  dividerImage: {
    alignSelf: 'center',
    width: 1,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 5,
  },
  tagListStyle: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tagTitleText: {
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
});
