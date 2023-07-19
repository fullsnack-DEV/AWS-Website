import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useMessageContext, useOverlayContext} from 'stream-chat-react-native';
import AuthContext from '../../../auth/context';
import {newReactionData} from '../constants';

const CustomReactionComponent = ({channel = {}}) => {
  const {message} = useMessageContext();
  const {setOverlay} = useOverlayContext();
  const authContext = useContext(AuthContext);

  const handleMessageReaction = async (type) => {
    const user_id = authContext.chatClient.userID;
    try {
      await channel.sendReaction(
        message.id,
        {type, user_id},
        {enforce_unique: true},
      );
    } catch (error) {
      console.log({error});
    }
    setOverlay('none');
  };

  return (
    <View style={styles.container}>
      {newReactionData.map((Item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            handleMessageReaction(Item.type);
          }}
          style={styles.iconContainer}>
          <Image source={Item.Icon} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default CustomReactionComponent;
