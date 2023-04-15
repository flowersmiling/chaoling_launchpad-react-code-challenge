/* eslint-disable react/jsx-no-undef */
import React, {useState, useMemo} from "react";
import Typography from '@mui/material/Typography';
import { AgGridReact } from 'ag-grid-react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Universities = () => {
  let country = 'Canada'
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [countryList, setCountryList] = useState([''])
  const [rowData, setRowData] = useState(null)
  const Columns = [
    { field: 'name', headerName: 'name' },
    { field: 'web_pages', headerName: 'web_pages' },
    { field: 'state-province', headerName: 'state-province' },
    { field: 'country', headerName: 'country' },
    { field: 'alpha_two_code', headerName: 'alpha_two_code' },
    { field: 'domains', headerName: 'domains'}
  ]

  const [columnDefs] = useState(Columns)
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 60,
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      suppressKeyboardEvent: (params) => params.editing
    }),
    []
  )

  const loadData = (params) => {
    fetch(`http://universities.hipolabs.com/search?country=${params}`)
      .then((result) => result.json())
      .then((result) => setRowData(result))
  }

  const loadCountry = () => {
    fetch('https://countriesnow.space/api/v0.1/countries/info?returns=none')
      .then((result) => result.json())
      .then((result) => {
        const arr = []
        result.data.map((item) => arr.push(item.name))
        setCountryList(arr)
      })
  }

  const onGridReady = (params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    loadCountry()
    loadData(country)
    params.api.sizeColumnsToFit()
  }

  const handleChange = (event) => {
    country = event.target.value
    loadData(country)
  };

    return (
      <div className="my-app">
      <Typography variant="h3" gutterBottom sx={{ m: 2 }}>
        University Information
      </Typography>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
      <InputLabel id="select-label">Country</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        label="Country"
        onChange={handleChange}
      >
        {
          countryList.map((item) => {
            return(
              <MenuItem value={item}>
                 {item}
              </MenuItem>
            )
          })
        }
      </Select>
      </FormControl>
      <div
        id="myGrid"
        style={{ height: 800, width: '100%' }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          onGridReady={onGridReady}
        />
      </div>
    </div>
    );
  };
    
export default Universities;