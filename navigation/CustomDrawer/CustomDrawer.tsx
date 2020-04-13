import React, {Fragment} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Text, View, Image, Linking} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../theme/colors';

function customDrawer(props: any) {
  return (
    <Fragment>
      <DrawerContentScrollView {...props} style={{flex: 1}}>
        <View style={{flex: 9}}>
          {/* <TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: profile.image}}
                style={{width: 65, height: 65, margin: 8, borderRadius: 100}}
              />
              <View>
                <Text style={{fontSize: 16, fontFamily: 'Audiowide'}}>
                  {profile.fullName}
                </Text>
                <Text style={{fontSize: 13}}>{profile.mobile}</Text>
              </View>
            </View>
          </TouchableOpacity> */}
          <DrawerItemList activeTintColor={colors.primary} {...props} />
        </View>
      </DrawerContentScrollView>
    </Fragment>
  );
}

export default customDrawer;
