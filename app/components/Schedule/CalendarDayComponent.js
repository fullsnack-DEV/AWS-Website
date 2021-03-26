import React from 'react';
import {
 View, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

const weekDaysNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

class CalendarDayComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onDayPress = this.onDayPress.bind(this);
  }

  getContentStyle() {
    const { state, marking = {} } = this.props;
    const style = {
      content: {},
      text: {
        color: '#181c26',
      },
    };

    if (state === 'disabled') {
      style.text.color = '#c1c2c1';
    } else {
      if (marking.partiallyBlocked) {
        style.content.borderColor = colors.whiteColor;
        style.content.borderRadius = 50;
        style.content.borderWidth = 1;
      } else if (marking.partiallySoldOut) {
        style.content.borderColor = '#e35052';
        style.content.borderRadius = 50;
        style.content.borderWidth = 1;
      }

      if (marking.selected) {
        style.text.color = '#fff';
        style.content.backgroundColor = colors.themeColor;
        style.content.borderRadius = 50;
      } else if (marking.fullyBlocked) {
        style.text.color = '#fff';
        style.content.backgroundColor = '#c1c2c1';
        style.content.borderRadius = 50;
      } else if (marking.fullySoldOut) {
        style.text.color = '#fff';
        style.content.backgroundColor = '#e35052';
        style.content.borderRadius = 50;
      } else if (marking.event) {
        style.text.color = colors.themeColor;
        style.content.backgroundColor = colors.whiteColor;
         // style.content.borderRadius = 50;
      }
    }

    return style;
  }

  getFooterTextStyle() {
    const { marking = {}, state } = this.props;
    const style = {
      color: '#c1c2c1',
    };

    if (marking.inventory > 0 && state !== 'disabled') {
      style.color = colors.whiteColor;
    }
    return style;
  }

  getInventoryCount() {
    const { marking = {}, state } = this.props;
    if (typeof marking === 'object' && state !== 'disabled') {
      if (marking.inventory >= 0) {
        return marking.inventory;
      }
    }
    if (state === 'disabled') {
      return '';
    }
      return '';
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  render() {
    const contentStyle = this.getContentStyle();
    const highDemandImage = '';

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {
            this.props.horizontal
              ? <Text style={styles.weekName} numberOfLines={1}>
                {
                  weekDaysNames[this.props.date.weekDay]
                }
              </Text>
              : null
          }
        </View>
        <TouchableOpacity
          style={[styles.content, contentStyle.content]}
          onPress={this.onDayPress}
        >
          <Text style={[styles.contentText, contentStyle.text]}>
            {String(this.props.children)}
          </Text>
          {
            (this.props.marking.highDemand && this.props.state !== 'disabled')
              ? <Image source={highDemandImage} style={styles.smallIcon} />
              : null
          }
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={this.getFooterTextStyle()}>
            {this.getInventoryCount()}
          </Text>
        </View>
      </View>
    );
  }
}

CalendarDayComponent.propTypes = {
  children: PropTypes.any,
  state: PropTypes.string,
  marking: PropTypes.any,
  horizontal: PropTypes.bool,
  date: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  current: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 7,
  },
  weekName: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.googleColor,
  },
  content: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  footer: {
    flexDirection: 'row',
  },
  smallIcon: {
    width: 12,
    height: 12,
    position: 'absolute',
    top: -1,
    right: -1,
  },
});

export default CalendarDayComponent;
