import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function EditEventItem({
  title,
  children,
  containerStyle,
  onEditPress,
  subTitle,
  editButtonVisible = true,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={styles.titleandEditViewStyle}>
        <Text style={styles.headerTextStyle}>{title}
          {subTitle && <Text style={styles.subHeaderText}>{subTitle}</Text>}</Text>
        {editButtonVisible && (
          <TouchableOpacity onPress={onEditPress} hitSlop={{
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
          }}>
            <Image
            source={images.editSection}
            style={styles.editImageStyle}
            resizeMode={'contain'}
          />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 15,
  },
  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
    color: colors.lightBlackColor,
  },
  subHeaderText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  titleandEditViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  editImageStyle: {
    height: 15,
    width: 15,
  },
});

export default EditEventItem;
