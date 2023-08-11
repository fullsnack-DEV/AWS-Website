// @flow
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import CurrencyModal from '../CurrencyModal/CurrencyModal';
import styles from './ModalStyles';

const MatchFeeModal = ({
  gameFee = {},
  onChange = () => {},
  onChangeCurrency = () => {},
  currency = '',
  entityType = Verbs.entityTypePlayer,
}) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const getTitle = () => {
    switch (entityType) {
      case Verbs.entityTypePlayer:
        return strings.matchFeeModalTitle;

      case Verbs.entityTypeReferee:
        return strings.refereeFeeInfo;

      case Verbs.entityTypeScorekeeper:
        return strings.scorekeeperFeeInfo;

      default:
        return '';
    }
  };
  return (
    <View>
      <Text
        style={[
          styles.title,
          entityType === Verbs.entityTypeReferee
            ? {
                fontFamily: fonts.RMedium,
                marginBottom: 20,
              }
            : {},
        ]}>
        {getTitle()}
      </Text>

      {/* {entityType !== Verbs.entityTypeReferee && (
        <Text style={styles.matchFeeModalInfoText}>
          {strings.matchFeeModalInfo}
        </Text>
      )} */}

      <View
        style={[
          styles.greyContainer,
          styles.row,
          {paddingVertical: 6, marginTop: 0},
        ]}>
        <View />
        <TextInput
          value={`${gameFee.fee ?? ''}`}
          style={[
            styles.label,
            {marginRight: 15, flex: 1, textAlign: 'right', padding: 0},
          ]}
          onChangeText={(text) => {
            onChange(text);
          }}
          keyboardType="decimal-pad"
        />
        <Text
          style={
            styles.label
          }>{`${gameFee.currency_type}/${strings.matchText}`}</Text>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => setShowCurrencyModal(true)}>
        <Text style={styles.linkButtonText}>{strings.changeCurrency}</Text>
      </TouchableOpacity>

      {/* Match fee text */}

      <CurrencyModal
        isVisible={showCurrencyModal}
        closeList={() => setShowCurrencyModal(false)}
        selectedcurrency={currency}
        onNext={(item) => {
          onChangeCurrency(item);
          setShowCurrencyModal(false);
        }}
      />

      {entityType === Verbs.entityTypePlayer && (
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 15,
          }}>
          <Text style={styles.matchHostTitle}>{strings.whatMatchHostDo}</Text>
          <Text style={styles.matchfeeTitle}>{strings.matchFeeModalInfo2}</Text>
          <View>
            <View style={[styles.rowContainerStyle, {marginTop: 10}]}>
              <View style={styles.bulletContainerView} />
              <Text style={styles.bulletText}>{`${strings.venue}`}</Text>
            </View>
            <View style={[styles.rowContainerStyle, {marginTop: 5}]}>
              <View style={styles.bulletContainerView} />
              <Text
                style={styles.bulletText}>{`${strings.refereesTitle}`}</Text>
            </View>
            <View style={[styles.rowContainerStyle, {marginTop: 5}]}>
              <View style={styles.bulletContainerView} />
              <Text
                style={styles.bulletText}>{`${strings.scorekeeperTitle}`}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MatchFeeModal;
