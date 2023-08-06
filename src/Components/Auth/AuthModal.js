import { AppBar, Backdrop, Box, Button, Fade, Modal, Tab, Tabs, makeStyles } from '@material-ui/core';
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext';
import Login from './Login';
import Signup from './Signup';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Firebase';


const useStyles = makeStyles(() => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(8px)",
    },
    paper: {
      width: 400,
      backgroundColor: '#4BB17B',
      color: "black",
      fontFamily: "Roboto",
      borderRadius: 10,
    },
    google: {
      padding: 24,
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      gap: 20,
      fontSize: 20,
    },
  }));



const AuthModal = () => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const googleProvider = new GoogleAuthProvider();
    const { setAlert } = CryptoState();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
  
    const signInWithGoogle = () => {
      signInWithPopup(auth, googleProvider)
        .then((res) => {
          setAlert({
            open: true,
            message: `Sign Up Successful. Welcome ${res.user.email}`,
            type: "success",
          });
  
          handleClose();
        })
        .catch((error) => {
          setAlert({
            open: true,
            message: error.message,
            type: "error",
          });
          return;
        });
    };
  return (
    <div>
      <Button
        variant="contained"
        style={{
          width: "100px",
          height: "56px",
          marginLeft: 15,
          backgroundColor: "#4BB17B",
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ color: 'white', borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            <Box className={classes.google}>
              <span>OR</span>
              <GoogleButton
                style={{ width: "100%", outline: "none" }}
                onClick={signInWithGoogle}
              />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default AuthModal
