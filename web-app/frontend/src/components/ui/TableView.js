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
import CsvDownloadButton from './CsvDownloadButton.js';
import RepresentativePointsTableRow from './RepresentativePointsTableRow.js';

const styles = {
  headline: {
    fontSize: 20,
    paddingTop: 16,
    paddingLeft: 16,
    marginBottom: 5,
    fontStyle: 'medium',
    textAlign:'left',
  },
};
export default class TableView extends React.Component {

  render(){

    return (
      <div>
        <h2 className='TableTitle' style={styles.headline}>ENROLLEES: REPRESENTATIVE POINTS</h2>
        <CsvDownloadButton/>
        <Table>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
              <TableRow>
                <TableHeaderColumn>Number</TableHeaderColumn>
                <TableHeaderColumn>Zip Code</TableHeaderColumn>
                <TableHeaderColumn>County</TableHeaderColumn>
                <TableHeaderColumn>Latitude</TableHeaderColumn>
                <TableHeaderColumn>Longitude</TableHeaderColumn>
                <TableHeaderColumn>No. Residents</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.points.map((point, i) =>
                <RepresentativePointsTableRow number={i} point={point}/>
                )
              }
            }
            </TableBody>
          </Table>
        </div>
        );
  }
}
