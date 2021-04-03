/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import ImageLoader from './ImageLoader';
import { createStackNavigator } from "@react-navigation/stack";
import moment from 'moment'
const openUrl = (url) => () => Linking.openURL(url)
export const toMS = (ms) => { ms = parseInt(ms, 10); let f = Math.floor; let s = f(ms / 1000); let g = (n) => ('00' + n).slice(-2); return g(f(s / 60) % 60) + ':' + g(s % 60) }
const URL = "https://itunes.apple.com/search?term=Michael+jackson"
const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={'Dashboard'} component={Dashboard} />
        <Stack.Screen name={'Details'} component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Dashboard = (props) => {
  const navigation = useNavigation()
  const [songs, setSongs] = useState([])
  const [isLoading, setLoading] = useState(false)

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10
    },
    track: {
      flex: 1,
      fontSize: 15
    },
    time: {
      fontSize: 11
    },
    album: {
      fontSize: 10,
      color: 'grey'
    },
    btnView: {
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center'
    },
    heading: {
      marginVertical: 10,
      fontSize: 20,
      fontWeight: 'bold'
    },
    image: {
      height: 40,
      width: 40,
    }
  }), [])

  useEffect(() => {
    setLoading(true)
    fetch(URL).then((resp) => resp.json()).then(response => {
      // console.log(response)
      if (response && response.results && response.results.length > 0) {
        setSongs(response.results.filter((item) => (item.wrapperType == 'track' && item?.kind == 'song')))
      }
      setLoading(false)
    }).catch(e => { console.log(e); setLoading(false) })
  }, [])
  if (isLoading) {
    return <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <StatusBar backgroundColor={'red'} />
      <ActivityIndicator
        size={'small'}
        color={'gray'} />
    </SafeAreaView>
  }
  return (
    <SafeAreaView style={styles.container} >
      <StatusBar backgroundColor={'red'} />
      <FlatList
        data={songs}
        ListHeaderComponent={() => <Text style={styles.heading}>Songs ({songs.length})</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'grey' }} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const { artistName, trackName, collectionName, trackTimeMillis, artworkUrl60 } = item
          return (
            <TouchableOpacity onPress={() => navigation.navigate('Details', { song: item })} activeOpacity={0.5} style={styles.btnView}>
              <ImageLoader borderRadius={5} style={styles.image} source={{ uri: artworkUrl60 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <Text style={styles.track}>{trackName}</Text>
                  <Text style={styles.time}>{toMS(trackTimeMillis)}</Text>
                </View>
                <Text numberOfLines={1} style={styles.album}>{artistName} ({collectionName})</Text>
              </View>
            </TouchableOpacity>
          )
        }}

      />
    </SafeAreaView>
  );
}



const Details = (props) => {
  const navigation = useNavigation()
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: '#f5f5f5'
    },
    track: {
      fontSize: 15
    },
    time: {
      fontSize: 11
    },
    album: {
      fontSize: 10,
      color: 'grey'
    },
    image: {
      height: 80,
      width: 80,
      marginVertical: 10
    },
    detailCard: {
      marginHorizontal: 10,
      marginBottom: 10
    },
    back: {
      fontSize: 12,
      color: 'red',
      position: 'absolute',
      top: 4,
      left: 4
    },
    content: {
      alignItems: 'center',
      marginVertical: 20,
      paddingHorizontal: '20%'
    }
  }), [])

  const { artistName, trackName, collectionName, trackTimeMillis, trackPrice, currency, trackCount, primaryGenreName, releaseDate, collectionPrice, artistViewUrl, trackViewUrl, artworkUrl100, collectionViewUrl } = props.route.params.song

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar backgroundColor={'red'} />
      <ScrollView>
        <View style={styles.content}>
          <Text onPress={() => navigation.goBack()} style={styles.back}>Back</Text>
          <ImageLoader borderRadius={5} style={styles.image} source={{ uri: artworkUrl100 }} />
          <Text onPress={openUrl(trackViewUrl)} style={[styles.track, { textAlign: 'center' }]}>{trackName}</Text>
          <Text style={[styles.album, { textAlign: 'center' }]}>{artistName} ({collectionName})</Text>
        </View>

        <DetailCard title={'Artist'} onPress={openUrl(artistViewUrl)} value={artistName} styles={styles} />
        <DetailCard title={'Duration'} value={toMS(trackTimeMillis)} styles={styles} />
        <DetailCard title={'Genre'} value={primaryGenreName} styles={styles} />
        <DetailCard title={'Released on'} value={releaseDate ? moment(releaseDate).format("MMM DD, YYYY") : ""} styles={styles} />
        <DetailCard title={'Price'} value={Math.abs(trackPrice) + " " + currency} styles={styles} />
        <DetailCard title={'Collection'} onPress={openUrl(collectionViewUrl)} value={collectionName} styles={styles} />
        <DetailCard title={'Collection Size'} value={Math.abs(trackCount) + " Tracks"} styles={styles} />
        <DetailCard title={'Collection Price'} value={Math.abs(collectionPrice) + " " + currency} styles={styles} />
      </ScrollView>

    </SafeAreaView>
  )
}

const DetailCard = (props) => {
  const { title, onPress, value, styles } = props
  return (
    <View style={styles.detailCard}>
      <Text style={styles.album}>{title}</Text>
      <Text onPress={onPress} style={styles.time}>{value}</Text>
    </View>
  )
}

export default App;
