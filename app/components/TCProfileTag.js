import React from 'react';
import {StyleSheet, Image, Text, View, FlatList, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCProfileTag({dataSource, onTagCancelPress, style}) {
  const selectedTags = dataSource.filter((item) => item.isChecked);

  const renderTags = ({item, index}) => (
    <View style={{alignItems: 'center', marginLeft: 7}}>
      <Pressable
        onPress={() => onTagCancelPress({item, index})}
        style={{borderRadius: 90, overflow: 'hidden', height: 45, width: 45}}>
        <FastImage
          source={
            item.thumbnail ? {uri: item.thumbnail} : images.profilePlaceHolder
          }
          style={styles.profileImage}
        />
      </Pressable>
      <Pressable
        style={styles.closeButton}
        onPress={() => onTagCancelPress({item, index})}>
        <Image source={images.closeRound} style={styles.closeIcon} />
      </Pressable>
      <Text style={styles.tagTitleText} numberOfLines={2}>
        {`${item.first_name} ${item.last_name}`}
      </Text>
    </View>
  );

  return selectedTags.length > 0 ? (
    <View style={[styles.container, style]}>
      <FlatList
        data={selectedTags}
        renderItem={renderTags}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  closeButton: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    position: 'absolute',
    right: 2,
    top: 0,
    zIndex: 1,
  },
  closeIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  tagTitleText: {
    marginTop: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.lightBlackColor,
    width: 50,
    textAlign: 'center',
  },
  profileImage: {
    height: 45,
    resizeMode: 'cover',
    width: 45,
    alignSelf: 'center',
  },
  listContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
});
