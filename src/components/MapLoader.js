import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
  mapLoadingContainer: {
    top: 0,
    zIndex: 1000,
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  mapLoading: {
    maxWidth: '50%'
  }
});

export default function MapLoader(props) {
  const classes = useStyles();
  return (
    <div className={classes.mapLoadingContainer}>
      <CircularProgress className={classes.mapLoading} color="secondary"/>
    </div>
  );
}