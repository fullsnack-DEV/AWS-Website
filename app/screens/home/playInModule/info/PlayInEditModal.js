import {
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../../../../Constants/Colors';
import images from '../../../../Constants/ImagePath';
import Header from '../../../../components/Home/Header';
import fonts from '../../../../Constants/Fonts';
import TCThinDivider from '../../../../components/TCThinDivider';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import TCKeyboardView from '../../../../components/TCKeyboardView';

const PlayInEditModal = ({
  visible = false,
  onClose = () => {},
  heading = '',
  onSavePress = () => {},
  children,
  loading,
}) => (
  <Modal
            isVisible={visible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: colors.blackOpacityColor,
            }}
            hasBackdrop
            onRequestClose={onClose}
            onBackdropPress={onClose}
            backdropOpacity={0}
        >
    <TCKeyboardView>
      <View style={styles.modalContainerViewStyle}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            safeAreaStyle={{ marginTop: 10 }}
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={onClose}>
                <FastImage
                    tintColor={colors.lightBlackColor}
                    source={images.backArrow}
                    resizeMode={'contain'}
                    style={{ height: 20, width: 16 }} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <FastImage source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                <Text style={styles.playInTextStyle}>{heading}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity
                  onPress={() => {
                    onSavePress();
                  }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.lightBlackColor }}>{'Save'}</Text>
              </TouchableOpacity>
            }
        />
          <TCThinDivider backgroundColor={colors.refereeHomeDividerColor} width={'100%'} height={2}/>
          {loading && (
            <View style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              zIndex: 1,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
              <TCInnerLoader visible={true} size={50}/>
            </View>
          )}
          <ScrollView>
            {children}
          </ScrollView>

        </SafeAreaView>
      </View>
    </TCKeyboardView>
  </Modal>
)

const styles = StyleSheet.create({
  modalContainerViewStyle: {
    top: hp(5),
    height: hp(100),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  soccerImageStyle: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  headerCenterViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
});

export default PlayInEditModal;
