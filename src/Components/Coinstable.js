import React, { useEffect, useState } from 'react'
import { CoinList } from '../CoinGecko';
import axios from 'axios';
import { CryptoState } from '../CryptoContext';
import { Container, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from './Carousel';
import { Pagination } from '@material-ui/lab';

const Coinstable = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const { currency, symbol, coins, loading, fetchCoins } = CryptoState();
    const navigate = useNavigate();

    //MUI Styling
    const useStyles = makeStyles({
        row: {
          backgroundColor: "#16171a",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#131111",
          },
          fontFamily: "Roboto",
        },
        pagination: {
          "& .MuiPaginationItem-root": {
            color: "#E9AB3F",
          },
        },
      });
      


    const classes = useStyles();

    useEffect(() => {
        fetchCoins();
    }, [currency]);
    
    //Search results
    const handleSearch = () => {
        return coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
      };
    


  return (
    <>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ color: "#E9AB3F", fontWeight: "2000", margin: 18, paddingTop:"20px", fontFamily: "Roboto" }}
        >
          Prices by Market Cap
        </Typography>
        <TextField
          label="Search For a Crypto Currency"
          variant="outlined"
          style={{background: "white", marginBottom: 20, width: "100%", borderRadius: '6px'}}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#E9AB3F" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontFamily: "Roboto",
                      }}
                      key={head}
                      align={head === "Coin" ? "center" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                    
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                                color: "white",
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right" style={{color: "gold", fontSize: "20px"}}>
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right" style={{color: "white"}}>
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination
          count={parseInt((handleSearch()?.length / 10).toFixed(0))}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </>
  )
}

export default Coinstable
