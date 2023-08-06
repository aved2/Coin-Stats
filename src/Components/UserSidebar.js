import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Avatar, Button } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { numberWithCommas } from './Carousel';
import { doc, setDoc } from "firebase/firestore";
import { CryptoState } from "../CryptoContext";
import invertBanner from './Images/invertBanner.png';
import {AiFillCaretDown, AiFillCaretUp, AiFillDelete} from 'react-icons/ai';
import addNotification from "react-push-notification";

const useStyles = makeStyles({
  container: {
    backgroundImage: `url(${invertBanner})`,
    width: 370,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "#EEBC1D",
    marginTop: 20,
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#35A1EB",
    objectFit: "contain",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "slategrey",
    borderRadius: 10,
    marginTop: -35,
    marginBottom: 15,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    height: 40,
    fontSize: 13,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEBC1D",
    boxShadow: "0 0 3px black",
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const { user, setAlert, coin, watchlist, coins, symbol } = CryptoState();


  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !",
    });

    toggleDrawer();
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };


    const notif = (coin) => {
        let message;
        let trend;
            if(coin?.price_change_percentage_24h > 0){
                message="Congrats!"
                trend="has increased"
            }
            else{
                message= "Uh Oh."
                trend="has decreased"
            }
            addNotification({
                title: `${coin.name}`,
                message: `${message} Over the last 24 hours, ${coin.name} ${trend} by ${coin?.price_change_percentage_24h}%!`,
                duration: 10000,
                icon: `${coin?.image}`,
                native: true
            });
            
        
    }
    



  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 50,
              width: 50,
              marginLeft: 40,
              cursor: "pointer",
              backgroundColor: "#35A1EB",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 20 }}>
                    Watchlist
                  </span>
                  <span style={{ marginTop: "-10px", fontSize: 15 }}>
                    Click For Recent Updates
                  </span>
                  {coins.map((coin) => {
                    let profit = coin?.price_change_percentage_24h >= 0;
                    if (watchlist.includes(coin.id))
                      return (
                        <div className={classes.coin} 
                            style={{
                                backgroundColor: profit > 0 ? "rgb(14, 203, 129)" : "red"
                            }}
                        >
                          <span style={{cursor: "pointer"}}onClick={() => notif(coin)}>
                            {coin.name}
                            {profit ? <AiFillCaretUp style={{marginLeft:"10px"}}/> : <AiFillCaretDown style={{marginLeft:"10px"}}/>}
                          </span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    else return <></>;
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}