// @flow
import React, {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getChannelMembers} from '../../../utils/streamChat';
import Verbs from '../../../Constants/Verbs';

const CustomMessageHeader = ({message, channel}) => {
  const authContext = useContext(AuthContext);

  const getEntityName = (messageUserId = '') => {
    let entityName = '';
    const membersList = getChannelMembers(channel);
    const member = channel.state.members[messageUserId];

    if (
      membersList.length > 2 ||
      channel.data?.group_type === Verbs.channelTypeGeneral ||
      channel.data?.channel_type === Verbs.channelTypeAuto
    ) {
      entityName = member.user.group_name ?? member.user.name;
    } else {
      entityName = member.user.group_name ?? '';
    }

    return entityName ? (
      <View style={styles.row}>
        <View>
          <Text style={styles.messageHeaderText} numberOfLines={1}>
            {entityName}
          </Text>
        </View>
        {message.user.group_name &&
        message.user.id !== authContext.chatClient.userID ? (
          <View style={{flex: 1}}>
            <Text
              style={[
                styles.messageHeaderText,
                {
                  fontFamily: fonts.RRegular,
                  color: colors.userPostTimeColor,
                  marginLeft: 5,
                },
              ]}
              numberOfLines={1}>
              - {message.user.name}
            </Text>
          </View>
        ) : null}
      </View>
    ) : null;
  };

  if (message.user.id !== authContext.chatClient.userID) {
    return <View style={styles.parent}>{getEntityName(message.user.id)}</View>;
  }
  return null;
};

const styles = StyleSheet.create({
  parent: {
    maxWidth: Dimensions.get('window').width * 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
  },
  messageHeaderText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
  },
});
export default CustomMessageHeader;
