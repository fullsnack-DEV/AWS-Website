import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function EditEventItem({
  title,
  children,
  containerStyle,
  onEditPress,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={styles.titleandEditViewStyle}>
        <Text style={styles.headerTextStyle}>{title}</Text>
        <TouchableOpacity onPress={onEditPress}>
          <Image
            source={images.editSection}
            style={styles.editImageStyle}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
  },
  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
    color: colors.lightBlackColor,
  },
  titleandEditViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editImageStyle: {
    height: 25,
    width: 25,
  },
});

export default EditEventItem;
