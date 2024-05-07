import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart, CartesianGrid } from 'recharts';
import { groupBy, sumBy } from 'lodash';
import { CircularProgress, Container } from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL;

function Statistics() {
  const [loading, setLoading] = useState(true);
  const [trainings, setTrainings] = useState([]);

  const fetchTrainings = async () => {
    try {
      const response = await fetch("https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings");
      const trainingsData = await response.json();

      const grouppedObject = groupBy(trainingsData, 'activity');
      const newData = Object.keys(grouppedObject).map(item => ({
        name: item,
        value: sumBy(grouppedObject[item], 'duration'),
      }));

      setTrainings(newData);
      console.log(trainings)
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

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
    // <ResponsiveContainer width='90%' height='90%'>
    //   <BarChart
    //     width={100}
    //     height={50}
    //     data={trainings}
    //     margin={{
    //       top: 5,
    //       right: 30,
    //       left: 20,
    //       bottom: 5,
    //     }}
    //   >
    //     <XAxis dataKey="name" />
    //     <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft', offset: -10 }} />
    //     <Tooltip />
    //     <Bar dataKey="value" fill="#5574d0" />
    //   </BarChart>
    // </ResponsiveContainer>
    <div className="Body">
    <div className="row">
        <div className="column">
            <BarChart
                width={600}
                height={400}
                data= {trainings}
                margin={{top: 5, right: 30,left: 20, bottom: 5}} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="lightgreen" />
            </BarChart>
        </div>
        <div className="column">
            <LineChart
                width={600}
                height={400}
                data={trainings}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }} >
                <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="value" stroke="red" yAxisId={2} />
            </LineChart>
        </div>
    </div>
</div>
  );
}

export default Statistics;