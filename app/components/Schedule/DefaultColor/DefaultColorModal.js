import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import { FlatList } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import Header from '../../Home/Header';

function DefaultColorModal({
  isModalVisible,
  onBackdropPress,
  cancelImageSource,
  onCancelImagePress,
  headerCenterText,
  onColorSelected,
  flatListData,
  renderItem,
  onDonePress,
  containerStyle,
}) {
  return (
    <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0, justifyContent: 'flex-end' }}
        hasBackdrop
        onBackdropPress={onBackdropPress}
        backdropOpacity={0}
    >
      <View style={[styles.containerStyle, containerStyle]}>
        <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={onCancelImagePress}>
                <Image source={cancelImageSource} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.headerCenterStyle}>{headerCenterText}</Text>
            }
            rightComponent={
              <TouchableOpacity style={{ padding: 2 }} onPress={onDonePress}>
                <Text style={{ fontSize: 14, fontFamily: fonts.RRegular, color: colors.lightBlackColor }}>Done</Text>
              </TouchableOpacity>
            }
          />
        <View style={styles.sepratorStyle} />
        <View style={{ flex: 1 }}>
          <ColorPicker
              onColorSelected={onColorSelected}
            //   defaultColor={colors.lightgrayColor}
              style={styles.colorPickerStyle}
            />
          <FlatList
              data={flatListData}
              numColumns={5}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
              renderItem={renderItem}
              keyExtractor={ (item, index) => index.toString() }
            />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: hp('70%'),
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
  },
  cancelImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.lightBlackColor,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  sepratorStyle: {
    height: 1,
    width: wp('100%'),
    backgroundColor: colors.writePostSepratorColor,
  },
  colorPickerStyle: {
    height: wp('80%'),
    width: wp('80%'),
    alignSelf: 'center',
  },
});

export default DefaultColorModal;
