import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import NewsFeedDescription from '../NewsFeedDescription';

const FeedDescriptionSection = ({
  navigation,
  tagData = [],
  descriptions = '',
  readMore = false,
  setReadMore = () => {},
}) => {
  if (descriptions?.length > 0) {
    if (readMore) {
      return (
        <View style={[styles.parent, {flex: 1}]}>
          <ScrollView>
            <NewsFeedDescription
              descriptions={descriptions}
              numberOfLineDisplay={2}
              tagData={tagData}
              navigation={navigation}
              descText={styles.descText}
              descriptionTxt={styles.descText}
              moreTextStyle={styles.moreText}
              tagStyle={{fontFamily: fonts.RBold, color: colors.whiteColor}}
              onCollapse={() => {
                setReadMore(!readMore);
              }}
            />
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={styles.parent}>
        <NewsFeedDescription
          descriptions={descriptions}
          numberOfLineDisplay={2}
          tagData={tagData}
          navigation={navigation}
          descText={styles.descText}
          descriptionTxt={styles.descText}
          tagStyle={{fontFamily: fonts.RBold, color: colors.whiteColor}}
          moreTextStyle={styles.moreText}
          onExpand={() => {
            setReadMore(!readMore);
          }}
        />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  parent: {
    marginLeft: 45,
    marginTop: 15,
    marginRight: 15,
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
