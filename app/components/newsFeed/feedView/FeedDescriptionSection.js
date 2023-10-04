import React from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import NewsFeedDescription from '../NewsFeedDescription';

const layout = Dimensions.get('window');

const FeedDescriptionSection = ({
  navigation,
  tagData = [],
  descriptions = '',
  readMore = false,
  setReadMore = () => {},
}) => {
  if (descriptions?.length > 0) {
    return (
      <View
        style={[
          styles.parent,
          readMore ? {backgroundColor: colors.modalBackgroundColor} : {},
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <NewsFeedDescription
            descriptions={descriptions}
            numberOfLineDisplay={2}
            tagData={tagData}
            navigation={navigation}
            descText={styles.descText}
            descriptionTxt={styles.descText}
            tagStyle={{fontFamily: fonts.RBold, color: colors.whiteColor}}
            moreTextStyle={styles.moreText}
            setReadMoreCollapsed={() => {
              setReadMore(!readMore);
            }}
          />
        </ScrollView>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    top: 50,
    position: 'absolute',
    maxHeight:
      Platform.OS === 'ios' ? layout.height * 0.76 : layout.height * 0.78,
    paddingLeft: 45,
    paddingRight: 35,
  },
  descText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
  moreText: {
    fontSize: 12,
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
  },
});

export default FeedDescriptionSection;
