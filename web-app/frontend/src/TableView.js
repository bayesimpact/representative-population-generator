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

class TableView extends Component {

  render() {
    const {isLoading, points, style} = this.props
    if (isLoading) {
      return <div>loading</div>
    }
    return (
      <div style={style}>
        <h2>Representative Points of Enrollees</h2>
        <Table selectable={false}>
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
          <TableBody displayRowCheckbox={false}>
            {points.map((point, i) => (
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
    area.points.forEach(point => {
      points.push({
        zipCode: point.properties.zip,
        county: point.properties.county,
        longitude: point.geometry.coordinates[0],
        latitude: point.geometry.coordinates[1],
        nResidents: point.properties.residents,
      })
    })
  })
  return {
    isLoading: state.isLoading.counties || state.isLoading.areas,
    points,
  }
}

export default connect(mapStateToProps)(TableView)
