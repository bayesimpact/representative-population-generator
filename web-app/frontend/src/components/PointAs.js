import React from 'react'
import PropTypes from 'prop-types'

const PointAs = ({pointas}) => (
  <table><tbody>
    {pointas.map((pointa, i) =>
    <tr key={i}>
      <td>{pointa.geometry.coordinates}</td>
      <td>{pointa.properties.county}</td>
      <td>{pointa.properties.zip}</td>
      <td>{pointa.properties.residents}</td>
    </tr>
    )}
  </tbody></table>
)

PointAs.propTypes = {
  pointas: PropTypes.array.isRequired
}

export default PointAs
