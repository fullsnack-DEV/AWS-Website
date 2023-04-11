// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../Constants/Colors';

const MAX_LEVEL = 15;

const LevelBars = ({level = 0, containerStyle = {}}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const viewList = [];
    for (let index = 0; index < MAX_LEVEL; index++) {
      const element = {
        key: index.toString(),
        isFilled: index < level,
      };
      viewList.push(element);
    }
    setList(viewList);
  }, [level]);

  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}>
      {list.map((item, index) => (
        <View
          style={[
            styles.parent,
            item.isFilled ? {} : {opacity: 0.3},
            index !== list.length - 1 ? {marginRight: 1} : {},
          ]}
          key={item.key}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: 3,
    height: 10,
    backgroundColor: colors.yellowColor,
    borderRadius: 2,
  },
});
export default LevelBars;
