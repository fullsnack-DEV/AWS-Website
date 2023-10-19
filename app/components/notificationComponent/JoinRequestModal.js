import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';
import React, {useMemo} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {format} from 'react-string-format';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import TCThinDivider from '../TCThinDivider';
import GroupIcon from '../GroupIcon';
import {capitalize} from '../../utils';

const renderBackdrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={{
      backgroundColor: colors.modalBackgroundColor,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '99%',
    }}
    opacity={6}
  />
);

export default function JoinRequestModal({
  JoinRequestModalRef,
  currentUserData,
  onAcceptPress = () => {},
  onDeclinePress = () => {},
  messageText = '',
}) {
  const snapPoints = useMemo(() => ['95%', '95%'], []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={JoinRequestModalRef}
        backgroundStyle={{
          borderRadius: 10,
        }}
        index={1}
        handleIndicatorStyle={{
          backgroundColor: colors.modalHandleColor,
          width: 40,
          height: 5,
          marginTop: 5,
          alignSelf: 'center',
          borderRadius: 5,
        }}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDismissOnClose
        backdropComponent={renderBackdrop}>
        <BottomSheetScrollView style={{flex: 1}}>
          <View>
            <Text
              style={{
                alignItems: 'center',
                textAlign: 'center',
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
                marginTop: 5,
                marginBottom: 5,
              }}>
              {strings.joinRequestTitle}
            </Text>
            <TCThinDivider height={1} width={'100%'} marginTop={5} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RMedium,
                lineHeight: 30,
                marginHorizontal: 15,

                marginTop: 20,
              }}>
              {format(strings.wouldyouAcceptText, currentUserData.full_name)}
            </Text>
            {/* profile */}

            <View
              style={{
                marginTop: 20,
                marginHorizontal: 15,
                flexDirection: 'row',
              }}>
              <GroupIcon
                entityType={Verbs.entityTypeUser}
                containerStyle={{
                  width: 40,
                  height: 40,
                }}
                imageUrl={currentUserData?.thumbnail}
              />
              <View
                style={{
                  marginLeft: 15,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    lineHeight: 24,
                  }}>
                  {currentUserData.full_name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.RRegular,
                    lineHeight: 24,
                  }}>
                  {currentUserData.city}
                </Text>
              </View>
            </View>
            <TCThinDivider height={7} marginTop={25} width={'100%'} />
          </View>

          {/* Team Ifo */}
          <Text
            style={{
              fontSize: 20,
              lineHeight: 30,
              fontFamily: fonts.RBold,
              marginTop: 25,
              marginHorizontal: 15,
            }}>
            {strings.basicInfoText}
          </Text>

          <View
            style={{
              marginHorizontal: 15,
              marginTop: 15,
            }}>
            <View style={[styles.row, {marginBottom: 0}]}>
              <View style={styles.col}>
                <Text style={styles.label}>{strings.gender}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.longTextStyle}>
                  {currentUserData.gender
                    ? capitalize(currentUserData.gender)
                    : strings.NA}
                </Text>
              </View>
            </View>
            <View style={[styles.row, {marginBottom: 0}]}>
              <View style={styles.col}>
                <Text style={styles.label}>{strings.homeCity}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.longTextStyle}>
                  {currentUserData.city
                    ? capitalize(currentUserData.city)
                    : strings.NA}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{strings.languages}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.longTextStyle}>
                  {currentUserData.language?.length > 0
                    ? currentUserData.language.join(', ')
                    : strings.NA}
                </Text>
              </View>
            </View>
          </View>
          <TCThinDivider height={7} marginTop={25} width={'100%'} />

          <Text
            style={{
              fontSize: 20,
              lineHeight: 30,
              fontFamily: fonts.RBold,
              marginTop: 25,
              marginHorizontal: 15,
            }}>
            {strings.message}
          </Text>

          <ReadMore
            numberOfLines={3}
            style={styles.longTextStyle}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeLessStyle={styles.moreLessText}
            seeMoreStyle={styles.moreLessText}>
            {messageText === '' ? strings.NA : messageText}
          </ReadMore>

          <TCThinDivider height={7} marginTop={25} width={'100%'} />
          {/* Accept button */}
          <TouchableOpacity
            onPress={onAcceptPress}
            style={{
              marginHorizontal: 15,
              backgroundColor: colors.reservationAmountColor,
              borderRadius: 30,

              marginTop: 25,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
                paddingVertical: 8,
                color: colors.whiteColor,
                textTransform: 'uppercase',
              }}>
              {strings.acceptTitle}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDeclinePress}
            style={{
              marginHorizontal: 15,
              backgroundColor: colors.lightGrey,
              borderRadius: 30,
              marginBottom: 100,
              marginTop: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
                paddingVertical: 8,
                color: colors.blackColor,
                textTransform: 'uppercase',
              }}>
              {strings.decline}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  col: {
    flex: 1,
    alignItems: 'flex-start',
  },
  longTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginHorizontal: 15,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
  },
  moreLessText: {
    fontSize: 12,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});
