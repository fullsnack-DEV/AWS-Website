import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventItemRender({
  title,
  children,
  containerStyle,
  headerTextStyle,
  isRequired = false,
  icon,
  clickInfoIcon,
  type,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        <Text style={[styles.headerTextStyle, headerTextStyle]}>
          {title}{' '}
          {isRequired && <Text style={{color: colors.darkThemeColor}}> *</Text>}
        </Text>
        {icon && (
          <TouchableOpacity onPress={() => clickInfoIcon(type)}>
            <Image
              source={icon}
              style={{width: 15, height: 15, marginTop: 10, marginLeft: 10}}
            />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
  },
  headerTextStyle: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
});

export default EventItemRender;
