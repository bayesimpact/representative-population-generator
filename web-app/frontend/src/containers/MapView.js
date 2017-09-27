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
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl'
import bbox from 'geojson-bbox'

import LoadingOverlay from '../components/LoadingOverlay'
import types from '../types'


const CENTER_OF_CALIFORNIA = [-119.182111, 36.250471]
const INITIAL_ZOOM_LEVEL = [3]
const AREA_COLORS = [
  '#fbb4ae',
  '#b3cde3',
  '#ccebc5',
  '#decbe4',
  '#fed9a6',
  '#ffffcc',
  '#e5d8bd',
  '#fddaec',
  '#f2f2f2',
]

// Mapbox Access Token.
const accessToken = 'pk.eyJ1IjoiZGVkYW4iLCJhIjoiY2o3c29wcThlM3ZlZjMzdXdzczQ3bzIwMSJ9.pvxNu-R28kuQ6CXsHJST_w'
const Map = ReactMapboxGl({ accessToken });


class MapView extends Component {

  static propTypes = {
    groupedPoints: PropTypes.objectOf(PropTypes.arrayOf(types.pointShape)),
    isLoading: PropTypes.bool.isRequired,
    style: PropTypes.object,
    boundingBoxCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  };

  state = {
    hoveredPoint: null,
  };

  handlePointHover = point => {
    this.setState({hoveredPoint: point})
  };

  handlePointLeave = () => {
    this.setState({hoveredPoint: null})
  };

  render() {
    const {groupedPoints, isLoading, style, boundingBoxCoordinates} = this.props
    const {hoveredPoint} = this.state
    const fullContainerStyle = {height: '100%', width: '100%'}
    return (
      <div style={{position: 'relative', ...style}}>
        {isLoading ? <LoadingOverlay /> : null}
        <Map
            // eslint-disable-next-line
            style="mapbox://styles/mapbox/light-v9"
            center={CENTER_OF_CALIFORNIA}
            zoom={INITIAL_ZOOM_LEVEL}
            fitBounds={boundingBoxCoordinates}
            fitBoundsOptions={{padding: 30}}
            containerStyle={fullContainerStyle}>
          {Object.keys(groupedPoints).map(i => {
            // Points are grouped because the mapbox component has issues with many layers.
            // Performance becomes horrible when adding a layer for every area and we only
            // have a small number of colors anyways.
            return (
              <PointsLayer
                  key={i}
                  points={groupedPoints[i]}
                  color={AREA_COLORS[i]}
                  onPointHover={this.handlePointHover}
                  onPointLeave={this.handlePointLeave} />
            )
          })}
          <div className="popup-container">
            {hoveredPoint && <DetailsPopup point={hoveredPoint} />}
          </div>
        </Map>
      </div>
    )
  }
}


class PointsLayer extends Component {

  static propTypes = {
    points: PropTypes.arrayOf(types.pointShape).isRequired,
    color: PropTypes.string.isRequired,
    onPointHover: PropTypes.func.isRequired,
    onPointLeave: PropTypes.func.isRequired,
  };

  render() {
    const {points, color, onPointHover, onPointLeave} = this.props
    const pointStyle = {
      'circle-radius': 7,
      'circle-color': color,
      'circle-opacity': .8,
    }
    return (
      <Layer type="circle" paint={pointStyle}>
        {points.map((point, i) => (
          <Feature
              onMouseEnter={() => onPointHover(point)}
              onMouseLeave={() => onPointLeave()}
              key={i}
              coordinates={point.geometry.coordinates}/>
        ))}
      </Layer>
    )
  }
}


class DetailsPopup extends Component {

  static propTypes = {
    point: types.pointShape,
  };

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
            <TableRow name="No. Residents" value={Math.round(pointProps.population)} />
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
    <td style={{paddingLeft: 15}}>{value}</td>
  </tr>
)
TableRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}


const mapStateToProps = state => {
  const allPoints = (state.data.areas || []).reduce((accu, area) => {
    return accu.concat(area.points.slice(0, state.app.nPoints))
  }, [])
  const allPointsCollection = {
    type: 'FeatureCollection',
    features: allPoints
  };
  let boundingBoxCoordinates = null
  if (allPointsCollection.features.length) {
    const boundingBox = bbox(allPointsCollection)
    boundingBoxCoordinates = [
      [boundingBox[0], boundingBox[1]],
      [boundingBox[2], boundingBox[3]],
    ]
  }
  const groupedPoints = (state.data.areas || []).reduce((accu, area, i) => {
    const groupIndex = i % AREA_COLORS.length
    const group = accu[groupIndex] || []
    accu[groupIndex] = group.concat(area.points.slice(0, state.app.nPoints))
    return accu
  }, {})
  return {
    isLoading: state.isLoading.counties || state.isLoading.areas,
    boundingBoxCoordinates,
    groupedPoints,
  }
}

export default connect(mapStateToProps)(MapView)
