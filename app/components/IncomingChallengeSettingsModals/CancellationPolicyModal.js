// @flow
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import styles from './ModalStyles';
import Verbs from '../../Constants/Verbs';

const policiesTypeList = [
  {label: strings.strictText, id: 1},
  {label: strings.moderateText, id: 2},
  {label: strings.flexibleText, id: 3},
];

const policyEnum = {
  1: Verbs.strictText,
  2: Verbs.moderateText,
  3: Verbs.flexibleText,
};

const CancellationPolicyModal = ({refundPolicy = '', onChange = () => {}}) => {
  const getDescription = () => {
    switch (refundPolicy) {
      case Verbs.strictText:
        return (
          <>
            <View style={{marginBottom: 25}}>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.strictText}
              </Text>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.strictPoint1Title}
              </Text>
              <Text style={styles.greyText}>{strings.strictPoint1Desc}</Text>
            </View>
            <View style={{marginBottom: 25}}>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.strictPoint2Title}
              </Text>
              <Text style={styles.greyText}>{strings.strictPoint2Desc}</Text>
            </View>

            <View>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.strictPoint3Title}
              </Text>
              <Text style={styles.greyText}>{strings.strictPoint3Desc}</Text>
            </View>
          </>
        );

      case Verbs.moderateText:
        return (
          <>
            <View style={{marginBottom: 25}}>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.moderateText}
              </Text>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.moderatePoint1Title}
              </Text>
              <Text style={styles.greyText}>{strings.moderatePoint1Desc}</Text>
            </View>
            <View style={{marginBottom: 25}}>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.moderatePoint2Title}
              </Text>
              <Text style={styles.greyText}>{strings.moderatePoint2Desc}</Text>
            </View>

            <View>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.moderatePoint3Title}
              </Text>
              <Text style={styles.greyText}>{strings.moderatePoint3Desc}</Text>
            </View>
          </>
        );

      case Verbs.flexibleText:
        return (
          <>
            <View style={{marginBottom: 25}}>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.flexibleText}
              </Text>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.flexiblePoint1Title}
              </Text>
              <Text style={styles.greyText}>{strings.flexiblePoint1Desc}</Text>
            </View>

            <View>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.flexiblePoint2Title}
              </Text>
              <Text style={styles.greyText}>{strings.flexiblePoint2Desc}</Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };
  return (
    <View>
      <Text style={styles.title}>{strings.chooseCancellationPolicyTitle}</Text>

      {policiesTypeList.map((item, index) => (
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: 10,
              marginBottom: policiesTypeList.length - 1 === index ? 0 : 13,
            },
          ]}
          key={item.id}>
          <Text style={styles.label}>{item.label}</Text>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => onChange(policyEnum[item.id])}>
            {refundPolicy === policyEnum[item.id] ? (
              <Image source={images.radioCheckYellow} style={styles.image} />
            ) : (
              <Image source={images.radioUnselect} style={styles.image} />
            )}
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.greyContainer}>{getDescription()}</View>
    </View>
  );
};

export default CancellationPolicyModal;
