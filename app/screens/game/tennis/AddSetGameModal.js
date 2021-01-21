import Modal from 'react-native-modal';
import {
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import colors from '../../../Constants/Colors';
import Header from '../../../components/Home/Header';
import fonts from '../../../Constants/Fonts';
import TCInnerLoader from '../../../components/TCInnerLoader';

const AddSetGameModal = ({
  headingTitle,
  title,
  loading,
  subTitle,
  visible = false,
  onDatePickerClose,
  onDonePress,
}) => {
  const getAfterSuchMinuitesTime = (date, numMinuite, isIncreased = true) => {
    const dummyDate = new Date(date.getTime());
    return new Date(dummyDate.setMinutes(dummyDate.getMinutes() + (isIncreased ? numMinuite : -numMinuite)))
  }
  const [startsDate, setStartsDate] = useState(new Date());
  const [endsDate, setEndsDate] = useState(getAfterSuchMinuitesTime(new Date(), 1));
  const [toggleDateTimePickerFor, setToggleDateTimePickerFor] = useState(null);

  const toggleDateTimePicker = (forWhoom) => {
    if (forWhoom === toggleDateTimePickerFor) {
      setToggleDateTimePickerFor(null);
    } else {
      setToggleDateTimePickerFor(forWhoom);
    }
  }
  useEffect(() => {
    if (!visible) {
      setStartsDate(new Date())
      setEndsDate(getAfterSuchMinuitesTime(new Date(), 10));
      setToggleDateTimePickerFor(null);
    }
  }, [visible])

  const onClose = () => {
    onDatePickerClose();
  }
  const onDone = () => {
    onDonePress(startsDate, endsDate);
  }
  return (
    <Modal
          isVisible={visible}
          backdropColor="black"
          style={{
            margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0)',
          }}
          hasBackdrop
          onBackdropPress={onClose}
      >
      <SafeAreaView style={[styles.modalContainerViewStyle, { top: hp(25), height: hp(100), backgroundColor: colors.whiteColor }]}>
        <View style={styles.gradiantHeaderViewStyle}/>
        <Header
              mainContainerStyle={styles.headerMainContainerStyle}
              leftComponent={
                <TouchableOpacity style={{ width: 50 }} onPress={onClose}>
                  <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.blocklightgraycolor }}>{'Cancel'}</Text>
                </TouchableOpacity>
              }
              centerComponent={
                <View style={styles.headerCenterViewStyle}>
                  <Text style={styles.playInTextStyle}>{headingTitle}</Text>
                </View>
              }
              rightComponent={
                <TouchableOpacity onPress={onDone}>
                  <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.themeColor }}>{'Done'}</Text>
                </TouchableOpacity>
              }
          />

        <ScrollView style={styles.contentContainer}>
          {loading && (
            <View style={{
              position: 'absolute', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 1,
            }}>
              <TCInnerLoader visible={true} size={50}/>
            </View>
          )}
          <View style={{ padding: 15, flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: fonts.RMedium, color: colors.lightBlackColor }}>
              {title}
            </Text>
            <Text style={{
              fontSize: 14, fontFamily: fonts.RRegular, color: colors.redDelColor, marginTop: 10,
            }}>
              {subTitle}
            </Text>

            <Seperator/>
            {/* Starts */}
            <StartsEndComponent onPress={() => toggleDateTimePicker(1)} title={'Starts'} date={startsDate}/>
            {/* Date Time Picker */}
            {toggleDateTimePickerFor === 1 && (
              <DatePicker
                testID={'startsDateDateTimePicker'}
                style={styles.dateTimePickerStyle}
                date={startsDate}
                onDateChange={(date) => {
                  setStartsDate(date);
                  setEndsDate(getAfterSuchMinuitesTime(date, 1))
                }}
              />
            )}

            <Seperator/>
            {/* Ends */}
            <StartsEndComponent onPress={() => toggleDateTimePicker(2)} title={'Ends'} date={endsDate}/>
            {toggleDateTimePickerFor === 2 && (
              <DatePicker
                testID={'endsDateDateTimePicker'}
                minimumDate={getAfterSuchMinuitesTime(startsDate, 1)}
                style={styles.dateTimePickerStyle}
                  date={endsDate}
                  onDateChange={setEndsDate}
              />
            )}
            <Seperator/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const StartsEndComponent = ({
  title,
  date,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.startsEndContainer}>
    <Text style={{ fontSize: 16, fontFamily: fonts.RMedium, color: colors.lightBlackColor }}>{title}</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{
        fontSize: 14, fontFamily: fonts.RMedium, textDecorationLine: 'underline', color: colors.lightBlackColor,
      }}>
        {date ? moment(date).format('hh:mm a') : '00:00'}
      </Text>
      <Text style={{
        fontSize: 12,
        textDecorationLine: 'none',
        fontFamily: fonts.RMedium,
        color: colors.themeColor,
      }}>
        {'  '}
        {date && '(3h 55m)'}
      </Text>

    </View>
  </TouchableOpacity>
)
const Seperator = () => (
  <View style={{
    flex: 1, height: 2, backgroundColor: colors.thinDividerColor, marginVertical: 10,
  }}/>
)
const styles = StyleSheet.create({
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.themeColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  headerCenterViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  gradiantHeaderViewStyle: {
    position: 'absolute',
    width: '100%',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentContainer: {
    flex: 1,
  },
  startsEndContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  dateTimePickerStyle: {
    alignSelf: 'center',
    width: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddSetGameModal;
