// @flow
import React from 'react';
import {StyleSheet, Image, Pressable, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';

const CustomMediaView = ({onPress = () => {}, onLongPress = () => {}}) => {
  const {message} = useMessageContext();

  if (message.attachments.length > 0) {
    if (message.attachments.length === 1) {
      return (
        <Pressable
          style={styles.parent}
          onPress={() =>
            onPress({
              url:
                message.attachments[0].image_url ??
                message.attachments[0].thumb_url,
              mediaType: message.attachments[0].type,
              entityName: message.user.name,
              msgId: message.id,
            })
          }
          onLongPress={onLongPress}>
          <Image
            source={{
              uri:
                message.attachments[0].image_url ??
                message.attachments[0].thumb_url,
            }}
            style={styles.image}
          />
        </Pressable>
      );
    }

    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {message.attachments.map((attachemnt, index) => (
          <Pressable
            key={index}
            style={[
              {width: '50%', height: 120},
              message.attachments.length % 2 !== 0 &&
              index === message.attachments.length - 1
                ? {width: '100%'}
                : {},
            ]}
            onPress={() =>
              onPress({
                url: attachemnt.image_url,
                mediaType: attachemnt.type,
                entityName: message.user.name,
                msgId: message.id,
              })
            }
            onLongPress={() => {
              console.log('long pressed');
            }}>
            <Image source={{uri: attachemnt.image_url}} style={styles.image} />
          </Pressable>
        ))}
      </View>
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
