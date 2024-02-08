// @flow
import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Text, Pressable, Image} from 'react-native';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {setStorage} from '../../../utils';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const infoList = [
  {
    title: strings.gender,
  },
  {
    title: strings.birthdayAgeText,
  },
  {
    title: strings.height,
  },
  {
    title: strings.weight,
  },
  {
    title: strings.phoneNumber,
  },
  {
    title: strings.emailPlaceHolder,
  },
];

const RequestBasicInfoInformationModal = ({
  isVisible = false,
  closeModal = () => {},
  groupId = null,
}) => {
  const [snapPoints, setSnapPoints] = useState([]);
  const [showCheck, setShowCheck] = useState(false);

  const RenderInfoDetail = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 5,
          height: 5,
          backgroundColor: colors.blackColor,
          borderRadius: 50,
        }}
      />
      <Text style={styles.basicInfoList}>{item?.title}</Text>
    </View>
  );
  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style3}
      containerStyle={{padding: 0, flex: 1}}
      externalSnapPoints={snapPoints}
      headerStyle={{borderBottomWidth: 0}}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;
          setSnapPoints([contentHeight, contentHeight]);
        }}>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 20,
            marginLeft: 30,
            marginRight: 44,
            marginBottom: 15,
            color: colors.lightBlackColor,
          }}>
          {strings.sentBasicInfoText}
        </Text>
        <View
          style={{
            marginLeft: 30,
          }}>
          <FlatList
            data={infoList}
            renderItem={({item}) => <RenderInfoDetail item={item} />}
          />
        </View>

        <Text style={styles.basicInfoRequestText}>
          {strings.requestInfoAcceptedText}
        </Text>

        <View style={{flexDirection: 'row', marginLeft: 25, marginBottom: 20}}>
          <Pressable
            onPress={async () => {
              const obj = {};
              obj[groupId] = !showCheck;

              await setStorage('showPopup', obj);
              setShowCheck(!showCheck);
            }}>
            <Image
              source={showCheck ? images.orangeCheckBox : images.uncheckWhite}
              style={{height: 18, width: 18, resizeMode: 'contain'}}
            />
          </Pressable>
          <Text style={styles.checkBoxItemText}>{strings.showAgainText}</Text>
        </View>
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  basicInfoList: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
    marginBottom: 5,
  },
  basicInfoRequestText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 30,
    marginRight: 26,
    lineHeight: 24,
    marginTop: 15,
    marginBottom: 30,
  },

  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.veryLightBlack,
    marginLeft: 7,
  },
});
export default RequestBasicInfoInformationModal;
