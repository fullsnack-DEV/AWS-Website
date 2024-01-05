// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

const QuestionAndOptionsComponent = ({
  title = '',
  options = [],
  onSelect = () => {},
  selectedOption = {},
}) => (
  <View>
    <Text style={styles.questionText}>{title}</Text>
    {options.map((option, index) => (
      <TouchableOpacity
        onPress={() => onSelect(option)}
        key={index}
        style={[
          styles.row,
          {marginBottom: options.length - 1 !== index ? 15 : 0},
        ]}>
        <View style={{flex: 1, marginRight: 5}}>
          <Text style={styles.radioBtnText}>{option.label}</Text>
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
    marginBottom: 25,
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
