import './App.css';
import React, {useEffect, useState} from 'react';
import { Box, MenuItem, Button, FormControl, Select, InputLabel, Grid, Paper } from '@mui/material';

function App() {
  const [fightersList, setFightersList] = useState([]);
  const [fighter1, setFighter1 ] = useState('');
  const [fighter2, setFighter2 ] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [calculated, setCalculated] = useState(false);

  const handleChange1 = (event) => {
    setFighter1(event.target.value);
  };
  const handleChange2 = (event) => {
    setFighter2(event.target.value);
  };

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors'
    };

    fetch("http://127.0.0.1:5000/get/ranked_fighter_names", options)
    .then(res => res.json())
    .then(
      (data) => {
        setLoaded(true);
        setFightersList(data);
      },
      (error) => {
        setLoaded(true);
        setError(error);
      }
    )
  }, [])

  const calculateOdds = () => {
    const body = {
      "fighter1" : fighter1, 
      "fighter2" : fighter2
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors',
        body: JSON.parse(body),
    };

    fetch("http://127.0.0.1:5000/post/calculate_odds", options)
    .then(res => res.json())
    .then(
      (data) => {
        setCalculated(true);
        // Set odds 
        console.log(fightersList)
      },
      (error) => {
        setCalculated(true);
        setError(error);
      }
    )
  }

  if (error){
    return <div> Error: {error.message}</div>
  } else if (!loaded){
    return <div> loading ... </div>
  } else {
    return (
      <div className="App">
        <Paper>
        <Box sx={{ flexGrow: 1, padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Figher 1</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={fighter1}
                  label="Fighter 2"
                  onChange={handleChange1}
                  MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null,
                  maxHeight: "50px"
                  //MenuProps.PaperProps.style.maxHeight: "0",
            }}
                >
                  {fightersList.map((fighter, i) => {
                    return(
                      <MenuItem
                        value={fighter}
                        key={i}
                        >
                        {fighter} 
                      </MenuItem>
                    )
                    })
                  }
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Button 
              variant="contained"
              disabled={!fighter1 || !fighter2}
              onClick={calculateOdds}
            >
              See odds
            </Button> 
            
            {
              calculated ? 
              <div className='odds'> 
                Winning change : 

              </div> 
              
              : ''
            }
          </Grid>
          
          <Grid item xs={4}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Figher 2</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={fighter2}
                  label="Figher 2"
                  onChange={handleChange2}
                >
                  {fightersList.map((fighter, i) => {
                    return(
                      <MenuItem
                        value={fighter}
                        key={i}
                        >
                        {fighter} 
                      </MenuItem>
                    )
                    })
                  }
                </Select>
              </FormControl>
            </Box>
          </Grid>

        </Grid>
        </Box>
        </Paper>
      </div>
    );
  }
}

export default App;
