import { useState } from 'react';

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

const initialCustomerState = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  streetaddress: '',
  postcode: '',
  city: ''
}

function Addcustomer({ addCustomer }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState(initialCustomerState);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const inputChanged = (event) => {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  }

  const handleSave = () => {
    for (const key of Object.keys(customer)) {
      if (customer[key] === '') {
        setError(`${key} is mandatory`);
        return null;
      }
    }

    addCustomer(customer);
    setCustomer(initialCustomerState);
    setOpen(false);
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} style={{ marginBottom: 20 }}>
        <AddIcon color="white" />
        Add Customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new customer</DialogTitle>
        <DialogContent>
          {Object.keys(initialCustomerState).map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              value={customer[field]}
              onChange={inputChanged}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              variant="outlined"
              fullWidth
              
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained"  >Cancel</Button>
          <Button onClick={handleSave}  variant="contained" >Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={error !== ''}
        autoHideDuration={3000}
        onClose={() => setError('')}
        message={error}
      />
    </div>
  );
}

export default Addcustomer;