// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {AutoCompleteSuggestionHeader} from 'stream-chat-react-native';
import CustomAutoCompleteSuggestionItem from './CustomAutoCompleteSuggestionItem';

const CustomAutoCompleteSuggestionsList = ({
  data,
  onSelect,
  queryText,
  triggerType,
}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const groupIds = [];
      const membersList = [];
      data.forEach((item) => {
        if (item.id.includes('@')) {
          const id = item.id.split('@')[0];
          if (!groupIds.includes(id)) groupIds.push(id);
        } else {
          const obj = {
            entityName: item.name,
            members: [item],
          };
          membersList.push(obj);
        }
      });

      const adminsList = [];
      groupIds.forEach((groupId) => {
        const arr = data.filter((item) => item.id.includes(groupId));
        const groupName = arr.find((item) => item.group_name)?.group_name ?? '';
        const obj = {
          entityName: groupName,
          members: [...arr],
        };

        adminsList.push(obj);
      });

      setList([...membersList, ...adminsList]);
    }
  }, [data]);

  return (
    <View style={styles.parent}>
      <FlatList
        data={list}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={
          <AutoCompleteSuggestionHeader
            queryText={queryText}
            triggerType={triggerType}
          />
        }
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              onSelect(item.members[0]);
            }}>
            <CustomAutoCompleteSuggestionItem
              itemProps={item}
              triggerType={triggerType}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    padding: 15,
  },
});
export default CustomAutoCompleteSuggestionsList;
