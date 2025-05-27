import React from "react";
import Header from "../components/Header";
import "./Sales.css";
import Searcher from '../components/Searcher';
import ListSales from '../components/Sales/ListSales';
import useDataSales from '../components/Sales/hooks/useDataSales';

const Sales = () => {
  const {
    sales,
    loading,
    searchTerm,
    filterSales,
    totalSales,
    filteredCount,
    updateSaleStatus
  } = useDataSales();

  return (
    <>
      <div className="sales-container">
        <Header title={"Sales"} />
        
        <Searcher 
          placeholder={"Buscar ventas"} 
          onSearch={filterSales}
          searchValue={searchTerm}
        />
        
        <ListSales 
          sales={sales}
          loading={loading}
          filteredCount={filteredCount}
          totalSales={totalSales}
          updateSaleStatus={updateSaleStatus}
        />
      </div>
    </>
  );
};

export default Sales;
