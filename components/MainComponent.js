import React, { Component } from 'react';
import Dictionary from './DictionaryComponent';
import Home from "./HomeComponent";
import { View, Platform, StatusBar } from "react-native";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';




const HomeStack = createStackNavigator(
  {
    Home: { screen: Home },

  },
);

const DictionaryStack = createStackNavigator(
  {
    Dictionary: { screen: Dictionary },

  },
);

const App = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Dictionary: { screen: DictionaryStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Dictionary') {
            iconName = 'ios-book';
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#841584',
      inactiveTintColor: 'gray',
    },
  }
);

const BottomNavigation = createAppContainer(App);






class Main extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight * 0 }}>
        <BottomNavigation />
      </View>
    );
  }
}

export default Main;