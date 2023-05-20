import {View, StyleSheet, Platform} from 'react-native';
import React, {useState} from 'react';
import moment from 'moment';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import FilterTimeSelectItem from '../../../components/Filter/FilterTimeSelectItem';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

import DateTimePickerView from '../../../components/Schedule/DateTimePickerModal';
import Verbs from '../../../Constants/Verbs';

export default function DateFilterModal({isVisible, closeList, onApplyPress}) {
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());

  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleEndDate, setVisibleEndDate] = useState(false);

  const handleCancelPress = () => {
    setVisibleDate(false);
    setVisibleEndDate(false);
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style1}
      Top={Platform.OS === 'android' ? 570 : 690}
      onRightButtonPress={() => onApplyPress(startDate, endDate)}
      headerRightButtonText={strings.apply}
      title={strings.pickaDate}
      containerStyle={{padding: 0, width: '100%', height: '25%'}}>
      <View
        style={{
          flex: 1,
          marginTop: 20,
        }}>
        <View style={styles.filterContainer}>
          <FilterTimeSelectItem
            title={strings.from}
            date={moment(startDate).format(Verbs.DATE_MDY_FORMAT)}
            onDatePress={() => {
              setVisibleDate(true);
            }}
          />
          <FilterTimeSelectItem
            title={strings.to}
            date={moment(endDate).format(Verbs.DATE_MDY_FORMAT)}
            onDatePress={() => {
              setVisibleEndDate(true);
            }}
          />
        </View>

        <DateTimePickerView
          title={strings.chooseDateTimeText}
          visible={visibleDate}
          onDone={(date) => {
            const selectedDate = date;
            const currentDate = new Date();
            // Calculate the new to date
            let newToDate = new Date(
              selectedDate.getFullYear() + 1,
              selectedDate.getMonth(),
              selectedDate.getDate(),
            );

            const diff = currentDate.getTime() - selectedDate.getTime();
            const oneYear = 365 * 24 * 60 * 60 * 1000;
            if (diff > oneYear) {
              newToDate = new Date(
                selectedDate.getFullYear() + 1,
                selectedDate.getMonth(),
                selectedDate.getDate(),
              );
            }
            // Ensure the new to date is not set to a future date
            if (newToDate > currentDate) {
              newToDate = currentDate;
            }

            setStartDate(new Date(selectedDate));
            setEndDate(newToDate);

            setVisibleDate(false);
          }}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          mode={'date'}
          maximumDate={new Date()}
          date={startDate}
        />

        <DateTimePickerView
          title={strings.chooseDateTimeText}
          visible={visibleEndDate}
          onDone={(date) => {
            setEndDate(date);

            const oneYearBefore = new Date(date.getTime());
            oneYearBefore.setFullYear(date.getFullYear() - 1);
            setStartDate(oneYearBefore);

            setVisibleEndDate(false);
          }}
          onCancel={handleCancelPress}
          onHide={handleCancelPress}
          mode={'date'}
          maximumDate={new Date()}
          date={startDate}
        />
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderRadius: 5,
    width: '94%',
    height: 40,
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,

    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
});
