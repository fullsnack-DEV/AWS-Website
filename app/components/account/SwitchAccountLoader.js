// @flow
import React, {useEffect} from 'react';
import {View, StyleSheet, Modal, Text} from 'react-native';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import GroupIcon from '../GroupIcon';

const SwitchAccountLoader = ({
  isVisible = false,
  entityName = '',
  entityImage = '',
  entityType = Verbs.entityTypePlayer,
  stopLoading = () => {},
}) => {
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        stopLoading();
      }, 3000);
    }
  }, [isVisible, stopLoading]);

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.parent}>
        <GroupIcon
          imageUrl={entityImage}
          groupName={entityName}
          entityType={entityType}
        />
        <View style={{marginTop: 15}}>
          <Text style={[styles.label, {fontFamily: fonts.RRegular}]}>
            {strings.switchingTo}
          </Text>
          <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
            {entityName}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
});
export default SwitchAccountLoader;
