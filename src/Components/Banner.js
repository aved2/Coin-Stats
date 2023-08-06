import { Container, makeStyles } from '@material-ui/core'
import React from 'react'
import Carousel from './Carousel';
import mainLogo2 from './Images/mainLogo2.png'

//MUI Styling
const useStyles = makeStyles(() => ({
   banner: {
    backgroundImage: 'url(./banner.jpg)',
  },
    bannerContent: {
        height: 400,
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
        justifyContent: "space-around",
      },
      tagline: {
        display: "flex",
        height: "40%",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      },
}))


const Banner = () => {
    const classes = useStyles();

  return (
    <div className={classes.banner} style={{marginTop:'20px'}}>
        <Container className={classes.bannerContent}>
            <div className={classes.tagline}>
                <img className="Logo" src={mainLogo2} alt="Logo"
                 style={{
                  scale: '40%',
                  marginTop: '50px'
                 }}/>
            </div>
            <Carousel />
        </Container>
    </div>
  )
}

export default Banner
