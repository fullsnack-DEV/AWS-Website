import React, { Component } from 'react';
import {
  Animated, StyleSheet, Text, View, I18nManager,
  Image,
} from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import images from '../../Constants/ImagePath'

export default class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.props.onPress}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          Archive
        </Animated.Text>
      </RectButton>
    );
  };

  renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={this.props.onPress}>
          <Text style={styles.actionText}>{text}</Text>
          <Image source={ images.deleteIcon} style={styles.deleteImgContainer} />
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress) => (
    <View
      style={{
        width: 70,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}>
      {/* {this.renderRightAction('More', '#C8C7CD', 192, progress)}
      {this.renderRightAction('Flag', '#ffab00', 128, progress)} */}
      {this.renderRightAction('', '#dd2c00', 0, progress)}
    </View>
  );

  updateRef = (ref) => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        // leftThreshold={30}
        rightThreshold={40}
        // renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    // padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  deleteImgContainer: {
    width: 18,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 30,
    // backgroundColor: 'yellow',

  },
});
