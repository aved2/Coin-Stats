import { React } from 'react'
import { AppBar, makeStyles, Container, Select, MenuItem, Toolbar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { CryptoState } from '../CryptoContext'
import logo2 from './Images/logo2.png'
import logoWords from './Images/logoWords.png'
import AuthModal from './Auth/AuthModal'
import UserSidebar from './UserSidebar'
import invertBanner from './Images/invertBanner.png'

//MUI Styling
const useStyles = makeStyles(() => ({
    logo: {
        flex: 1,
    },
    select: {
        '&:before': {
            borderColor: 'white',
        },
        '&:after': {
            borderColor: 'white',
        },
        '&:not(.Mui-disabled):hover::before': {
            borderColor: 'white',
        },
    },
    icon: {
        fill: 'white',
    },
    root: {
        color: 'white',
    },
}))


const Header = () => {
    const classes = useStyles();
    const {currency, setCurrency, user } = CryptoState();
    
  return (
    <AppBar style={{backgroundImage: `url(${invertBanner})`}} position='static'>
        <Container>
            <Toolbar style={{height:90}}>
                <Link className= {classes.logo} to='/' >
                    <img style={{height: "70px", }} src={logo2} alt="Logo" />
                    <img style={{height: "20px", marginBottom:'20px', marginLeft:'10px'}} src={logoWords} alt="Coin Stats" />
                </Link>
                <Select 
                labelId="select-filter-by-field-labe;"
                label="Currency" 
                style={{ color: 'white', width:250, marginLeft: 15}}
                variant="outlined" 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}>
                    <MenuItem value={"USD"}>US Dollar (USD)</MenuItem>
                    <MenuItem value={"EUR"}>Euro (EUR)</MenuItem>
                    <MenuItem value={"JPY"}>Japanese Yen (JPY)</MenuItem>
                    <MenuItem value={"GBP"}>British Pound (GBP)</MenuItem>
                    <MenuItem value={"CHF"}>Swiss Franc (CHF)</MenuItem>
                    <MenuItem value={"AUD"}>Australian Dollar (Aud)</MenuItem>
                    <MenuItem value={"CNY"}>Chinese Yuan (CNY)</MenuItem>
                    <MenuItem value={"HKD"}>Hong Kong Dollar (HKD)</MenuItem>
                    <MenuItem value={"CAD"}>Canadian Dollar (CAD)</MenuItem>
                    <MenuItem value={"INR"}>Indian Rupee (INR)</MenuItem>
                    <MenuItem value={"NZD"}>New Zealand Dollar (NZD)</MenuItem>
                </Select>
                {user ? <UserSidebar />  : < AuthModal />}
            </Toolbar>
        </Container>

    </AppBar>
  )
}

export default Header
