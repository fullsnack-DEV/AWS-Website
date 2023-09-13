// @flow
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import AuthContext from '../../../auth/context';
import GroupIcon from '../../../components/GroupIcon';
import {getChannelAvatar, getChannelName} from '../../../utils/streamChat';

const CustomAvatar = ({
  channel = {},
  imageStyle = {},
  placeHolderStyle = {},
  iconTextStyle = {},
}) => {
  const [profileList, setProfileList] = useState([]);
  const authContext = useContext(AuthContext);
  const {data} = channel;
  useEffect(() => {
    if (!data.image?.thumbnail) {
      const list = getChannelAvatar(channel, authContext.chatClient.userID);
      setProfileList(list.slice(0, 2));
    }
  }, [data, channel, authContext.chatClient.userID]);

  if (data.image?.thumbnail) {
    return (
      <GroupIcon
        imageUrl={data.image.thumbnail}
        groupName={getChannelName(channel, authContext.chatClient.userID)}
        showPlaceholder={false}
        textstyle={[{fontSize: 12}, iconTextStyle]}
        containerStyle={[styles.imageContainer, {marginRight: 10}, imageStyle]}
      />
    );
  }

  if (profileList.length > 0) {
    return (
      <View style={styles.container}>
        {profileList.map((item, index) => (
          <View
            key={index}
            style={{
              marginLeft: index === 0 ? 0 : index + 1 * -35,
              marginTop: index === 0 ? 0 : 10,
            }}>
            <GroupIcon
              imageUrl={item.imageUrl}
              entityType={item.entityType}
              groupName={getChannelName(channel, authContext.chatClient.userID)}
              containerStyle={[styles.imageContainer, imageStyle]}
              placeHolderStyle={placeHolderStyle}
              textstyle={iconTextStyle}
            />
          </View>
        ))}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 45,
    height: 45,
    borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
export default CustomAvatar;
