// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';

const QuestionAndOptionsComponent = ({
  title = '',
  options = [],
  onSelect = () => {},
  selectedOption = {},
  subText = '',
  privacyKey = '',
}) => (
  <View>
    <View style={{marginBottom: 25}}>
      <Text style={styles.questionText}>{title}</Text>
      {subText && (
        <Text style={[styles.radioBtnText, {marginTop: 5}]}>{subText}</Text>
      )}
    </View>
    {options.map((option, index) => (
      <TouchableOpacity
        onPress={() => onSelect({...option, key: privacyKey})}
        key={index}
        style={[
          styles.row,
          {marginBottom: options.length - 1 !== index ? 15 : 0},
        ]}>
        <View style={{flex: 1, marginRight: 5}}>
          <Text style={styles.radioBtnText}>{strings[option.label]}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={
              selectedOption.value === option.value
                ? images.radioRoundOrange
                : images.radioUnselect
            }
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  questionText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  radioBtnText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default QuestionAndOptionsComponent;
