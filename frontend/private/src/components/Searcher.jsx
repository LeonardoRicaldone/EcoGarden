const Searcher = ({placeholder}) => {

    return (

        <>

        <div className="buscador">
        <span className="material-icons">search</span>
        <input type="text" placeholder={placeholder} />
        </div> <br />
        
        </>
    )
}

export default Searcher;