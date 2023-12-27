// @flow
import React from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import TCRemoveUser from '../connections/TCRemoveUser';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import CustomModalWrapper from '../../../components/CustomModalWrapper';

const GoingUsersModal = ({
  isVisible,
  closeModal = () => {},
  goingList = [],
  ownerId,
  onProfilePress = () => {},
  onRemovePress = () => {},
  onPressChat = () => {},
  onPressInvoice = () => {},
  authContext,
}) => (
  <CustomModalWrapper
    isVisible={isVisible}
    closeModal={closeModal}
    containerStyle={{padding: 0}}>
    <ScreenHeader
      title={strings.going}
      containerStyle={{paddingTop: 10, paddingBottom: 5, paddingRight: 15}}
      rightIcon1={images.chatCreate}
      rightIcon2={images.newinvoiceIcon}
      iconContainerStyle={{marginRight: 15}}
      rightIcon1Press={onPressChat}
      rightIcon2Press={onPressInvoice}
    />
    <View style={{paddingTop: 20}}>
      <FlatList
        data={goingList}
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
        renderItem={({item}) => (
          <TCRemoveUser
            item={item}
            isOwner={item.user_id === ownerId}
            onProfilePress={() => onProfilePress(item)}
            onRemovePress={() => onRemovePress(item)}
            authContext={authContext}
            ownerId={ownerId}
          />
        )}
      />
    </View>
  </CustomModalWrapper>
);

export default GoingUsersModal;
