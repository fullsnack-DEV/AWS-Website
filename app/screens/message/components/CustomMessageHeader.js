// @flow
import React, {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';

const CustomMessageHeader = ({message, channel}) => {
  const authContext = useContext(AuthContext);
  const groupStyle = message.groupStyles[0];

  const getMessageAvtar = (messageUserId = '') => {
    const obj = {
      imageUrl: '',
      entityType: Verbs.entityTypePlayer,
    };

    const member = channel.state.members[messageUserId];
    if (
      member.user.entityType === Verbs.entityTypeTeam ||
      member.user.entityType === Verbs.entityTypeClub
    ) {
      if (member.role === 'moderator' || member.role === 'owner') {
        obj.imageUrl = channel.data?.image;
        obj.entityType = member.user.entityType;
      } else {
        obj.imageUrl = channel.data?.image ?? '';
        obj.entityType = member.user.entityType;
      }
    } else {
      obj.imageUrl = member.user.group_image ?? '';
      obj.entityType = member.user.entityType;
    }

    return obj;
  };

  if (
    message.user.id !== authContext.chatClient.userID &&
    (groupStyle === 'top' || groupStyle === 'single')
  ) {
    return (
      <View
        style={{
          maxWidth: Dimensions.get('window').width * 0.6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <GroupIcon
          imageUrl={getMessageAvtar(message.user.id).imageUrl}
          groupName={message.user.group_name ?? message.user.name}
          entityType={getMessageAvtar(message.user.id).entityType}
          textstyle={{fontSize: 10, marginTop: 1}}
          containerStyle={styles.iconContainer}
          placeHolderStyle={styles.placeHolderStyle}
        />
        <Text style={styles.messageHeaderText} numberOfLines={1}>
          {message.user.group_name ?? message.user.name}
        </Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  messageHeaderText: {
    fontSize: 16,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 5,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 10,
  },
  placeHolderStyle: {
    width: 12,
    height: 12,
    bottom: -3,
    right: -2,
  },
});
export default CustomMessageHeader;
