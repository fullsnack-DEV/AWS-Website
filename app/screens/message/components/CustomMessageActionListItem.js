import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  MessageActionListItem,
  useMessageActionAnimation,
} from 'stream-chat-react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const CustomMessageActionListItem = ({action, actionType, ...rest}) => {
  const {onTap} = useMessageActionAnimation({action});
  if (actionType === 'quotedReply') {
    return (
      <TapGestureHandler onHandlerStateChange={onTap}>
        <Animated.View style={[styles.container, {marginHorizontal: 15}]}>
          <Text style={[styles.label, {color: colors.blueColorCard}]}>
            {rest.title}
          </Text>
        </Animated.View>
      </TapGestureHandler>
    );
  }

  if (actionType === 'deleteMessage') {
    return (
      <TapGestureHandler onHandlerStateChange={onTap}>
        <Animated.View style={styles.container}>
          <Text
            style={[
              styles.label,
              {color: colors.redColorCard, marginHorizontal: 15},
            ]}>
            {rest.title}
          </Text>
        </Animated.View>
      </TapGestureHandler>
    );
  }
  return (
    <MessageActionListItem action={action} actionType={actionType} {...rest} />
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  container: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorderColor,
  },
});

export default CustomMessageActionListItem;
