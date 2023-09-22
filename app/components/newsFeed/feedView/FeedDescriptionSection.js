import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
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
              // numberOfLineDisplay={2}
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
      <ScrollView style={styles.parent}
      scrollEnabled>
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
      </ScrollView>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  parent: {
    flex:1,
    top: 50,
    left: 45,
    right: 15,
    position: 'absolute',
    maxHeight: Dimensions.get('window').height * 0.75,
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
