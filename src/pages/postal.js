import React, {useState, useMemo, useCallback} from "react";
import Typography from '@mui/material/Typography';
import { AgGridReact } from 'ag-grid-react';
    
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Postal = () => {
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [postcode, setPostcode] = useState(10000)
  const [rowData, setRowData] = useState(null)
  const [rowData1, setRowData1] = useState(null)
  const Columns = [
    { field: 'post code', headerName: 'post code' },
    { field: 'country', headerName: 'country' },
    { field: 'country abbreviation', headerName: 'country abbreviation' }
  ]
  const Columns1 = [
    { field: 'place name', headerName: 'place name'},
    { field: 'longitude', headerName: 'longitude'},
    { field: 'state', headerName: 'state'},
    { field: 'state abbreviation', headerName: 'state abbreviation'},
    { field: 'latitude', headerName: 'latitude'}
  ]

  const [columnDefs] = useState(Columns)
  const [columnDefs1] = useState(Columns1)
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 60,
    }),
    []
  )

  const loadData = (params) => {
    fetch(`https://api.zippopotam.us/us/${params}`)
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

          const newItems = result.places
          setRowData1(newItems)
        }
      })
  }

  const onGridReady = (params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    loadData(postcode)
    params.api.sizeColumnsToFit()
  }

  const handleInputChange = (e) => {
    setPostcode(e.target.value)
  }

  const handleClick = () => {
    loadData(postcode)
  }

    return (
      <div className="my-app">
      <Typography variant="h3" gutterBottom sx={{ m: 2 }}>
        Postal Information
      </Typography>
      <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Postal"
        inputProps={{ 'aria-label': 'Search Postal' }}
        value={postcode}
        onChange={handleInputChange}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
      <div
        id="myGrid"
        style={{ height: 140, width: '100%' }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          onGridReady={onGridReady}
        />
        <AgGridReact
          columnDefs={columnDefs1}
          defaultColDef={defaultColDef}
          rowData={rowData1}
          onGridReady={onGridReady}
        />
      </div>
    </div>
    );
  };
    
export default Postal;