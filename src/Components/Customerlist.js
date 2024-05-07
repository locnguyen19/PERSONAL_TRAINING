import React, { useCallback, useState, useEffect, useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AddIcon from '@mui/icons-material/Add';
import { AgGridReact } from 'ag-grid-react';

import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';
import Addtraining from './Addtraining';

import DeleteIcon from '@mui/icons-material/Delete';

import { CircularProgress, Container, IconButton, Snackbar, Button, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const apiUrl = process.env.REACT_APP_API_URL;

function CustomerList() {
  const gridRef = useRef();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerDeleted, setCustomerDeleted] = useState(false);
  const [customerAdded, setCustomerAdded] = useState(false);
  const [customerEdited, setCusomerEdited] = useState(false);
  const [trainingAdded, setTrainingAdded] = useState(false);


  useEffect(() => {
    fetchCustomers();
  }, []);


  //LIST ALL CUSTOMERS
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      fetch(`${apiUrl}api/customers`)
        .then(response => response.json())
        .then(data => {
          setCustomers(data._embedded.customers);
          console.log(customers)
          setLoading(false);
        })
        .catch(err => console.error(err))
    } catch (error) {
      console.error(error);
    }
  }
  console.log("customers", customers);


  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const linkGetter = (params) => {
    return params.data._links.customer.href;

  }



  //ADD A CUSTOMRER TO THE LIST
  const addCustomer = async (newCustomer) => {
    try {
      const response = await fetch(`${apiUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        await fetchCustomers();
        setCustomerAdded(true);
        alert('A new customer add succesfully!')
        console.log(customers)
      } else {
        alert('Something wrong!');
      }
    } catch (error) {
      alert('Something wrong!');
    }
  }


  //DELETE A CUSTOMER FROM THE DATA
  const deleteCustomer = (link) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      fetch(link, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) {
            alert('Something went wrong in deletion');
          }
          else {
            fetchCustomers();
            setCustomerDeleted(true);
          }
        })
        .catch(err => console.error(err))
    }
  };


  //UPDATE THE INFO OF CURRENT CUSTOMER
  const updateCustomer = async (updatedCustomer, link) => {
    try {
      const response = await fetch(link, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer),
      });

      if (response.ok) {
        await fetchCustomers();
        setCusomerEdited(true);
      } else {
        alert('Something wrong');
      }
    } catch (error) {
      alert('Something wrong');
    }
  }


  //ADD A NEW TRAINING
  const addTraining = async (newTraining) => {
    try {
      const response = await fetch(`${apiUrl}api/trainings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTraining),
      });

      if (response.ok) {
        setTrainingAdded(true);
      } else {
        alert('Something wrong!');
      }
    } catch (error) {
      alert('Something wrong!');
    }
  }

  const columns = [
    { headerName: 'First name', field: 'firstname', sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 130 },
    { headerName: 'Last name', field: 'lastname', sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 130 },
    { field: 'email', sortable: true, filter: true, width: 250, cellStyle: { 'textAlign': 'left' } },
    { field: 'phone', sortable: true, filter: true, width: 160, cellStyle: { 'textAlign': 'left' } },
    { headerName: 'Address', field: 'streetaddress', sortable: true, filter: true, width: 180, cellStyle: { 'textAlign': 'left' } },
    { field: 'postcode', sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 120 },
    { field: 'city', sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 150 },
    {
      headerName: '',
      width: 150,
      field: '_links.trainings.href',
      cellRenderer: trainingParams => <Addtraining trainingParams={trainingParams} addTraining={addTraining} />
    },
    {
      headerName: '',
      width: 100,
      field: '_links.customer.href',
      cellRenderer: params => <Editcustomer params={params} updateCustomer={updateCustomer} />
    },
    {
      headerName: '',
      valueGetter: linkGetter,
      width: 100,
      cellRenderer: params =>
        <IconButton onClick={() => deleteCustomer(params.value)}>
          <DeleteIcon style={{ color: 'red' }} />
        </IconButton>
    }
  ];

  if (loading) {
    return (
      <Container
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Stack spacing={2} direction="row">
        <Addcustomer addCustomer={addCustomer} />
        <Button variant="text" onClick={onBtnExport} style={{ marginBottom: 20 }}>Export</Button>
      </Stack>
      <div className="ag-theme-material" style={{ height: 500, width: '100%', margin: 'auto' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columns}
          rowData={customers}
          pagination={true}
          paginationPageSize={5}
          suppressCellFocus={true}
          animateRows="true"
        />
      </div>
      <Snackbar
        open={customerDeleted}
        autoHideDuration={3000}
        onClose={() => setCustomerDeleted(false)}
        message='Customer was deleted successfully'
      />
      <Snackbar
        open={customerAdded}
        autoHideDuration={3000}
        onClose={() => setCustomerAdded(false)}
      >
        <Alert
          onClose={() => setCustomerAdded(false)}
          severity="success" sx={{ width: '100%' }}
        >
          New customer was added successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={customerEdited}
        autoHideDuration={3000}
        onClose={() => setCusomerEdited(false)}
      >
        <Alert
          onClose={() => setCusomerEdited(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Customer info was updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={trainingAdded}
        autoHideDuration={3000}
        onClose={() => setTrainingAdded(false)}
      >
        <Alert
          onClose={() => setTrainingAdded(false)}
          severity="success" sx={{ width: '100%' }}
        >
          New training was added successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default CustomerList;