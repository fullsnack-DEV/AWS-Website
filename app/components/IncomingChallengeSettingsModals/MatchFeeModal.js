// @flow
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import DataSource from '../../Constants/DataSource';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';

import styles from './ModalStyles';
import modalStyles from './WrapperModalStyles';

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
      <Text style={styles.title}>{getTitle()}</Text>

      <Text
        style={{
          fontSize: 12,
          fontFamily: fonts.RRegular,
          lineHeight: 18,
          color: colors.googleColor,
          marginBottom: 25,
        }}>
        {strings.matchFeeModalInfo}
      </Text>

      <View
        style={[
          styles.greyContainer,
          styles.row,
          {paddingVertical: 6, marginTop: 0},
        ]}>
        <View />
        <TextInput
          value={`${gameFee.fee ?? 0}`}
          style={[
            styles.label,
            {marginRight: 5, flex: 1, textAlign: 'center', padding: 0},
          ]}
          onChangeText={(text) => {
            onChange(text);
          }}
          keyboardType="decimal-pad"
        />
        <Text
          style={styles.label}>{`${currency}/${strings.matchCapText}`}</Text>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => setShowCurrencyModal(true)}>
        <Text style={styles.linkButtonText}>{strings.changeCurrency}</Text>
      </TouchableOpacity>

      {/* Match fee text */}
      <View
        style={{
          marginTop: 50,
          marginLeft: 20,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RBold,
            lineHeight: 24,
            color: colors.googleColor,
          }}>
          {strings.whatMatchHostDo}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RRegular,
            lineHeight: 24,
            color: colors.googleColor,
            marginTop: 5,
          }}>
          {strings.matchFeeModalInfo2}
        </Text>
        <View
          style={{
            marginTop: -10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 5,
                width: 5,
                backgroundColor: colors.googleColor,
                borderRadius: 50,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
                color: colors.googleColor,
              }}>{`${strings.venue}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View
              style={{
                height: 5,
                width: 5,
                backgroundColor: colors.googleColor,
                borderRadius: 50,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
                color: colors.googleColor,
              }}>{`${strings.refereesTitle}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View
              style={{
                height: 5,
                width: 5,
                backgroundColor: colors.googleColor,
                borderRadius: 50,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
                color: colors.googleColor,
              }}>{`${strings.scorekeeperTitle}`}</Text>
          </View>
        </View>
      </View>

      <Modal visible={showCurrencyModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: colors.whiteColor,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <View style={modalStyles.headerRow}>
              <View style={{flex: 1}} />
              <View style={modalStyles.headerTitleContainer}>
                <Text style={modalStyles.headerTitle}>
                  {strings.currencySetting}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Pressable
                  style={{width: 26, height: 26}}
                  onPress={() => setShowCurrencyModal(false)}>
                  <Image source={images.crossImage} style={modalStyles.image} />
                </Pressable>
              </View>
            </View>
            <View style={modalStyles.divider} />
            <View style={{paddingHorizontal: 15, paddingVertical: 19}}>
              <FlatList
                data={DataSource.CurrencyType}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => (
                  <>
                    <Pressable
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                      }}
                      onPress={() => {
                        onChangeCurrency(item.value);
                        setShowCurrencyModal(false);
                      }}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 24,
                            fontFamily: fonts.RMedium,
                          }}>
                          {item.label}
                        </Text>
                      </View>
                      <Image
                        source={
                          currency === item.value
                            ? images.radioCheckYellow
                            : images.radioUnselect
                        }
                        style={{height: 22, width: 22}}
                      />
                    </Pressable>
                    <View style={modalStyles.divider} />
                  </>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MatchFeeModal;
