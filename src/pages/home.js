import React, { useState, useMemo, useCallback, useRef } from "react";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import ActionsRenderer from '../components/ActionsRenderer'
import { any } from "prop-types";

const Home = () => {
  const gridRef = useRef<AgGridReact>(null)
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [rowData, setRowData] = useState(null)
  const [rowid, setRowid] = useState('')
  const [showModal, setShowModal] = useState(false)

  const Columns = [
    { field: 'id', headerName: 'id' },
    { field: 'userId', headerName: 'userId' },
    { field: 'title', headerName: 'title' },
    { field: 'body', headerName: 'body' },
    {
      headerName: '',
      colId: 'actions',
      cellRenderer: 'actionsRenderer',
      editable: false,
      filter: false
    }
  ]

  const [columnDefs] = useState(Columns)
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      suppressKeyboardEvent: (params) => params.editing
    }),
    []
  )

  const Components = {
    actionsRenderer: ActionsRenderer
  }

  const loadData = (params) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${params}`)
      .then((result) => result.json())
      .then((result) => {
        if(result.length > 1){
          setRowData(result)
        }else{
          // avoid the error: rowdata.map is not a function
          // when binding single row on the AG-Grid with setRowData()
          const newArray = new Array()
          newArray.push(result)
          setRowData(newArray)
        }
      })
  }

  const onGridReady = (params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    loadData(rowid)
    params.api.sizeColumnsToFit()
  }

  const handleInputChange = (e) => {
    setRowid(e.target.value)
  }

  const handleClick = () => {
    loadData(rowid)
  }

  const addRow = useCallback(() => {
    const emptyRow = {}

    gridRef.current?.api.applyTransaction({
      add: [emptyRow]
    })
  }, [])

  const onRowValueChanged = useCallback((event) => {
    const { data } = event

    if (data.id === undefined) {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          body: data.body,
          userId: data.userId
        })
      })
        .then((result) => result.json())
        .then((result) => {
          data.id = result.insertedId // avoid inserting repeatedly
          if (result.insertedId) {
            global?.window && window.confirm(`successfully add a new row`)
          } else {
            global?.window &&
              window.confirm(
                `Failed to add a new row, please check all of the columns have been filled out correctly`
              )
          }
        })
    } else {
      fetch(`https://jsonplaceholder.typicode.com/posts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          body: data.body,
          userId: data.userId
        })
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.modifiedCount === 1) {
            global?.window && window.confirm(`successfully update the row`)
          } else {
            global?.window &&
              window.confirm(
                `Failed to update the row, please check all of the entered values are correct`
              )
          }
        })
    }
  }, [])

  const methodFromParent = (cell) => {
    if (cell) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${cell}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((result) => result.text())
        .then((result) => {
          global?.window && window.confirm(`successfully delete the row`)
        })
    }
  }

    return (
      <div className="my-app">
      <Typography variant="h3" gutterBottom sx={{ m: 2 }}>
        Information Management
      </Typography>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 350 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search by id"
          inputProps={{ 'aria-label': 'Search Id' }}
          value={rowid}
          onChange={handleInputChange}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleClick}>
          <SearchIcon />
        </IconButton>
        <Button variant="outlined" onClick={addRow}>Add Row</Button>
      </Paper>
      <div
        id="myGrid"
        style={{ height: 800, width: '100%' }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          components={Components}
          editType="fullRow"
          rowData={rowData}
          onGridReady={onGridReady}
          onRowValueChanged={onRowValueChanged}
          context={{ methodFromParent }} // Parent/Child Communication using context
        />
      </div>
    </div>
    );
  };
    
export default Home;