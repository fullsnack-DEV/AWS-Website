/* eslint-disable no-mixed-operators */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
// @flow
import moment from 'moment'

const CALENDER_HEIGHT = 2400
const offset = CALENDER_HEIGHT / 24

function buildEvent(column, left, width) {
  const startTime = moment(column.start)
  const endTime = column.end ? moment(column.end) : startTime.clone().add(1, 'hour')
  const diffHours = startTime.diff(startTime.clone().startOf('day'), 'hours', true)

  column.top = diffHours * offset
  column.height = endTime.diff(startTime, 'hours', true) * offset
  column.width = width
  column.left = left
  return column
}

function collision(a, b) {
  return a.end > b.start && a.start < b.end
}

function expand(ev, column, columns) {
  let colSpan = 1

  for (let i = column + 1; i < columns.length; i++) {
    const col = columns[i]
    for (let j = 0; j < col.length; j++) {
      const ev1 = col[j]
      if (collision(ev, ev1)) {
        return colSpan
      }
    }
    colSpan++
  }

  return colSpan
}

function pack(columns, width, calculatedEvents) {
  const colLength = columns.length

  for (let i = 0; i < colLength; i++) {
    const col = columns[i]
    for (let j = 0; j < col.length; j++) {
      const colSpan = expand(col[j], i, columns)
      const L = i / colLength * width
      const W = width * colSpan / colLength - 10

      calculatedEvents.push(buildEvent(col[j], L, W))
    }
  }
}

function populateEvents(events, screenWidth) {
  let lastEnd
  let columns
  const calculatedEvents = []

  events = events
    .map((ev, index) => ({ ...ev, index }))
    .sort((a, b) => {
      if (a.start < b.start) return -1
      if (a.start > b.start) return 1
      if (a.end < b.end) return -1
      if (a.end > b.end) return 1
      return 0
    })

  columns = []
  lastEnd = null

  events.forEach((ev) => {
    if (lastEnd !== null && ev.start >= lastEnd) {
      pack(columns, screenWidth, calculatedEvents)
      columns = []
      lastEnd = null
    }

    let placed = false
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i]
      if (!collision(col[col.length - 1], ev)) {
        col.push(ev)
        placed = true
        break
      }
    }

    if (!placed) {
      columns.push([ev])
    }

    if (lastEnd === null || ev.end > lastEnd) {
      lastEnd = ev.end
    }
  })

  if (columns.length > 0) {
    pack(columns, screenWidth, calculatedEvents)
  }
  return calculatedEvents
}

export default populateEvents
