import React from 'react'
import Banner from '../Components/Banner'
import Coinstable from '../Components/Coinstable'
import invertBanner from '../Components/Images/invertBanner.png'

const Homepage = () => {
  return (
      <div>
        <Banner />
        <div style={{backgroundImage: `url(${invertBanner})`, boxShadow: '5px 5px 5px 5px grey'}}>
          <Coinstable />
        </div>
      </div>
  )
}

export default Homepage
