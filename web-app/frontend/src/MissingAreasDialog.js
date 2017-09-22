import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


class MissingAreasDialog extends Component {

  render() {
    const {isOpen, onCloseClick, missingAreas} = this.props
    const actions = [
      <FlatButton label="Close" primary={true} onClick={onCloseClick} />,
    ];
    return (
      <Dialog
          title="Missing Service Areas"
          open={isOpen}
          autoScrollBodyContent={true}
          onRequestClose={onCloseClick}
          actions={actions}>
        <p>
          The following service areas could not be found in our database.
        </p>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>County</TableHeaderColumn>
              <TableHeaderColumn>ZipCode</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {missingAreas.map((areaInfo, i) => (
              <TableRow key={i}>
                <TableRowColumn>{areaInfo.county}</TableRowColumn>
                <TableRowColumn>{areaInfo.zip}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Dialog>
    )
  }
}

export default MissingAreasDialog
