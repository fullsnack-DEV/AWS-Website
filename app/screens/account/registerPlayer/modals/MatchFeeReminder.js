// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { format } from 'react-string-format';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {strings} from '../../../../../Localization/translation';
import Verbs from '../../../../Constants/Verbs';
import CustomModalWrapper from '../../../../components/CustomModalWrapper';

const MatchFeeReminder = ({
  fee={},
  isVisible,
  onAddMatchFee = () => {},
  onContinue = () => {},
  entityType = Verbs.entityTypePlayer,
  onCloseModal = () => {},
  // isDoubleSport = false,
}) => {
  const getTitle = () => {
    switch (entityType) {
      case Verbs.entityTypePlayer:
        return strings.warningTextForFee1;

      case Verbs.entityTypeReferee:
        return strings.refereeFee.toLowerCase();

      case Verbs.entityTypeScorekeeper:
        return strings.scorekeeperFee.toLowerCase();

      default:
        return '';
    }
  };

  const getContent = () => {
    switch (entityType) {
      case Verbs.entityTypePlayer:
        return strings.matchFeeModalInfo;

      case Verbs.entityTypeReferee:
        return format(strings.refereeFeeModalContent,fee.fee ?? 0, fee.currency_type);

      case Verbs.entityTypeScorekeeper:
        return format(strings.scorekeeperFeeModalContent,fee.fee ?? 0, fee.currency_type);

      default:
        return '';
    }
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      containerStyle={{width: '100%', height: '100%', paddingHorizontal: 20}}>
      <View style={{flex: 1}}>
        {entityType === Verbs.entityTypePlayer ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.title}>
                {strings.warningTextForFee}
                <Text style={[styles.title, {color: colors.themeColor}]}>
                  {' '}
                  {getTitle()}
                </Text>
              </Text>

              <Text style={[styles.description, {marginBottom: 20,}]}>
                {strings.matchFeeModalInfo}
              </Text>
              {/* {isDoubleSport ? (
                <>
                  <Text
                    style={[
                      styles.description,
                      {fontFamily: fonts.RBold, marginBottom: 8},
                    ]}>
                    {strings.matchHostChallengeText}:
                  </Text>

                  <Text style={[styles.description, {marginBottom: 18}]}>
                    {strings.matchFeeModalInfo1}
                  </Text>
                </>
              ) : null} */}

              <Text
                style={[
                  styles.description,
                  {fontFamily: fonts.RBold, marginBottom: 8},
                ]}>
                {strings.whatMatchHostDo}
              </Text>

              <Text style={[styles.description, {marginBottom: 8}]}>
                {strings.matchFeeModalInfo2}
              </Text>
              <View
                style={{
                  flex: 1,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dotContainer} />
                  <Text style={styles.description}>{strings.venueText}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dotContainer} />
                  <Text style={styles.description}>
                    {strings.refereesTitle}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dotContainer} />
                  <Text style={styles.description}>
                    {strings.scorekeeperTitle}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{marginTop: Platform.OS === 'ios' ? 200 : 130}}>
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  {marginBottom: 15, backgroundColor: colors.themeColor},
                ]}
                onPress={onAddMatchFee}>
                <Text style={[styles.buttonText, {color: colors.whiteColor}]}>
                  {strings.addMatchFeeText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  {
                    backgroundColor: colors.grayBackgroundColor,
                  },
                ]}
                onPress={onContinue}>
                <Text style={styles.buttonText}>
                  {strings.continueWithNoMatchFeeText}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.title}>
                {strings.warningTextForFee}{' '}
                <Text style={[styles.title, {color: colors.themeColor}]}>
                  {getTitle()}?
                </Text>
              </Text>

              <Text style={[styles.description, {marginBottom: 23}]}>
                {getContent()}
              </Text>
            </View>
            {entityType === Verbs.entityTypeReferee ? (
              <View style={{marginBottom: 50}}>
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {marginBottom: 15, backgroundColor: colors.themeColor},
                  ]}
                  onPress={onAddMatchFee}>
                  <Text style={[styles.buttonText, {color: colors.whiteColor}]}>
                    {strings.addRefereeFee}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {
                      marginBottom: 15,
                      backgroundColor: colors.grayBackgroundColor,
                    },
                  ]}
                  onPress={onContinue}>
                  <Text style={styles.buttonText}>
                    {strings.continueWithNoRefereeFee}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {entityType === Verbs.entityTypeScorekeeper ? (
              <View style={{marginTop: 20}}>
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {marginBottom: 15, backgroundColor: colors.themeColor},
                  ]}
                  onPress={onAddMatchFee}>
                  <Text style={[styles.buttonText, {color: colors.whiteColor}]}>
                    {strings.addScorekeeperFee}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {
                      marginBottom: 5,
                      backgroundColor: colors.grayBackgroundColor,
                    },
                  ]}
                  onPress={onContinue}>
                  <Text style={styles.buttonText}>
                    {strings.continueWithNoScorekeeperFee}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    lineHeight: 35,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginBottom: 13,
    textAlign: 'left'
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'left',
  },
  buttonContainer: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  dotContainer: {
    width: 5,
    height: 5,
    backgroundColor: colors.lightBlackColor,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 3,
  },
});
export default MatchFeeReminder;
