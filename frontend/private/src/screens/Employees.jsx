import React from "react"
import Header from "../components/Header"
import "./Employees.css"
import Searcher from '../components/Searcher';

const Employees = () => {

    return(
        <>

        <div className="employees-container">
        
        <Header title={"Employees"}/>

        <Searcher placeholder={"Buscar empleados"}/>


        </div>
        
        </>
    )
}

export default Employees; 

