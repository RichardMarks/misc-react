import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'

import Table from './components/table.jsx'

import './index.css'

class TableDemo extends React.Component {
  constructor (props) {
    super(props)

    this.sortBy = this.sortBy.bind(this)

    this.changeColumnOrder = this.changeColumnOrder.bind(this)
    this.changeColumnVisibility = this.changeColumnVisibility.bind(this)
    // this.changeColumnSetting = this.changeColumnSetting.bind(this)

    this.showSettings = this.showSettings.bind(this)
    this.hideSettings = this.hideSettings.bind(this)
    this.saveSettings = this.saveSettings.bind(this)
    this.renderSettings = this.renderSettings.bind(this)

    this.state = {
      isEditMode: false,
      settings: [],

      columns: [
        {
          label: 'Date',
          visible: true,
          order: 0,
          dataKey: 'date',
          _id: 'NyumZXMOU',
          sort: ''
        },
        {
          label: 'Time',
          visible: true,
          order: 1,
          dataKey: 'time',
          _id: 'EkdECXzOI',
          sort: ''
        },
        {
          label: 'AT',
          visible: true,
          order: 2,
          dataKey: 'at',
          _id: '4yOHWXGO8',
          sort: '',
          columnRenderer: ({ cell, column, value }) => (
            <h2>{value}</h2>
          )
        },
        {
          label: 'Load',
          visible: true,
          order: 3,
          dataKey: 'load',
          _id: 'Vy8rbQMd8',
          sort: ''
        },
        {
          label: 'LPM',
          visible: true,
          order: 4,
          dataKey: 'lpm',
          _id: 'EyASzXGu8',
          sort: ''
        }
      ],
      rows: [
        {
          date: '2/1/2019',
          time: 120,
          at: '60 (50%)',
          load: 300,
          lpm: 5
        },
        {
          date: '2/2/2019',
          time: 55,
          at: '45 (90%)',
          load: 190,
          lpm: 2.5
        },
        {
          date: '2/3/2019',
          time: 180,
          at: '90 (90%)',
          load: 450,
          lpm: 8,
          color: 'green'
        }
      ]
    }
  }

  componentDidMount () {
    this.showSettings()
  }

  sortBy ({ column }) {
    const columns = [...this.state.columns]
    const rows = [...this.state.rows]

    const columnIndex = columns.findIndex(c => c._id === column._id)

    const nextSort = sort => {
      if (sort === 'asc') {
        return 'desc'
      } else if (sort === 'desc') {
        return ''
      } else {
        return 'asc'
      }
    }

    columns.forEach((c, index) => {
      if (index === columnIndex) {
        c.sort = nextSort(c.sort)
      } else {
        c.sort = ''
      }
    })

    const ascSort = (a, b) => {
      const ad = a[column.dataKey]
      const bd = b[column.dataKey]

      if (ad >= bd) {
        return 1
      }
      return -1
    }

    const descSort = (a, b) => {
      const ad = a[column.dataKey]
      const bd = b[column.dataKey]

      if (ad <= bd) {
        return 1
      }
      return -1
    }

    const sort = columns[columnIndex].sort
    if (sort !== '') {
      rows.sort(sort === 'asc' ? ascSort : descSort)
    }

    this.setState({ rows, columns })
  }

  changeColumnOrder ({ column, order }) {
    const settings = [...this.state.settings]

    let src = 0
    let dst = 0

    const index = settings.findIndex(c => c._id === column._id)

    src = index
    dst = index + order
    dst = dst < 0 ? 0 : dst
    dst = dst >= settings.length ? settings.length - 1 : dst

    ;[settings[src], settings[dst]] = [settings[dst], settings[src]]

    settings.forEach((c, i) => { c.order = i })

    this.setState({ settings })
  }

  changeColumnVisibility ({ column, visible }) {
    const settings = [...this.state.settings]
    const setting = settings.find(c => c._id === column._id)

    if (setting) {
      if (visible !== undefined) {
        setting.visible = !!visible
      }
      this.setState({ settings })
    }
  }

  showSettings () {
    const settings = this.state.columns.map((column) => ({
      ...column
    }))
    this.setState({ settings, isEditMode: true })
  }

  hideSettings () {
    this.setState({ isEditMode: false })
  }

  saveSettings () {
    const columns = [...this.state.columns]
    this.state.settings.forEach((setting) => {
      const column = columns.find(c => c._id === setting._id)
      if (column) {
        column.order = setting.order
        column.visible = setting.visible
      }
    })
    this.setState({ columns, isEditMode: false })
  }

  renderSettings () {
    const settings = [...this.state.settings]
      .sort((a, b) => a.order - b.order)

    return (
      <div className='table-settings-container'>
        <h1 className='table-setting-header'>
          Settings
        </h1>
        <ul className='table-settings-list'>
          <li
            key='-1'
            className='table-settings-list-item__header'>
            <div>Name</div>
            <div>Visibility</div>
            <div>Order</div>
          </li>
          {
            settings.map((column, index) => (
              <li
                key={index}
                className='table-settings-list-item'>
                <span>{column.label}</span>
                <div>
                  <input
                    type='checkbox'
                    checked={!!column.visible}
                    onChange={(e) => {
                      this.changeColumnVisibility({ column, visible: e.target.checked })
                    }}
                  />
                </div>
                <div className='table-settings-order-column'>
                  {column.order + 1}
                  {
                    column.order > 0
                      ? (
                        <button onClick={
                          () => this.changeColumnOrder({ column, order: -1 })
                        }>
                          Up
                        </button>
                      )
                      : null
                  }
                  {
                    column.order < settings.length - 1
                      ? (
                        <button onClick={
                          () => this.changeColumnOrder({ column, order: 1 })
                        }>
                          Down
                        </button>
                      )
                      : null
                  }
                </div>
              </li>
            ))
          }
        </ul>
        <div className='table-settings-button-row'>
          <button onClick={this.saveSettings}>
            Save Changes
          </button>
          <button onClick={this.hideSettings}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='table-demo-container'>
        <Table
          columns={this.state.columns}
          rows={this.state.rows}
          sortBy={this.sortBy}
        />
        {
          this.state.isEditMode
            ? this.renderSettings()
            : (
              <button onClick={this.showSettings}>
                Settings
              </button>
            )
        }
        <pre style={{
          marginTop: 20,
          color: 'white',
          backgroundColor: 'navy',
          padding: 20,
          fontSize: 18,
          maxHeight: 500,
          overflowY: 'scroll'
        }}>{JSON.stringify({...this.state}, null, 2)}</pre>
      </div>
    )
  }
}

const App = () => (
  <div className='app-container'>
    <TableDemo />
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
