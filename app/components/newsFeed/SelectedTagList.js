import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function SelectedTagList({dataSource, onTagCancelPress}) {
  const renderTags = ({item, index}) => (
    <>
      <View
        style={[styles.textContainer, index !== 0 ? {marginLeft: 15} : {}]}
        onPress={() => onTagCancelPress({item, index})}>
        <View>
          <Text style={styles.tagTitleText}>
            {item.entity_data?.full_name ?? item.entity_data?.group_name}
          </Text>
        </View>
        <View style={styles.dividerImage} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onTagCancelPress({item, index})}>
          <Image source={images.cancelImage} style={styles.image} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View>
      <FlatList
        data={dataSource}
        nestedScrollEnabled
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
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: colors.textFieldBackground,
  },
  closeButton: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dividerImage: {
    width: 1,
    height: 25,
    backgroundColor: colors.bgColor,
    marginLeft: 10,
    marginRight: 5,
  },
  tagListStyle: {
    marginLeft: 15,
    marginBottom: 15,
  },
  tagTitleText: {
    fontSize: 12,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
