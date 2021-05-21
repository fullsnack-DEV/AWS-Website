import React, {

} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import images from '../../Constants/ImagePath'
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

import TCInfoField from '../TCInfoField';
import TCThinDivider from '../TCThinDivider';
import TCUserRoleBadge from '../TCUserRoleBadge';
import TCGroupNameBadge from '../TCGroupNameBadge';

const GroupMembership = ({
  groupData, switchID, edit = false, onEditPressed,
}) => (
  <>
    <View style={styles.topViewContainer}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profileView}>
          <Image source={groupData.thumbnail ? { uri: groupData.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage } />
        </View>
        <View style={styles.topTextContainer}>
          <TCGroupNameBadge name={groupData.group_name} groupType={groupData.entity_type}/>
          <View style={{ flexDirection: 'row' }}>
            {groupData.is_admin && <TCUserRoleBadge title='Admin' titleColor={colors.themeColor}/>}
            {groupData.is_coach && <TCUserRoleBadge title='Coach' titleColor={colors.greeColor}/>}
            {groupData.is_player && <TCUserRoleBadge title='Player' titleColor={colors.playerBadgeColor}/>}
          </View>
        </View>
      </View>
      {edit || groupData.group_id === switchID ? <TouchableWithoutFeedback onPress={onEditPressed}>
        <Image source={ images.editSection } style={ styles.editImage } />
      </TouchableWithoutFeedback> : null}
    </View>
    {groupData.entity_type === 'team' && <>
      <TCInfoField title={'Position'} value={groupData.positions ? groupData.positions.join(', ') : 'N/A'} marginLeft={25} marginTop={30}/>
      <TCInfoField title={'Jersey Number'} value={groupData.jersey_number ? groupData.jersey_number : 'N/A'} marginLeft={25} />
      <TCInfoField title={'Appearance'} value={groupData.appearance ? groupData.appearance : 'N/A'} marginLeft={25} />
      <TCInfoField title={'Status'} value={groupData.status ? groupData.status.join(', ') : 'N/A'} marginLeft={25} color={colors.themeColor}/>
    </>}
    {groupData.note ? <Text style={styles.groupDescriptionText}>{groupData.note}
    </Text> : null}
    <TCThinDivider marginTop={20} width={'100%'}/>
  </>
  )
const styles = StyleSheet.create({
  // familyView: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginTop: 10,
  //   marginLeft: 20,
  //   marginRight: 20,
  //   alignItems: 'center',
  // },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 80,
  },

  topViewContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-between',

  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {

    marginLeft: 10,
    alignSelf: 'center',

  },
  groupDescriptionText: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  editImage: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',
    width: 18,
  },
});

export default GroupMembership;
