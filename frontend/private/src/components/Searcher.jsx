const Searcher = ({placeholder, onSearch, searchValue}) => {

    return (

        <>
        <div className="buscador">
        <input
        type="text"
        placeholder={placeholder}
        value={searchValue || ''}
        onChange={(e) => onSearch && onSearch(e.target.value)} />
        <span className="material-icons">search</span>
        </div> <br />
        
        </>
    )
}

export default Searcher;

