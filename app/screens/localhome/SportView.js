// @flow
import React, {useContext} from 'react';
import {View, StyleSheet, Pressable, Image, Text} from 'react-native';
import colors from '../../Constants/Colors';
import {getSportDetails} from '../../utils/sportsActivityUtils';
import AuthContext from '../../auth/context';
import fonts from '../../Constants/Fonts';

const SportView = ({item = {}, imageBaseUrl = '', onPress = () => {}}) => {
  const authContext = useContext(AuthContext);
  return (
    <Pressable
      style={[
        styles.sportView,
        styles.row,
        {borderLeftColor: colors.redColorCard},
      ]}
      onPress={onPress}
      disabled={item.is_hide}>
      <View style={styles.innerViewContainer}>
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <Image
              // source={{uri: `${imageBaseUrl}${item.player_image}`}}
              source={{
                uri: `${imageBaseUrl}${
                  getSportDetails(
                    item.sport,
                    item.sport_type,
                    authContext.sports,
                  ).sport_image
                }`,
              }}
              style={styles.sportIcon}
            />
          </View>
          <View>
            <Text style={styles.sportName}>{item.sport_name}</Text>
            <Text style={styles.matchCount}>0 match</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sportView: {
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: colors.lightGrayBackground,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 20,
    borderLeftWidth: 8,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerViewContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  matchCount: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  sportIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});
export default SportView;
