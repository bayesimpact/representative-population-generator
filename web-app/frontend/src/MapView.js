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
const INITIAL_ZOOM_LEVEL = [3]

// Mapbox Access Token.
const accessToken = 'pk.eyJ1IjoiZGVkYW4iLCJhIjoiY2o3c29wcThlM3ZlZjMzdXdzczQ3bzIwMSJ9.pvxNu-R28kuQ6CXsHJST_w'
const Map = ReactMapboxGl({ accessToken });

const areaColors = [
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


class MapView extends Component {

  state = {
    hoveredPoint: null,
  }

  render() {
    const {isLoading, allPoints, style, areas, boundingBoxCoordinates} = this.props
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
          {areas.map((area, i) => {
            return (
              <div key={i}>
                <BoundaryLayer
                    area={area}
                    fillColor={areaColors[i % areaColors.length]} />
                <PointsLayer
                    area={area}
                    color={areaColors[i % areaColors.length]}
                    onPointHover={point => this.setState({hoveredPoint: point})}
                    onPointLeave={() => this.setState({hoveredPoint: null})} />

              </div>
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

  render() {
    const {area, color, onPointHover, onPointLeave} = this.props
    const pointStyle = {
      'circle-radius': 7,
      'circle-color': color,
      'circle-opacity': .8,
    }
    return (
      <Layer type="circle" paint={pointStyle}>
        {area.points.map((point, i) => (
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


class BoundaryLayer extends Component {

  render() {
    const {area, fillColor} = this.props
    const style = {
      'fill-color': fillColor,
      'fill-opacity': .7,
    }
    if (!area.boundary) {
      return null
    }
    return (
      <Layer type="fill" paint={style} >
        <Feature coordinates={area.boundary.geometry.coordinates} />
      </Layer>
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
  return {
    isLoading: state.isLoading.counties || state.isLoading.areas,
    allPoints,
    allPointsCollection,
    boundingBoxCoordinates,
    areas: state.data.areas || [],
  }
}

export default connect(mapStateToProps)(MapView)
