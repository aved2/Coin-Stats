import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CryptoState } from '../CryptoContext';
import { TrendingCoins } from '../CoinGecko';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

//Adding commas to large integers
export function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//react alice carousel animation
const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  //axios fetch data from CoinGecko
  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));

    setTrending(data);
  };

  //When currency changes, re-fetches coin info
  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  //MUI Styling
  const useStyles = makeStyles(() => ({
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
      marginTop: "70px"
    },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "black",
    },
  }));

  
  const classes = useStyles();
  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return(
        <Link
            className={classes.carouselItem}
            to={`/coins/${coin.id}`}
        >
            <img 
                src={coin?.image}
                alt={coin.name}
                height="80"
                style={{ marginBottom:10}}
            />
            <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
              fontFamily: 'Roboto'
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500, fontFamily: 'Roboto' }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
        </Link>
    )
    });
  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
    />
    </div>
  )
}

export default Carousel
