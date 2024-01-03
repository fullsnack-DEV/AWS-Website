// @flow
import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const ListEmptyComponent = ({title = '', subTitle = '', imageUrl = ''}) => (
  <View style={styles.parent}>
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subText}>{subTitle}</Text>
    </View>
    {imageUrl && (
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.image} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
  },
  container: {
    alignItems: 'center',
    marginBottom: 50,
    marginHorizontal: 50,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.veryLightBlack,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
    marginTop: 5,
  },
  imageContainer: {
    width: 208,
    height: 226,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default ListEmptyComponent;
