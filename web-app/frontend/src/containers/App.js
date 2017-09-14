import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectZipCounty, fetchPointAsIfNeeded, uploadDocumentRequest } from '../actions'
import Picker from '../components/Picker'
import PointAs from '../components/PointAs'
import {CSVLink, CSVDownload} from 'react-csv'

class App extends Component {
  static propTypes = {
    selectedZipCounty: PropTypes.string.isRequired,
    pointas: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, selectedZipCounty } = this.props
    dispatch(fetchPointAsIfNeeded(selectedZipCounty))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedZipCounty !== this.props.selectedZipCounty) {
      const { dispatch, selectedZipCounty } = nextProps
      dispatch(fetchPointAsIfNeeded(selectedZipCounty))
    }
  }

  handleChange = nextZipCounty => {
    this.props.dispatch(selectZipCounty(nextZipCounty))
  }

  handleFileUpload = e => {
    const {dispatch} = this.props
    dispatch(uploadDocumentRequest({
       document: e.target.files[0],
       name: 'data_file'
    }))
  }

  render() {
    const { selectedZipCounty, pointas, isFetching, lastUpdated } = this.props
    const headers =["latitude", "longitude", "zip", "residents", "county"]
    const csv_from_props = Array.from(
      pointas.map(function(pointa){
        return [
          pointa.geometry.coordinates[0],
          pointa.geometry.coordinates[1],
          pointa.properties.zip,
          pointa.properties.residents,
          pointa.properties.county]
      })
    )
    const isEmpty = 0
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload} />
        <CSVLink
          data={csv_from_props}
          filename="representative_points.csv"
          headers={headers}>
          Download me
        </CSVLink>
        <Picker value={selectedZipCounty}
                onChange={this.handleChange}
                options={[ '[{"county":"sanFrancisco","zip":"94102"}]', '[{"county":"sanFrancisco","zip":"94103"}]' ]} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <PointAs pointas={pointas} />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedZipCounty, pointasFetched } = state
  const {
    isFetching,
    lastUpdated,
    items: pointas
  } = pointasFetched[selectedZipCounty] || {
    isFetching: true,
    items: []
  }

  return {
    selectedZipCounty,
    pointas,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
