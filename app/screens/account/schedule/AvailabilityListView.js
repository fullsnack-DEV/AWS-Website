// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const AvailabilityListView = ({
  item = {},
  isAdmin = false,
  onEdit,
  onPress,
}) => {
  const renderBlockSlotView = (ele, key) => (
    <BlockSlotView
      key={key}
      item={ele}
      startDate={ele.start_datetime}
      endDate={ele.end_datetime}
      allDay={ele.allDay === true}
      index={key}
      slots={item.data}
      onPress={() => {
        if (isAdmin) {
          onPress(ele);
        }
      }}
    />
  );

  const renderItem = ({item: ele, index}) => renderBlockSlotView(ele, index);

  return (
    <View style={{marginBottom: 20}}>
      <View style={styles.header}>
        <Text style={styles.label}>{item.title}</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.editContainer} onPress={onEdit}>
            <Image source={images.editProfilePencil} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={item.data}
        keyExtractor={(ele, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  editContainer: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default AvailabilityListView;
