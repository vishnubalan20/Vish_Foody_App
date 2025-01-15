import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import FoodSlideShow from '../../components/FoodSlideShow/FoodSlideShow'

const Home = () => {

  const [category,setCategory] = useState("All")

  return (
    <>
      <Header/>
      <FoodSlideShow/>
      <ExploreMenu setCategory={setCategory} category={category}/>
      <FoodDisplay category={category}/>
    </>
  )
}

export default Home
