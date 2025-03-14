import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import FoodSlideShow from '../../components/FoodSlideShow/FoodSlideShow'

const Home = () => {

  const [category,setCategory] = useState("All")
  const [productType, setProductType] = useState("Veg");

  return (
    <>
      <Header/>
      <ExploreMenu setCategory={setCategory} category={category} productType={productType} setProductType={setProductType} />
      <FoodDisplay category={category} productType={productType}/>
      <FoodSlideShow/>
    </>
  )
}

export default Home
