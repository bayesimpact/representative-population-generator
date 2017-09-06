import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CsvDownloadButton from './CsvDownloadButton.js'

export default class RepresentativePointsTableRow extends React.Component {

    render(){
        return (
              <TableRow>
                <TableRowColumn>{this.props.number}</TableRowColumn>
                <TableRowColumn>{this.props.point.properties.zip}</TableRowColumn>
                <TableRowColumn>{this.props.point.properties.county}</TableRowColumn>
                <TableRowColumn>{this.props.point.geometry.coordinates[1]}</TableRowColumn>
                <TableRowColumn>{this.props.point.geometry.coordinates[0]}</TableRowColumn>
                <TableRowColumn>{this.props.point.properties.residents}</TableRowColumn>
              </TableRow>
        );
    }
}
