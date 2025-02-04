import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = ({category,setCategory, productType,setProductType}) => {

  const {veg_menu_list, non_veg_menu_list} = useContext(StoreContext);
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Discover Your Dish</h1>
      <p className='explore-menu-text'>Browse our menu and discover a wide selection of mouthwatering dishes. Our goal is to satisfy your cravings and enhance your dining experience with every flavorful meal we serve.</p>
      <h3>Veg items</h3>
      <div className="explore-menu-list">
        {veg_menu_list.map((item,index)=>{
            return (
                <div onClick={()=> {
                  setCategory(prev=>prev===item.menu_name?"All":item.menu_name);
                  setProductType("Veg");
                }
                } key={index} className='explore-menu-list-item'>
                    <img src={item.menu_image} className={(category===item.menu_name && productType==="Veg")?"active":""} alt="" />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <h3>Non-Veg items</h3>
      <div className="explore-menu-list">
        {non_veg_menu_list.map((item,index)=>{
            return (
                <div onClick={()=>
                  {
                    setCategory(prev=>prev===item.menu_name?"All":item.menu_name);
                    setProductType("Non-Veg");
                  }
                } key={index} className='explore-menu-list-item'>
                    <img src={item.menu_image} className={(category===item.menu_name && productType==="Non-Veg")?"active":""} alt="" />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
