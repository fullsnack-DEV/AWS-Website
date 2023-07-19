// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {strings} from '../../../../../Localization/translation';
import Verbs from '../../../../Constants/Verbs';
import CustomModalWrapper from '../../../../components/CustomModalWrapper';

const MatchFeeReminder = ({
  isVisible,
  onAddMatchFee = () => {},
  onContinue = () => {},
  entityType = Verbs.entityTypePlayer,
  onCloseModal = () => {},
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
        return strings.refereeFeeModalContent;

      case Verbs.entityTypeScorekeeper:
        return strings.scorekeeperFeeModalContent;

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
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={styles.title}>
              {strings.warningTextForFee}
              <Text style={[styles.title, {color: colors.themeColor}]}>
                {' '}
                {getTitle()}
              </Text>
            </Text>

            <Text style={[styles.description, {marginBottom: 23}]}>
              {strings.matchFeeModalInfo}
            </Text>

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

            <Text style={[styles.description, {marginBottom: 23}]}>
              {'Venue\nReferees\nScorekeepers'}
            </Text>

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
                  marginBottom: 15,
                  backgroundColor: colors.grayBackgroundColor,
                },
              ]}
              onPress={onContinue}>
              <Text style={styles.buttonText}>
                {strings.continueWithNoMatchFeeText}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              // marginBottom: Platform.OS === 'ios' ? 50 : 0,
              marginBottom: 50,
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
              <View>
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
              <View>
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
                      marginBottom: 15,
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
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
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
});
export default MatchFeeReminder;
