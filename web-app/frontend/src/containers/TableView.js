import React, {Component} from 'react'
import {connect} from 'react-redux'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import {CSVLink} from 'react-csv'

import LoadingOverlay from '../components/LoadingOverlay'
import styles from '../styles'

const MAX_DISPLAY_POINTS = 500

class TableView extends Component {

  render() {
    const {isLoading, points, style} = this.props
    const tableViewStyle = {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 20,
      paddingRight: 20,
      position: 'relative',
    }
    const noticeStyle = {
      color: styles.secondaryText,
    }
    return (
      <div style={{...tableViewStyle, ...style}}>
        {isLoading ? <LoadingOverlay /> : null}
        <div style={{display: 'flex', alignItems: 'center', paddingTop: 30}}>
          <div style={{fontSize: 20}}>
            Representative Points of Enrollees&nbsp;
          </div>
          <div style={{flex: '1'}} />
          <CSVLink filename="service_area_points.csv" data={points}>
            <FlatButton style={{color: '#3F51B5'}} label="csv" icon={<FileDownloadIcon />} />
          </CSVLink>
        </div>
        {points.length > MAX_DISPLAY_POINTS ?
          <div style={noticeStyle}>(Displaying first {MAX_DISPLAY_POINTS} records)</div> :
          null}
        <Table selectable={false} wrapperStyle={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn></TableHeaderColumn>
              <TableHeaderColumn>ZipCode</TableHeaderColumn>
              <TableHeaderColumn>County</TableHeaderColumn>
              <TableHeaderColumn>Latitude</TableHeaderColumn>
              <TableHeaderColumn>Longitude</TableHeaderColumn>
              <TableHeaderColumn>No. Residents</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} style={{overflowY: 'scroll', flex: 1}}>
            {points.slice(0, MAX_DISPLAY_POINTS).map((point, i) => (
              <TableRow key={i}>
                <TableRowColumn>{i}</TableRowColumn>
                <TableRowColumn>{point.zipCode}</TableRowColumn>
                <TableRowColumn>{point.county}</TableRowColumn>
                <TableRowColumn>{point.latitude}</TableRowColumn>
                <TableRowColumn>{point.longitude}</TableRowColumn>
                <TableRowColumn>{point.nResidents}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const points = [];
  (state.data.areas || []).forEach(area => {
    area.points.slice(0, state.app.nPoints).forEach(point => {
      points.push({
        zipCode: point.properties.zip,
        county: point.properties.county,
        longitude: point.geometry.coordinates[0],
        latitude: point.geometry.coordinates[1],
        nResidents: Math.round(point.properties.population),
      })
    })
  })
  return {
    isLoading: state.isLoading.counties || state.isLoading.areas,
    points,
  }
}

export default connect(mapStateToProps)(TableView)
