import React from 'react';
import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';

export default function AlertDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.text}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}