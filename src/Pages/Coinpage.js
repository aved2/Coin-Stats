import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../CoinGecko';
import CoinInfo from "../Components/CoinInfo"
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from "react-html-parser"
import { Button, LinearProgress, Typography, makeStyles } from '@material-ui/core';
import axios from 'axios';
import { numberWithCommas } from '../Components/Carousel';
import banner from "../Components/Images/banner2.jpg"
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const Coinpage = () => {
  //Get ID param from URL
  const {id} = useParams();

  const[coin, setCoin] = useState();

  const {currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const {data} = await axios.get(SingleCoin(id));
    setCoin(data);
  }
  
  useEffect(() => {
    fetchCoin();
  }, [])

  //MUI Styling
  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      background: '#16171a',
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      borderRight: "2px solid white",
      boxShadow: 'inset 0px 10px 6px -6px grey',
      backgroundImage: `url(${banner})`
  
    },
    heading: {
      fontWeight: "bolder",
      marginBottom: 20,
      fontFamily: "Roboto",
      color: 'black'
    },
    description: {
      width: "100%",
      fontFamily: "Roboto",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "center",
      color: 'black'
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      color: "black",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));

  const classes = useStyles();

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try{
      await setDoc(coinRef, 
          {coins:watchlist?[...watchlist, coin?.id]:[coin?.id]}
        );
      setAlert({
        open: true,
        message: `${coin.name} Added to Watchlist!`,
        type: "success",
      })
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        //returns everything that is not the coin being removed
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
  
  //Loading animation
  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;


  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
      <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ margin: '20px 0px' }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Roboto",
              }}
            >
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Roboto",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Roboto",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
            </Typography>
          </span>
          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 60,
                border: "none",
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
        <CoinInfo coin={coin} />
    </div>
  )
}

export default Coinpage
