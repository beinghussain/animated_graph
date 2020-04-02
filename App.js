import React from 'react';
import {SafeAreaView, StatusBar, View, StyleSheet} from 'react-native';
import Chart from './components/Chart';
import d from './data/data.json';

const data = d.filter((item, index) => {
  const _item = JSON.stringify(item);
  return (
    index ===
    d.findIndex(obj => {
      return JSON.stringify(obj) === _item;
    })
  );
});

data.forEach(e => {
  e.x = new Date(e.x);
});

class App extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#2C68CE" />
        <SafeAreaView>{<Chart data={data} />}</SafeAreaView>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#2C68CE',
    flex: 1,
    justifyContent: 'center',
  },
});
