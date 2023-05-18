/* eslint-disable no-nested-ternary */
import React , {useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils/index';
import ChallengeAvailability from '../../screens/account/schedule/ChallengeAvailability';
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
  userData,
  uid,
  addToSlotData,
  deleteFromSlotData,
  deleteOrCreateSlotData
}) {


  const CurrentItem = useRef();
  const [visibleAvailabilityModal, setVisibleAvailabilityModal] =
  useState(false);
  const [heightRange, setHeightRange] = useState(0.5);
  const getTimeFormat = (dateValue) =>
  moment(Utility.getJSDate(dateValue)).format('h:mm a');


  
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
          if((Object.entries(userData).length > 0 && userData.user_id === uid) || 
          Object.entries(userData).length === 0){ 
            CurrentItem.current.value = item;
            setVisibleAvailabilityModal(true);
            // FreeBlockStatus()
          }
        }}
        >
          <View
            style={{
              marginTop: 8,
              marginBottom: 8,
              backgroundColor: '#F2F2F2',
              height: 40,
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 1,
              flexDirection: 'row'
            }}>
            <Text style={styles.blockFieldValue} numberOfLines={3}>
              {allDay
                ? strings.allDay
                : `${getTimeFormat(startDate)} - ${getTimeFormat(endDate)}`}
            </Text>
            {
              (slots.length - 1) === index && (
              <Text style={[styles.blockFieldValue, {fontSize: 10, marginTop: -2}]}> {strings.plusDayOne}</Text>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
        ref={CurrentItem} 
        onPress={() =>  { 
          if((Object.entries(userData).length > 0 && userData.user_id === uid) || 
          Object.entries(userData).length === 0){ 
            CurrentItem.current.value = item;
            setVisibleAvailabilityModal(true);
            // BlockAvailibityStatus()
          }
        }}>
          <View
            style={{
              marginTop: 8,
              marginBottom: 8,
              backgroundColor: colors.availabilitySlotsBackground,
              height: 40,
              width: '90%',
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
              <Text style={[styles.fieldValue, {fontSize: 10, marginTop: -2}]}> {strings.plusDayOne}</Text>
            )}
          </View>
        </TouchableOpacity>
      )}


      {/*  Availability modal */}
      <Modal
        isVisible={visibleAvailabilityModal}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={() => {
          setVisibleAvailabilityModal(false);
        }}
        backdropOpacity={0.5}>
        <View style={[styles.modalMainViewStyle, {height: Dimensions.get('window').height * heightRange}]}>
          <ChallengeAvailability
            setVisibleAvailabilityModal={setVisibleAvailabilityModal}
            slots={[CurrentItem?.current?.value]}
            addToSlotData={addToSlotData}
            deleteFromSlotData={deleteFromSlotData}
            setHeightRange={setHeightRange}
            deleteOrCreateSlotData={deleteOrCreateSlotData}
            slotLevel={true}
          />
        </View>
      </Modal>
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
    color: colors.darkGrayColor,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  modalMainViewStyle: {
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
});
