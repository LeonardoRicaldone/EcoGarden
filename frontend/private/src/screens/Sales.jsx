import React from "react"
import Header from "../components/Header"
import "./Sales.css"
import Searcher from '../components/Searcher';

const Sales = () => {

    return(
        <>

        <div className="sales-container">
        
        <Header title={"Sales"}/>

        <Searcher placeholder={"Buscar ventas"}/>


        </div>
        
        </>
    )
}

export default Sales; 