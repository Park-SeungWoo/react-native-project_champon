import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import MapView, {Marker} from 'react-native-maps';

let pwidth = Dimensions.get('window').width;
let pheight = Dimensions.get('window').height;

MapApp.propTypes = {
  locationcoords: PropTypes.array.isRequired,
};

function MapApp({locationcoords}) {
  return (
    <MapView
      style={styles.map}
      region={{
        latitude: 37.504276999999,
        longitude: 126.76202,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}>
      {locationcoords.map((coords, i) => (
        <Marker
          coordinate={{latitude: coords.lat, longitude: coords.long}}
          title={`${coords.id}`}
          description={`${coords.id}`}
          key={i}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: pwidth,
    height: pheight,
    position: 'absolute',
    zIndex: 0,
  },
});

export default MapApp;
