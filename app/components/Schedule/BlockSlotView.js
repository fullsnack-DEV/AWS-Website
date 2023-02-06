/* eslint-disable no-nested-ternary */
import React , {useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
// import {strings} from '../../../../Localization/translation';


export default function BlockSlotView({
  item,
  startDate,
  endDate,
  allDay = false,
  selected,
  index,
  slots,
  strings,
  deleteSlot,
  createSlot
}) {

  const BlockSlotStatus = useRef();
  const FreeSlotStatus = useRef();
  const CurrentItem = useRef();
  const getTimeFormat = (dateValue) =>
  moment(new Date(dateValue * 1000)).format('h:mma');


  const BlockAvailibityStatus = () => {
    BlockSlotStatus.current.show();
  }


  const FreeBlockStatus = () => {
    FreeSlotStatus.current.show();
  }

  return (
    <>
      {selected ? (
        <LinearGradient
          colors={[colors.greenGradientEnd, colors.greenGradientStart]}
          style={{
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: colors.whiteColor,
            height: 35,
            width: '80%',
            alignSelf: 'center',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.googleColor,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}>
          <Text
            style={[styles.fieldValue, {color: colors.whiteColor}]}
            numberOfLines={3}>
            {allDay
              ? strings.allDay
              : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}` }
          </Text>
        </LinearGradient>
      ) : item.blocked ? (
        <TouchableOpacity
        ref={CurrentItem} 
        onPress={() =>  { 
          CurrentItem.current.value = item;
          FreeBlockStatus()
        }}
        >
          <View
            style={{
              marginTop: 8,
              marginBottom: 8,
              backgroundColor: '#F2F2F2',
              height: 40,
              width: '85%',
              alignSelf: 'center',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 1,
            }}>
            <Text style={styles.blockFieldValue} numberOfLines={3}>
              {allDay
                ? strings.allDay
                : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
        ref={CurrentItem} 
        onPress={() =>  { 
          CurrentItem.current.value = item;
          BlockAvailibityStatus()
        }}>
          <View
            style={{
              marginTop: 8,
              marginBottom: 8,
              backgroundColor: '#F2F2F2',
              height: 40,
              width: '85%',
              alignSelf: 'center',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 1,
              flexDirection: 'row'
            }}>
            <Text style={styles.fieldValue} numberOfLines={3}>
              {allDay
                ? strings.allDay
                : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
            </Text>
            {
              (slots.length - 1) === index && (
              <Text style={[styles.fieldValue, {fontSize: 10, marginTop: -2}]}>+1day</Text>
            )}
          </View>
        </TouchableOpacity>
      )}

      <ActionSheet
        ref={BlockSlotStatus}
        options={[
          strings.block,
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        onPress={(itemIndex) => {
          if (itemIndex === 0) {
            createSlot(CurrentItem.current.value)
          }
        }}
      />

      <ActionSheet
        ref={FreeSlotStatus}
        options={[
          strings.makeAvailable,
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        onPress={(itemIndex) => {
          if (itemIndex === 0) {
            deleteSlot(CurrentItem.current.value)
          }
        }}
      />
    </>
  );
}


const styles = StyleSheet.create({
  fieldValue: {
    fontSize: 16,
    color: colors.greenGradientStart,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  blockFieldValue: {
    fontSize: 16,
    color: colors.linesepratorColor,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
});
