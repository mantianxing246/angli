export default {
  methods: {
    headerStyle(headOrCell) {
      if (headOrCell === 'header') {
        return {
          background: '#cccccc',
          color: '#333333',
          'border-color': '#797979'
        }
      }
      if (headOrCell === 'cell') {
        return {
          'border-color': '#797979'
        }
      }
    }
  }
}
