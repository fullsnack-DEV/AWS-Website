// @flow
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {StyleSheet, Platform, StatusBar, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../../Constants/Colors';
import TCRemoveUser from '../connections/TCRemoveUser';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';

const renderBackdrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={styles.backdrop}
    opacity={6}
  />
);

const GoingUsersModal = ({
  modalRef,
  goingList = [],
  isOwner = true,
  onProfilePress = () => {},
  onRemovePress = () => {},
  onPressChat = () => {},
  onPressInvoice = () => {},
}) => {
  const snapPoints = useMemo(
    () => (Platform.OS === 'android' ? ['97%', '97%'] : ['94%', '94%']),
    [],
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={modalRef}
        backgroundStyle={styles.backgroundStyle}
        index={1}
        handleIndicatorStyle={styles.modalHandle}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDismissOnClose
        backdropComponent={renderBackdrop}>
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor={colors.modalBackgroundColor}
            barStyle="light-content"
          />
        )}
        <ScreenHeader
          title={strings.going}
          containerStyle={{paddingTop: 0, paddingBottom: 10}}
          rightIcon1={images.chatCreate}
          rightIcon2={images.newinvoiceIcon}
          iconContainerStyle={{marginRight: 15}}
          rightIcon1Press={onPressChat}
          rightIcon2Press={onPressInvoice}
        />
        <View style={{flex: 1, paddingTop: 20}}>
          <FlatList
            data={goingList}
            keyExtractor={(item, index) => index.toString()}
            bounces={false}
            renderItem={({item}) => (
              <TCRemoveUser
                item={item}
                isOwner={isOwner}
                onProfilePress={() => onProfilePress(item)}
                onRemovePress={() => onRemovePress(item)}
              />
            )}
          />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.modalBackgroundColor,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalHandle: {
    width: 40,
    height: 5,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: colors.modalHandleColor,
  },
  backgroundStyle: {
    borderRadius: 10,
  },
});
export default GoingUsersModal;
