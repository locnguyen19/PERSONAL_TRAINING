import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import { format } from 'date-fns';

import { Snackbar, IconButton, Tooltip } from '@mui/material';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';


const apiUrl = process.env.REACT_APP_API_URL;

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [trainingDeleted, setTrainingDeleted] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetchTrainings();
  }, []);



  // const nameValueGetter = (params) => {
  //   if (params.data.customer=== null) {
  //     return "null";
  //   } else {
  //     return params.data.customer.firstname + ' ' + params.data.customer.lastname;
  //   }
  // }



  // const dateValueGetter = (params) => {
  //   return format(new Date(params.data.date), "dd.MM.yyyy' 'hh:mm' 'aaa");
  // }


  const linkGetter = (params) => {
    return `${apiUrl}/api/trainings/${params.data.id}`;
  }


  //GET ALL TRAININGS
  const fetchTrainings = async () => {

    try {
      fetch("https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings")
        .then(response => response.json())
        .then(data => {
          setTrainings(data);
          console.log(data)

        })
        .catch(err => console.error(err))
    } catch (error) {
      console.error(error);
    }
  }
  console.log("trainings", trainings);




  //DELETE A TRAINING
  const deleteTraining = (link) => {
    //console.log(id)
    if (window.confirm("Are you sure?")) {
      fetch(link, {
        method: "DELETE"
      })
        .then((_) => fetchTrainings())
        .then((_) => {
          setMsg("Training deleted");
          setTrainingDeleted(true);
        })
        .catch((err) => {
          console.error(err);
          alert('Something went wrong in deletion');
        }

        );
    };
  };

  const columns = [
    { field: 'activity', sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 125 },
    {
      headerName: 'Date',
      valueGetter: function date(params) {
        return format(new Date(params.data.date), "dd.MM.yyyy' 'hh:mm' 'aaa")
      }
      , sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 175
    },
    { headerName: 'Duration (min)', field: 'duration', sortable: true, filter: true, width: 150, cellStyle: { 'textAlign': 'left' } },
    {
      headerName: 'Customer',
      valueGetter: function customer(params) {
        return params.data.customer.firstname + " " + params.data.customer.lastname
      }
      , sortable: true, filter: true, cellStyle: { 'textAlign': 'left' }, width: 155
    },

    // {
    //   headerName: '',
    //   valueGetter :linkGetter,
    //   width: 100,
    //   cellRenderer: params =>
    //     <IconButton onClick={() => deleteTraining(params.value)}>
    //       <DeleteOutlinedIcon style={{ color: 'black' }} />
    //     </IconButton>
    // }
    {
      width: 80,
      headerName: "",
      valueGetter :linkGetter,
      cellRendererFramework: params => <Tooltip title="Delete training">
        <IconButton variant="text"
          color="primary"
          size="small"
          aria-label="delete"
          onClick={() => deleteTraining(params.value)} >
          <DeleteOutlinedIcon />
        </IconButton>
      </Tooltip>
    },
  ];

  return (
    <>
      <div className="ag-theme-material" style={{ height: 409, width: 770, margin: 'auto' }}>
        <AgGridReact
          columnDefs={columns}
          rowData={trainings}
          pagination={true}
          paginationPageSize={5}
          suppressCellFocus={true}
          animateRows="true"
        />
      </div>
      <Snackbar
        open={trainingDeleted}
        autoHideDuration={4000}
        onClose={() => setTrainingDeleted(false)}
        message='Training was deleted successfully'
      />
    </>
  );
}

export default TrainingList;
