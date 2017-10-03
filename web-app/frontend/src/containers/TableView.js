import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import {CSVLink} from 'react-csv'

import LoadingOverlay from '../components/LoadingOverlay'
import styles from '../styles'
import {getAllPoints} from './tableViewSelectorHelpers'


const MAX_DISPLAY_POINTS = 500


class TableView extends Component {

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    points: PropTypes.arrayOf(PropTypes.shape({
      zipCode: PropTypes.string.isRequired,
      county: PropTypes.string.isRequired,
      longitude: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      population: PropTypes.number.isRequired,
      censusTract: PropTypes.number.isRequired,
      censusBlockGroup: PropTypes.number.isRequired,
    })).isRequired,
    style: PropTypes.object,
  };

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
              <TableHeaderColumn>ZIP Code</TableHeaderColumn>
              <TableHeaderColumn>County</TableHeaderColumn>
              <TableHeaderColumn>No. Residents</TableHeaderColumn>
              <TableHeaderColumn>Latitude</TableHeaderColumn>
              <TableHeaderColumn>Longitude</TableHeaderColumn>
              <TableHeaderColumn>Tract</TableHeaderColumn>
              <TableHeaderColumn>Block Group</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} style={{overflowY: 'scroll', flex: 1}}>
            {points.slice(0, MAX_DISPLAY_POINTS).map((point, i) => (
              <TableRow key={i}>
                <TableRowColumn>{i}</TableRowColumn>
                <TableRowColumn>{point.zipCode}</TableRowColumn>
                <TableRowColumn>{point.county}</TableRowColumn>
                <TableRowColumn>{point.population}</TableRowColumn>
                <TableRowColumn>{point.latitude}</TableRowColumn>
                <TableRowColumn>{point.longitude}</TableRowColumn>
                <TableRowColumn>{point.censusTract}</TableRowColumn>
                <TableRowColumn>{point.censusBlockGroup}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}


const mapStateToProps = ({data: {areas}, app: {nPoints}, isLoading}) => {
  return {
    isLoading: isLoading.counties || isLoading.areas,
    points: getAllPoints(areas, nPoints),
  }
}


export default connect(mapStateToProps)(TableView)
