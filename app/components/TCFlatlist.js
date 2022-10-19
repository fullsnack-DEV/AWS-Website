/* eslint-disable no-empty */
/* eslint-disable no-unsafe-optional-chaining */
import React, {memo} from 'react';
import FlatList from 'react-native-drag-flatlist';

const TCFlatlist = ({data, renderItem, keyExtractor}) => (
  <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
);

export default memo(TCFlatlist);
