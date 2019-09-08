import React from 'react';
import { Typography, ClickAwayListener } from '@material-ui/core';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import AlertDialog from './AlertDialog';

const DropzoneOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: #ffffff;
  background-color: rgba(0,0,0,0.80);
  z-index: 2000;
  display: flex;
  flex-shrink: 4;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-aligin: center;
`

const DropzoneContainer = styled.div`
  margin: 10px;
  border-radius: 10px;
  border: 5px dashed #ffffff;
`

const DropzoneInner = styled.div`
  padding: 100px
`
const DropzoneOuter = styled.div`
  align-items: center;
  justify-content: center;
  margin: 10px;
  text-align: center;
`

export default class KeyDrop extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { alertOpen, alertText } = props;
    if ((alertOpen && alertText) && (alertOpen !== state.alertOpen && alertText !== state.alertText)) {
      return { alertOpen, alertText };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = { alertOpen: false, alertText: null };
    this.onDrop = this.onDrop.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
  }

  onDrop(keyfile) {
    keyfile = keyfile.shift();
    const reader = new FileReader();
    reader.onabort = () => this.setState({ alertOpen: true, alertText: 'Keyfile reading aborted' });
    reader.onerror = () => this.setState({ alertOpen: true, alertText: 'Keyfile reading failed' });
    reader.onload = () => {
      try {
        this.props.login(JSON.parse(reader.result));
      }
      catch (e) {
        this.setState({ alertOpen: true, alertText: 'Invalid keyfile' });
      }
    }
    reader.readAsBinaryString(keyfile);
  }

  handleClickAway() {
    this.setState({ alertOpen: false });
  }

  render() {
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <DropzoneOverlay>
          <Dropzone onDrop={this.onDrop}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <DropzoneContainer>
                  <DropzoneInner>
                    <Typography variant="h6">Drop a keyfile to login</Typography>
                  </DropzoneInner>
                </DropzoneContainer>
              </div>
            )}
          </Dropzone>
          <DropzoneOuter>
            <Typography variant="subtitle1">Explore the Permaweb</Typography>
            <Typography variant="body1">Search the trends of travelers based on your current location</Typography>
          </DropzoneOuter>
            <AlertDialog open={this.state.alertOpen} text={this.state.alertText}/>
        </DropzoneOverlay>
      </ClickAwayListener>
    );
  }
}