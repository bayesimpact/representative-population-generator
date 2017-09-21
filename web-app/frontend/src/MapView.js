/*
The requirement from the [SOW](https://goo.gl/6tnw5D) was to use Mapbox.
There are two main React components that interface with Mapbox. The more
popular component is uber/react-map-gl, but I decided against using it as
it does not play nice with webpack and would force us to eject from the
create-react-app environment. Furthermore the examples look overly complex
for the simple problem we want to solve.
This is why I decided to use alex3165/react-mapbox-gl, the second most
popular component to interface from React to Mapbox. It seems well documented
and I have used it in the past.
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'

import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl';
import bbox from 'geojson-bbox'

import LoadingOverlay from './LoadingOverlay'

const CENTER_OF_CALIFORNIA = [-119.182111, 36.250471]

// Mapbox Access Token.
const accessToken = 'pk.eyJ1IjoiZGVkYW4iLCJhIjoiY2o3c29wcThlM3ZlZjMzdXdzczQ3bzIwMSJ9.pvxNu-R28kuQ6CXsHJST_w'
const Map = ReactMapboxGl({ accessToken });


class MapView extends Component {

  state = {
    hoveredPointIndex: null,
  }

  render() {
    const {isLoading, allPoints, allPointsCollection, style} = this.props
    const {hoveredPointIndex} = this.state
    const fullContainerStyle = {height: '100%', width: '100%'}
    let boundingBoxCoordinates = null
    if (allPointsCollection.features.length) {
      const boundingBox = bbox(allPointsCollection)
      boundingBoxCoordinates = [
        [boundingBox[0], boundingBox[1]],
        [boundingBox[2], boundingBox[3]],
      ]
    }
    return (
      <div style={{position: 'relative', ...style}}>
        {isLoading ? <LoadingOverlay /> : null}
        <Map
          style="mapbox://styles/mapbox/light-v9"
          center={CENTER_OF_CALIFORNIA}
          fitBounds={boundingBoxCoordinates}
          fitBoundsOptions={{padding: 30}}
          containerStyle={fullContainerStyle}>
            <Layer type="symbol" id="marker" layout={{"icon-image": "marker-15" }}>
              {allPoints.map((point, i) => (
                <Feature
                    onMouseEnter={() => this.setState({hoveredPointIndex: i})}
                    onMouseLeave={() => this.setState({hoveredPointIndex: null})}
                    key={i}
                    coordinates={point.geometry.coordinates}/>
              ))}
            </Layer>
            <div className="thing">
              {hoveredPointIndex !== null && <DetailsPopup point={allPoints[hoveredPointIndex]} />}
            </div>
        </Map>
      </div>
    )
  }
}


class DetailsPopup extends Component {

  render() {
    const {point} = this.props
    const pointProps = point.properties
    return (
      <Popup
          offset={[0, -20]}
          anchor="bottom"
          coordinates={point.geometry.coordinates} >
        <table style={{fontSize: 14, color: '#ddd'}}>
          <tbody>
            <TableRow name="County" value={pointProps.county} />
            <TableRow name="Zip" value={pointProps.zip} />
            <TableRow name="No. Residents" value={pointProps.residents} />
            <TableRow name="Lat" value={point.geometry.coordinates[1].toFixed(6)} />
            <TableRow name="Long" value={point.geometry.coordinates[0].toFixed(6)} />
          </tbody>
        </table>
      </Popup>
    )
  }
}


const TableRow = ({name, value}) => (
  <tr>
    <td>{name}</td>
    <td style={{paddingLeft: 10}}>{value}</td>
  </tr>
)


const mapStateToProps = state => {
  const allPoints = (state.data.areas || []).reduce((accu, area) => {
    return accu.concat(area.points.slice(0, state.app.nPoints))
  }, [])
  const allPointsCollection = {
    type: 'FeatureCollection',
    features: allPoints
  };
  return {
    isLoading: state.isLoading.counties || state.isLoading.areas,
    allPoints,
    allPointsCollection,
  }
}

export default connect(mapStateToProps)(MapView)
