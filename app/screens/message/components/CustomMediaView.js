// @flow
import React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';

const CustomMediaView = ({onPress = () => {}}) => {
  const {message} = useMessageContext();

  if (message.attachments.length > 0) {
    return (
      <Pressable
        style={styles.parent}
        onPress={() =>
          onPress({
            url: message.attachments[0].image_url,
            mediaType: message.attachments[0].type,
            entityName: message.user.name,
            msgId: message.id,
          })
        }>
        <Image
          source={{uri: message.attachments[0].image_url}}
          style={styles.image}
        />
      </Pressable>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  parent: {
    width: 150,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default CustomMediaView;
