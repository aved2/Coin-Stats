import React, { useState, useEffect, useContext, createContext } from 'react'
import axios from 'axios';
import { CoinList } from './CoinGecko';
import { auth, db } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
//Context API allows us to pass currency + symbol props throughout the react app

const Crypto = createContext();

const CryptoContext = ({children}) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([])
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success" 
  });

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);
  };
  
  //onSnapshot checks if db is updated or not
  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

    useEffect(() => {
        if (currency === "EUR") setSymbol("€")
        else if (currency === "JPY") setSymbol("¥")
        else if (currency === "GBP") setSymbol("£")
        else if (currency === "CHF") setSymbol("₣")
        else if (currency === "AUD") setSymbol("$")
        else if (currency === "CNY") setSymbol("¥")
        else if (currency === "HKD") setSymbol("$")
        else if (currency === "CAD") setSymbol("$")
        else if (currency === "INR") setSymbol("₹")
        else setSymbol("$")
        
    }, [currency]);

  return (
    <div>
      <Crypto.Provider 
        value={{
          currency, 
          symbol,
          setCurrency, 
          coins, 
          loading, 
          fetchCoins,
          alert, 
          setAlert,
          user,
          watchlist
          }}
        >
        {children}
      </Crypto.Provider>
    </div>
  )
}

export default CryptoContext

//Calling CryptoState will allow us to access CryptoContxt props
export const CryptoState = () => {
    return useContext(Crypto);
}