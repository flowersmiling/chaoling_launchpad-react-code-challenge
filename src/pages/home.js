import React, {useState, useMemo} from "react";
import Typography from '@mui/material/Typography';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Home = () => {
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [rowData, setRowData] = useState(null)
  const Columns = [
    { field: 'userId', headerName: 'userId', width: 30 },
    { field: 'id', headerName: 'id', width: 30 },
    { field: 'title', headerName: 'title' },
    { field: 'body', headerName: 'body' }
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

  const loadData = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((result) => result.json())
      .then((result) => setRowData(result))
  }

  const onGridReady = (params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    loadData()
    params.api.sizeColumnsToFit()
  }

    return (
      <div className="my-app">
      <Typography variant="h3" gutterBottom sx={{ m: 2 }}>
        Information Management
      </Typography>
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
    
export default Home;