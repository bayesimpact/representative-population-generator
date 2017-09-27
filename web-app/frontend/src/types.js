import PropTypes from 'prop-types'

const types = {
  countyShape: PropTypes.shape({
    zips: PropTypes.arrayOf(PropTypes.string),
  }),
  missingAreasShape: PropTypes.shape({
    countyName: PropTypes.string,
    zipCode: PropTypes.string,
  }),
}

export default types
