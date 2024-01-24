// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {
  PrivacyKeyEnum,
  feedsHideUnhideOption,
  feedsPrivacyOption,
} from '../../Constants/PrivacyOptionsConstant';
import SwitchButton from '../../components/SwitchButton';

const options = [
  {
    label: strings.likeCount,
    icon: images.unlikeImage,
    option: feedsHideUnhideOption,
    key: PrivacyKeyEnum.LikeCount,
  },
  {
    label: strings.commenting,
    icon: images.commentImage,
    option: feedsPrivacyOption,
    key: PrivacyKeyEnum.CommentOnPost,
  },
  {
    label: strings.reposting,
    icon: images.shareImage,
    option: feedsPrivacyOption,
    key: PrivacyKeyEnum.SharePost,
  },
];

const privacyOptions = [
  PrivacyKeyEnum.LikeCount,
  PrivacyKeyEnum.CommentOnPost,
  PrivacyKeyEnum.SharePost,
];

const FeedsAdvancedSettingsModal = ({
  showSettingsModal = false,
  onCloseModal = () => {},
  onSelect = () => {},
  privacySettings = {},
}) => {
  const [snapPoints, setSnapPoints] = useState([]);
  const [tempPrivacy, setTempPrivacy] = useState({});

  useEffect(() => {
    if (showSettingsModal) {
      const obj = {};
      privacyOptions.forEach((key) => {
        obj[key] = privacySettings[key] ?? 1;
      });
      setTempPrivacy(obj);
    }
  }, [showSettingsModal, privacySettings]);

  return (
    <CustomModalWrapper
      isVisible={showSettingsModal}
      closeModal={onCloseModal}
      modalType={ModalTypes.style6}
      title={strings.advancedSettings}
      externalSnapPoints={snapPoints}
      containerStyle={{padding: 0, paddingTop: 10}}
      headerRightButtonText={strings.done}
      onRightButtonPress={() => onSelect(tempPrivacy)}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;

          setSnapPoints([contentHeight, contentHeight]);
        }}>
        {options.map((item, index) => (
          <View key={index}>
            <View style={styles.listItem}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View style={[styles.icon, {marginRight: 10}]}>
                  <Image source={item.icon} style={styles.image} />
                </View>
                <Text style={styles.languageList}>{item.label}</Text>
              </View>
              <SwitchButton
                options={item.option}
                onPress={(option) => {
                  const updatedSettings = {...tempPrivacy};
                  updatedSettings[item.key] = option.value;
                  setTempPrivacy({...updatedSettings});
                }}
                selectedOption={tempPrivacy[item.key]}
              />
            </View>
            {options.length - 1 !== index && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  languageList: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  listItem: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    margin: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
  icon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default FeedsAdvancedSettingsModal;
