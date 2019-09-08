import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { AppBar, Toolbar, Typography, InputBase, CircularProgress } from '@material-ui/core';
import { fade, withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  titleContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'flex-start'
  },
  titlePart: {
    opacity: 0.6,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  error: {
    color: '#b3252c'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  section: {
    display: 'flex',
  },
});

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = { searchValue: '', typing: false, typingTimeout: 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.state.typing 
      && !prevProps.walletAddress 
      && this.props.walletAddress 
      && this.state.searchValue !== this.props.walletAddress
    ) {
      this.setState({ searchValue: this.props.walletAddress });
    }
  }

  handleChange(event) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      searchValue: event.target.value,
      typing: true,
      typingTimeout: setTimeout(() => {
        if (this.state.searchValue.length) {
          if (this.props.location.pathname !== '/search') {
            this.props.history.push('/search')
          }
          this.props.searchWalletLocations(this.state.searchValue)
          this.setState({ typing: false })
        }
      }, 1000)
    });
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.titleContainer}>
              <Typography className={classNames(classes.title)} variant="h6" noWrap>
                <strong>NOMAD</strong> 
              </Typography>
              <Typography className={classNames(classes.title,classes.titlePart)} variant="h6" noWrap>
                SCRIBE
              </Typography>
            </div>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search for a wallet…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                value={this.state.searchValue} 
                onChange={this.handleChange}
                onKeyPress={event => event.key === 'Enter' && this.handleChange(event)}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.section}>
              {this.props.loading && <CircularProgress color="secondary"/>}
              {!this.props.loading && this.props.error && (
                <Typography className={classes.error} variant="h6" noWrap>
                  {this.props.error}
                </Typography>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(withRouter(props => <Navigation {...props}/>))