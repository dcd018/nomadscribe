import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
  Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Button, CircularProgress 
} from '@material-ui/core';

const styles = {
  loading: {
    width: 24,
    height: 24,
  }
}

class ConfirmDialog extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!props.open && (state.confirmLoading || state.cancelLoading)) {
      return { confirmLoading: false, cancelLoading: false };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = { confirmLoading: false, cancelLoading: false };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  confirm() {
    this.setState({ confirmLoading: true });
    this.props.confirm();
  }

  cancel() {
    this.setState({ cancelLoading: true });
    this.props.cancel();
  }

  render() {
    const { open, title, text, classes } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.confirm} color="primary" autoFocus>
            {(this.state.confirmLoading && this.props.loading)
               ? (<CircularProgress size="24" className={classes.loading} />)
               : 'Confirm'}
            </Button>
            <Button onClick={this.cancel} color="primary">
              {(this.state.cancelLoading && this.props.loading)
               ? (<CircularProgress size="24" className={classes.loading} />)
               : 'Cancel'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ConfirmDialog);