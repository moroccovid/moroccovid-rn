import React, {Fragment} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import colors from '../../theme/colors';

function customDrawer(props: any, number: number) {
  return (
    <Fragment>
      <DrawerContentScrollView {...props} style={{flex: 1}}>
        <View style={{flex: 9}}>
          <TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../assets/user.png')}
                style={{width: 65, height: 65, margin: 8, borderRadius: 100}}
              />
              <View>
                <Text style={{fontSize: 16}}>{number}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <DrawerItemList activeTintColor={colors.primary} {...props} />
        </View>
      </DrawerContentScrollView>
    </Fragment>
  );
}

export default customDrawer;
