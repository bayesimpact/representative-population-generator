import PropTypes from 'prop-types'

const types = {
  countyShape: PropTypes.shape({
    zips: PropTypes.arrayOf(PropTypes.string),
  }),
}

export default types
