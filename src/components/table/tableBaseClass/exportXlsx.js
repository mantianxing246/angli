export class xlsxForTable {
  constructor(data, list) {
    this.out = []
    this.ranges = []
    this.data = data
    this.list = list
    this.init()
    this.pushHead()
  }
  init() {
    this.list.forEach(obj => {
      var arr = []
      for (const j in this.data) {
        arr.push(obj[this.data[j].prop])
      }
      this.out.push(arr)
    })
  }
  pushHead() {
    var arr = []
    for (const j in this.data) {
      arr.push(this.data[j]['label'])
    }
    this.out.unshift(arr)
  }
  getOutAndranges() {
    return { out: this.out, ranges: this.ranges }
  }
  generateHeader(table) {
    var out = []
    var theTable = document.getElementById(table)
    var rows = theTable.querySelectorAll('tr')
    for (var R = 0; R < rows.length; ++R) {
      var outRow = []
      var row = rows[R]
      var columns = row.querySelectorAll('td,th')
      for (var C = 0; C < columns.length; ++C) {
        var cell = columns[C]
        var colspan = cell.getAttribute('colspan')
        var cellValue = cell.innerText
        if (cellValue !== '' && cellValue === +cellValue) cellValue = +cellValue
        outRow.push(cellValue !== '' ? cellValue : null)
        if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null)
      }
      out.push(outRow)
    }
    const arr = []
    for (var i = 0; i < out[0].length; i++) {
      arr.push(
        {
          label: out[0][i],
          align: 'center',
          prop: '',
          width: ''
        },
      )
    }
    console.log(JSON.stringify(arr))
    return [out]
  }
}
