import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Button,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";

function App() {
  const [fightersList, setFightersList] = useState([]);
  const [fighter1, setFighter1] = useState("");
  const [fighter2, setFighter2] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [odds, setOdds] = useState("");

  const handleChange1 = (event) => {
    setFighter1(event.target.value);
  };
  const handleChange2 = (event) => {
    setFighter2(event.target.value);
  };

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    };

    fetch("../get/all_fighters", options)
      .then((res) => res.json())
      .then(
        (data) => {
          setLoaded(true);
          setFightersList(data);
        },
        (error) => {
          setLoaded(true);
          setError(error);
        }
      );
  }, []);

  const calculateOdds = () => {
    const s = "r_fighter=" + fighter1 + "&b_fighter=" + fighter2;
    s.split(" ").join("+");

    fetch("../get/odds/?" + s)
      .then((res) => res.json())
      .then(
        (data) => {
          setLoaded(true);
          setCalculated(true);
          console.log(data);
          data = JSON.stringify(data);
          setOdds(data);
        },
        (error) => {
          setLoaded(true);
          setError(error);
        }
      );
  };
  if (error) {
    return <div> Error: {error.message}</div>;
  } else if (!loaded) {
    return <div> loading ... </div>;
  } else {
    return (
      <div className="App">
        <Paper>
          <Paper>
            <Box sx={{ flexGrow: 1, padding: "20px" }} textAlign="center">
              <Typography variant="h2">UFC Fight Predictor</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, padding: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box>
                    <Box textAlign="center">
                      <Typography variant="subtitle1">Red Corner</Typography>
                    </Box>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Fighter 1
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={fighter1}
                        label="Fighter 2"
                        onChange={handleChange1}
                        MenuProps={{
                          maxheight: "10px",
                        }}
                      >
                        {fightersList.map((fighter, i) => {
                          return (
                            <MenuItem value={fighter} key={i}>
                              {fighter}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      disabled={!fighter1 || !fighter2}
                      onClick={calculateOdds}
                    >
                      See odds
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box>
                    <Box textAlign="center">
                      <Typography variant="subtitle1">Blue Corner</Typography>
                    </Box>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Fighter 2
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={fighter2}
                        label="Figher 2"
                        onChange={handleChange2}
                        MenuProps={{
                          maxheight: "10px",
                        }}
                      >
                        {fightersList.map((fighter, i) => {
                          return (
                            <MenuItem value={fighter} key={i}>
                              {fighter}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {calculated ? (
            <Box sx={{ flexGrow: 1, padding: "20px" }} textAlign="center">
              <div className="odds">Prediction :{odds}</div>
            </Box>
          ) : (
            ""
          )}

          <Paper
            sx={{
              marginTop: "calc(10% + 60px)",
              width: "100%",
              position: "fixed",
              bottom: 0,
            }}
          >
            <Box sx={{ flexGrow: 1, padding: "20px" }} textAlign="center">
              <Typography variant="body">
                Odds looking "odd"? <br></br>
                <br></br>
                Remember that Red Corner is the defending champion (or the
                higher rank fighter) and blue is the challenger. Try switching
                sides
              </Typography>
            </Box>
            <Box
              sx={{ flexGrow: 1, padding: "20px", paddingTop: "5px" }}
              textAlign="center"
            >
              <Link
                href="https://github.com/cmanage1/ufc-fight-predictor"
                target="__blank"
              >
                <GitHubIcon />
              </Link>
            </Box>
          </Paper>
        </Paper>
      </div>
    );
  }
}

export default App;
