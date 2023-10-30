import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import GroupIcon from '../GroupIcon';

const WritePost = ({postDataItem, onWritePostPress}) => {
  const [entityData, setEntityData] = useState({});

  useEffect(() => {
    if (postDataItem) {
      setEntityData(postDataItem);
    }
  }, [postDataItem]);

  return (
    <View style={styles.mainContainer}>
      <GroupIcon
        imageUrl={entityData.thumbnail}
        entityType={entityData.entity_type}
        groupName={entityData.group_name}
        containerStyle={styles.writePostActorContainer}
        textstyle={{fontSize: 14}}
      />
      <TouchableOpacity style={styles.writePostView} onPress={onWritePostPress}>
        <Text style={styles.writePostText}> {strings.writePostText} </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
  },
  writePostActorContainer: {
    width: 40,
    height: 40,
    borderWidth: 1,
  },
  writePostView: {
    flex: 1,
    padding: 10,
    marginLeft: 15,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
  },
  writePostText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});

export default memo(WritePost);
