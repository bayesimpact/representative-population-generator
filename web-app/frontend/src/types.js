import PropTypes from 'prop-types'

const types = {
  countyShape: PropTypes.shape({
    zips: PropTypes.arrayOf(PropTypes.string),
  }),
  missingAreasShape: PropTypes.shape({
    countyName: PropTypes.string,
    zipCode: PropTypes.string,
  }),
  pointShape: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
      type: PropTypes.string.isRequired,
    }),
    properties: PropTypes.shape({
      census_block_group: PropTypes.string.isRequired,
      census_tract: PropTypes.string.isRequired,
      county: PropTypes.string.isRequired,
      population: PropTypes.number,
      zip: PropTypes.string.isRequired,
    }),
  })
}

export default types
