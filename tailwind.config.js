module.exports = {
  purge: ['./src/**/*.vue'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      spacing: {
        72: '18rem',
        80: '20rem',
        88: '22rem',
        96: '24rem',
      },
      minHeight: theme => ({
        ...theme('spacing'),
      }),
      cursor: {
        help: 'help',
      },
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
