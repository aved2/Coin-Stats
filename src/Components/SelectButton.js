import { makeStyles } from '@material-ui/core';
import React from 'react'

const SelectButton = ({children, selected, onClick}) => {

    //MUI Styling
    const useStyles = makeStyles({
        selectbutton: {
          background: '#4BB17B',
          borderRadius: 5,
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          fontFamily: "Roboto",
          cursor: "pointer",
          backgroundColor: selected ? "gold" : "",
          color: selected ? "black" : "",
          fontWeight: selected ? 700 : 500,
          "&:hover": {
            backgroundColor: "gold",
            color: "black",
          },
          width: "22%",
        },
      });
    
      const classes = useStyles();
    
      return (
        <span onClick={onClick} className={classes.selectbutton} style={{color:"black"}}>
          {children}
        </span>
      );
}

export default SelectButton
