import React from 'react';
import { Route } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import NavigationContainer from './containers/NavigationContainer';
import LoginContainer from './containers/LoginContainer';
import SearchContainer from './containers/SearchContainer'
import './leaflet/leaflet.css'
import './App.css'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#ff4742' }
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}));

function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{padding: 0, zIndex: 1000, marginBottom: 10}}>
            <NavigationContainer />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid style={{margin: 0, padding: 0}} item xs={12}>
            <Route exact path="/" component={LoginContainer} />
            <Route exact path="/search" component={SearchContainer} />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;