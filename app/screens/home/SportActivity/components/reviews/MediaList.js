// @flow
import React from 'react';
import {View, Image, Text, TouchableOpacity, Pressable} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import images from '../../../../../Constants/ImagePath';
import styles from './ActivityCardStyles';

const MediaList = ({list = [], showMore = () => {}, onPress = () => {}}) => {
  if (list.length > 0) {
    return (
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) =>
          item.thumbnail && index < 3 ? (
            <Pressable
              style={[
                styles.activityImageContainer,
                index === 2 ? {marginRight: 0} : {},
              ]}
              onPress={onPress}>
              <Image
                source={{uri: item.thumbnail}}
                style={[styles.image, {borderRadius: 10}]}
              />
              {index === 2 && list.length > 3 ? (
                <TouchableOpacity style={styles.imageMask} onPress={showMore}>
                  <Text style={styles.count}>+ {list.length - 3}</Text>
                </TouchableOpacity>
              ) : null}
              {item.type === 'video' ? (
                <TouchableOpacity
                  style={{position: 'absolute', alignItems: 'center'}}
                  onPress={onPress}>
                  <View style={styles.videoBtn}>
                    <Image source={images.videoPlayIcon} style={styles.image} />
                  </View>
                  {/* <Text style={styles.timer}>0:32</Text> */}
                </TouchableOpacity>
              ) : null}
            </Pressable>
          ) : null
        }
      />
    );
  }
  return <View style={{height: 104}} />;
};

export default MediaList;
