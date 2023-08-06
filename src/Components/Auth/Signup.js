import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext';
import { auth } from '../../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = ({handleClose}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { setAlert } = CryptoState();
    
    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setAlert({
              open: true,
              message: "Passwords do not match",
              type: "error",
            });
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            setAlert({
              open: true,
              message: `Sign Up Successful. Welcome ${result.user.email}`,
              type: "success",
            });
      
            handleClose();
          } catch (error) {
            setAlert({
              open: true,
              message: error.message,
              type: "error",
            });
            return;
          }
    };
    


  return (
    <div>
        <Box
        p={3}
        style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
      >
        <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{
            style: { color: 'white' },
          }}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Enter Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{
            style: { color: 'white' },
          }}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputLabelProps={{
            style: { color: 'white' },
          }}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#EEBC1D", height: '50px'}}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>

        </Box>
      
    </div>
  )
}

export default Signup
