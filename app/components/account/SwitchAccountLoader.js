// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Text, Image} from 'react-native';
import * as Progress from 'react-native-progress';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

import Verbs from '../../Constants/Verbs';
import GroupIcon from '../GroupIcon';

const SwitchAccountLoader = ({
  isVisible = false,
  entityName = '',
  entityImage = '',
  entityType = Verbs.entityTypePlayer,
  stopLoading = () => {},
  forCreateTeam = false,
}) => {
  const [isIntermediate, setIsIntermediate] = useState(true);
  console.log(entityName, 'From nanme');
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

  const TeamPatchforSwitch = () => (
    <>
      <View style={styles.teamPatContainer}>
        <View>
          <Image source={images.teamPatch} style={styles.patchImagestyle} />
        </View>
        <Image source={entityImage} style={styles.enityImageStyle} />
        <View style={styles.namePatchContainer}>
          <Text style={styles.namePatchtxt}>{entityName.charAt(0)}</Text>
        </View>
      </View>
    </>
  );

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.parent}>
        {forCreateTeam ? (
          <TeamPatchforSwitch />
        ) : (
          <GroupIcon
            imageUrl={entityImage}
            groupName={entityName}
            entityType={entityType}
          />
        )}

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
  teamPatContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 100,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: colors.greyBorderColor,
  },
  patchImagestyle: {
    height: 15,
    width: 15,
    resizeMode: 'cover',
    position: 'absolute',
    left: 10,
    top: 45,
  },
  enityImageStyle: {
    height: 50,
    width: 50,

    borderRadius: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 5,
  },
  namePatchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  namePatchtxt: {
    marginTop: -5,
    textAlign: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
});
export default SwitchAccountLoader;
