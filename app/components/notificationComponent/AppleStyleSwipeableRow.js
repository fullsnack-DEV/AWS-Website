import React, {Component} from 'react';
import {Animated, StyleSheet, View, I18nManager, Image} from 'react-native';

import {RectButton} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class AppleStyleSwipeableRow extends Component {
  onPress = () => {
    this.close();
    this.props.onPress();
  };

  renderRightAction = (text, color, x, progress) => {
    const {style} = this.props;
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View
        style={{flex: 1, transform: [{translateX: trans}], ...style}}
      >
        <RectButton
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={this.onPress}
        >
          {/* <Text style={styles.actionText}>{text}</Text> */}
          <Image source={this.props.image} style={styles.deleteImgContainer} />
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress) => (
    <View
      style={{
        width: 70,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {this.renderRightAction('', this.props.color, 0, progress)}
    </View>
  );

  updateRef = (ref) => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };

  render() {
    const {children} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        rightThreshold={40}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  // actionText: {
  //   color: 'white',
  //   fontSize: 16,
  //   backgroundColor: 'transparent',
  //   // padding: 10,
  // },
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
