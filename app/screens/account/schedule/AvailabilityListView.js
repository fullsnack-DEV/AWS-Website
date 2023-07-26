// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import BlockSlotView from '../../../components/Schedule/BlockSlotView';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const AvailabilityListView = ({
  item = {},
  onEdit = () => {},
  isAdmin = false,
  onPress = () => {},
}) => (
  <View style={{marginBottom: 20}}>
    <View style={styles.header}>
      <Text style={styles.label}>{item.title.toUpperCase()}</Text>
      {isAdmin && (
        <TouchableOpacity style={styles.editContainer} onPress={onEdit}>
          <Image source={images.editProfilePencil} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
    {item.data.map((ele, key) => (
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
    ))}
  </View>
);

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
    fontFamily: fonts.RBold,
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
