import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../loader/ActivityLoader';
import {strings} from '../../../Localization/translation';

export default function SendRequestModal({
  onNextPress = () => {},
  onClosePress = () => {},
  btntext = '',
  visibleRequestModal,
  groupData,
  loading,
  textstring1,
  textstring2,
  textstring3,
  headerTitle = strings.sendrequestToCreateTeam,
}) {
  const placeHolder = images.teamPlaceholderSmall;
  return (
    <View>
      <Modal
        isVisible={visibleRequestModal}
        onBackdropPress={onClosePress}
        onRequestClose={onClosePress}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <ActivityLoader visible={loading} />
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.07,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: colors.blackColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              // paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={Utility.getHitSlop(15)}
              style={[styles.closeButton, {marginTop: 20, marginBottom: 10}]}
            />
            <Text
              style={{
                alignSelf: 'center',
                //  marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                textAlign: 'center',
                marginTop: 20,
                marginLeft: 20,
                marginBottom: 14,
              }}>
              {headerTitle}
            </Text>
            <TouchableOpacity
              hitSlop={Utility.getHitSlop(15)}
              style={[
                styles.closeButton,
                {marginTop: 20, marginBottom: 10, marginRight: 28},
              ]}
              onPress={onClosePress}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <Pressable>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 80,
                  borderRadius: 100,
                  alignSelf: 'center',
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: colors.greyBorderColor,
                }}>
                <View>
                  <Image
                    source={images.teamPatch}
                    style={{
                      height: 15,
                      width: 15,
                      resizeMode: 'cover',
                      position: 'absolute',
                      left: 10,
                      top: 45,
                    }}
                  />
                </View>
                <Image
                  source={placeHolder}
                  style={{
                    height: 50,
                    width: 50,

                    borderRadius: 25,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                  }}>
                  <Text
                    style={{
                      marginTop: -5,
                      textAlign: 'center',
                      color: colors.whiteColor,
                      fontFamily: fonts.RBold,
                      fontSize: 16,
                    }}>
                    {groupData?.group_name.charAt(0)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: 15,
                  marginBottom: 60,
                }}>
                <Text
                  style={{
                    lineHeight: 37,
                    fontFamily: fonts.RBold,
                    fontSize: 25,
                    textAlign: 'center',
                  }}>
                  {groupData?.group_name}
                </Text>
              </View>
            </Pressable>
          </View>
          <View>
            <View
              style={{
                marginLeft: 31,
                marginRight: 12,
              }}>
              <View style={styles.rowstyles}>
                <View style={styles.dotstyle} />
                <Text
                  style={{
                    lineHeight: 24,
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                  }}>
                  {textstring1}
                </Text>
              </View>
              <View style={styles.rowstyles}>
                <View style={[styles.dotstyle, {marginTop: 37}]} />

                <Text
                  style={{
                    lineHeight: 24,
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                    marginTop: 25,
                  }}>
                  {textstring2}
                </Text>
              </View>
              <View style={styles.rowstyles}>
                <View style={[styles.dotstyle, {marginTop: 37}]} />
                <Text
                  style={{
                    lineHeight: 24,
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                    marginTop: 25,
                  }}>
                  {textstring3}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              marginTop: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={onNextPress}
              style={{
                width: 345,
                marginBottom: 15,
                backgroundColor: colors.reservationAmountColor,
                borderRadius: 25,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.whiteColor,
                  fontFamily: fonts.RBold,
                }}>
                {btntext}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 20,
    resizeMode: 'contain',
  },
  rowstyles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotstyle: {
    width: 5,
    height: 5,
    backgroundColor: colors.blackColor,
    borderRadius: 50,
    marginRight: 5,
    alignSelf: 'flex-start',
    marginTop: 11,
  },
});
