// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {strings} from '../../../../../Localization/translation';
import Verbs from '../../../../Constants/Verbs';

const MatchFeeReminder = ({
  isVisible,
  onAddMatchFee = () => {},
  onContinue = () => {},
  entityType = Verbs.entityTypePlayer,
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

  return (
    <Modal visible={isVisible} transparent>
      <View style={styles.parent}>
        <View style={styles.card}>
          {entityType === Verbs.entityTypePlayer ? (
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <Text style={styles.title}>
                {strings.warningTextForFee}{' '}
                <Text style={[styles.title, {color: colors.themeColor}]}>
                  {getTitle()}?
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
                marginBottom: Platform.OS === 'ios' ? 50 : 0,
              }}>
              <View>
                <Text style={styles.title}>
                  {strings.warningTextForFee}{' '}
                  <Text style={[styles.title, {color: colors.themeColor}]}>
                    {getTitle()}?
                  </Text>
                </Text>

                <Text style={[styles.description, {marginBottom: 23}]}>
                  {strings.matchFeeModalInfo}
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
                    <Text
                      style={[styles.buttonText, {color: colors.whiteColor}]}>
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
                    <Text
                      style={[styles.buttonText, {color: colors.whiteColor}]}>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    height: Dimensions.get('window').height - 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
    paddingTop: 50,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 25,
    lineHeight: 35,
    fontFamily: fonts.RBlack,
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
