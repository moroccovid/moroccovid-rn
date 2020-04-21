import React, {Fragment} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {View, Image} from 'react-native';
import colors from '../../theme/colors';

function customDrawer(props: any) {
  return (
    <Fragment>
      <DrawerContentScrollView {...props} style={{flex: 1}}>
        <View style={{flex: 9}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Image
              source={require('../../assets/logo256.png')}
              style={{width: 100, height: 100}}
            />
          </View>
          <DrawerItemList activeTintColor={colors.primary} {...props} />
        </View>
      </DrawerContentScrollView>
    </Fragment>
  );
}

export default customDrawer;
