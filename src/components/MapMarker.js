import React from 'react';
import arweaveIcon from '../assets/arweave.png';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Collapse } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faEthereum, faTwitter, faDiscord  } from '@fortawesome/free-brands-svg-icons';
import {
  HomeRounded as AddressIcon,
  MyLocationRounded as LocationIcon,
  EmailRounded as EmailIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 200,
  },
  listItem: {
    paddingTop: 2,
    paddingBottom:2
  },
  listItemAvatar: {
    minWidth: 32
  },
  avatar: {
    width: 24,
    height: 24,
    background: theme.palette.primary.light
  },
  icon: {
    fontSize: 12,
    width: 12,
    height: 12,
    color: theme.palette.primary.contrastText
  },
  primary: {
    fontSize: 14
  },
  secondary: {
    fontSize: 12,
    whiteSpace: 'nowrap', 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}));

export default function MapMarker(props) {
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  function copyToClipboard(text) {
    return () => {
      navigator.clipboard.writeText(text);
      props.alertCopied('Copied!');
    };
  }

  function handleClick() {
    setOpen(!open);
  }

  const { lastSeen, walletAddress, address, lat, lng, name, email, ethereum, twitter, discord, seenAt } = props;
  const PopupListItem = (props) => (
    <ListItem onClick={copyToClipboard(props.secondary)} button className={classes.listItem}>
      {props.children && (
        <ListItemAvatar className={classes.listItemAvatar}>
          <Avatar className={classes.avatar}>
            {props.children}
          </Avatar>
        </ListItemAvatar>
      )}
      <ListItemText
        primary={props.primary} 
        secondary={props.secondary}
        primaryTypographyProps={{ className: classes.primary }} 
        secondaryTypographyProps={{ className: classes.secondary }} />
    </ListItem>
  )
  return (
    <React.Fragment>
      <List className={classes.root}>
        {lastSeen && (
          <PopupListItem primary="Last seen" secondary={(new Date(lastSeen)).toLocaleString()}/>
        )}
        <PopupListItem
          secondary={walletAddress}
        >
          <img src={arweaveIcon} alt="Arweave" className={classes.icon} />
        </PopupListItem>
        <PopupListItem
          secondary={address}
        >
          <AddressIcon className={classes.icon}/>
        </PopupListItem>
        <PopupListItem
          secondary={`${lat}, ${lng}`}
        >
          <LocationIcon className={classes.icon}/>
        </PopupListItem>
        {name && (
          <PopupListItem
            secondary={name}
          >
            <FontAwesomeIcon className={classes.icon} icon={faAt} />
          </PopupListItem>)}
        {email && (
          <PopupListItem
            secondary={email}
          >
            <EmailIcon className={classes.icon} />
          </PopupListItem>)}
        {ethereum && (
          <PopupListItem
            secondary={ethereum}
          >
            <FontAwesomeIcon className={classes.icon} icon={faEthereum} />
          </PopupListItem>)}
        {twitter && (
          <PopupListItem
            secondary={twitter}
          >
            <FontAwesomeIcon className={classes.icon} icon={faTwitter} />
          </PopupListItem>)}
        {discord && (
          <PopupListItem
            secondary={discord}
          >
            <FontAwesomeIcon className={classes.icon} icon={faDiscord} />
          </PopupListItem>)}
        {seenAt && seenAt.length > 0 && (
          <React.Fragment>
            <ListItem button onClick={handleClick}>
              <ListItemText 
                primary="Seen on"
                primaryTypographyProps={{ className: classes.primary }}  
              />
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className={classes.root}>
                {seenAt.map(timestamp => (
                  <PopupListItem 
                    key={`seenAt-${walletAddress}-${timestamp}`} 
                    secondary={(new Date(timestamp)).toLocaleString()}
                  />
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        )}
      </List>
    </React.Fragment>
  )
}