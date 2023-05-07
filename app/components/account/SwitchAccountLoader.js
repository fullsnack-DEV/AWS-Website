// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Text} from 'react-native';
import * as Progress from 'react-native-progress';
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
  const [isIntermediate, setIsIntermediate] = useState(true);
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsIntermediate(false);
      }, 2000);
      setTimeout(() => {
        stopLoading();
      }, 3000);
    }
  }, [isVisible, stopLoading]);

  const getLoaderColor = () => {
    switch (entityType) {
      case Verbs.entityTypeClub:
        return 'rgba(0, 193, 104, 0.6)';

      case Verbs.entityTypeTeam:
        return 'rgba(255, 88, 0, 0.6)';

      default:
        return 'rgba(255, 138, 1, 0.6)';
    }
  };

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
        <View style={{position: 'absolute', bottom: 60}}>
          <Progress.Bar
            progress={1}
            width={136}
            height={5}
            borderRadius={5}
            borderWidth={0}
            color={getLoaderColor()}
            unfilledColor={colors.grayBackgroundColor}
            indeterminate={isIntermediate}
          />
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
