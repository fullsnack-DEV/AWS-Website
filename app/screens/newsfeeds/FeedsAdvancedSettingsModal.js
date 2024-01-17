// @flow
import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Text, Image} from 'react-native';
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

const FeedsAdvancedSettingsModal = ({
  showSettingsModal = false,
  onCloseModal = () => {},
  onSelect = () => {},
  privacySettings = {},
}) => {
  const [snapPoints, setSnapPoints] = useState([]);
  return (
    <CustomModalWrapper
      isVisible={showSettingsModal}
      closeModal={onCloseModal}
      modalType={ModalTypes.style5}
      title={strings.privacySettings}
      externalSnapPoints={snapPoints}
      containerStyle={{padding: 0, paddingTop: 10}}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;

          setSnapPoints([
            '50%',
            contentHeight,
            Dimensions.get('window').height - 40,
          ]);
        }}>
        <Text style={styles.modalTitile}>{strings.advancedSettings}</Text>
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
                onPress={(option) => onSelect(option.value, item.key)}
                selectedOption={privacySettings[item.key]}
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
  modalTitile: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 26,
  },
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
