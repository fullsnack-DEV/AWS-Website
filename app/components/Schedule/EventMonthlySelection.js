import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
// import {Picker} from '@react-native-picker/picker';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
// import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import BottomSheet from '../modals/BottomSheet';

const EventMonthlySelection = ({
  dataSource = [],
  placeholder = '',
  value = '',
  onValueChange = () => {},
  containerStyle = {},
  title = '',
  titleStyle = {},
  editable = true,
  forLongList = false,
}) => {
  const [dropDownValue, setDropDownValue] = useState('');
  const [options, setOptions] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => {
    if (dataSource.length > 0) {
      const optionList = dataSource.map((item) => item.label);
      setOptions(optionList);
      if (value === 0) {
        setDropDownValue(strings.never);
      } else {
        const obj = dataSource.find((item) => item.value === value);
        setDropDownValue(obj?.label ?? '');
      }
    }
  }, [dataSource, value]);

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={{marginRight: 50}}>
        <Text style={[styles.headerTextStyle, titleStyle]}>{title}</Text>
      </View>
      <TouchableOpacity
        style={styles.dropDown}
        onPress={() => {
          if (editable) setShowBottomSheet(true);
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.label} numberOfLines={1}>
            {dropDownValue ?? placeholder}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Image source={images.arrowDown} style={styles.icon} />
        </View>
      </TouchableOpacity>
      <BottomSheet
        isVisible={showBottomSheet}
        closeModal={() => setShowBottomSheet(false)}
        type="ios"
        forLongList={forLongList}
        optionList={options}
        onSelect={(option) => {
          const obj = dataSource.find((item) => item.label === option);
          setShowBottomSheet(false);
          onValueChange(obj.value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: colors.textFieldBackground,
  },
  headerTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  dropDown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default EventMonthlySelection;
