import { Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useComponentWillMount } from '../lib/utils'

const ActionsRenderer = (props) => {
  let [editing, setEditing] = useState(false);
  let [disabled, setDisabled] = useState(false);

  useComponentWillMount(() => {
    let editingCells = props.api.getEditingCells()
    if (editingCells.length !== 0) {
      setDisabled(true)
    }
  })

  // TODO: check the result,  removed dependency
  useEffect(() => {
    props.api.addEventListener('rowEditingStarted', onRowEditingStarted)
    props.api.addEventListener('rowEditingStopped', onRowEditingStopped)

    return () => {
      props.api.removeEventListener('rowEditingStarted', onRowEditingStarted)
      props.api.removeEventListener('rowEditingStopped', onRowEditingStopped)
    }
  })

  function onRowEditingStarted(params) {
    if (props.node === params.node) {
      setEditing(true)
    } else {
      setDisabled(true)
    }
  }

  function onRowEditingStopped(params) {
    if (props.node === params.node) {
      if (isEmptyRow(params.data)) {
        deleteRow(true)
      } else {
        setEditing(false)
      }
    } else {
      setDisabled(false)
    }
  }

  function startEditing() {
    props.api.startEditingCell({
      rowIndex: props.rowIndex,
      colKey: props.column.colId
    })
  }

  function stopEditing(bool) {
    props.api.stopEditing(bool)
  }

  function deleteRow(force = false) {
    const { data, context } = props // Parent/Child Communication using context
    let confirm = true

    if (!force) {
      confirm = true
    }
    if (confirm) {
      props.api.applyTransaction({ remove: [data] })
      props.api.refreshCells({ force: true })
      context.methodFromParent(data.id) // pass the data to the parent component
    }
  }

  function isEmptyRow(data) {
    const dataCopy = { ...data }
    delete dataCopy.id
    return !Object.values(dataCopy).some((value) => value)
  }

  return (
    <div>
      {editing ? (
        <>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => stopEditing(false)}
            disabled={disabled}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => stopEditing(true)}
            disabled={disabled}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => startEditing()}
            disabled={disabled}
          >
            Edit
          </Button>
          <Button
            type="button"
            color="secondary"
            variant="outlined"
            onClick={() => deleteRow()}
            disabled={disabled}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  )
}

export default ActionsRenderer
