const Imput = ({label, placeholder, kind}) => {

    return (

        <>
        <div class="w-100">
        <label style={{ color: "#93A267", fontWeight: "bold" }} for="formGroupExampleInput" class="form-label">{label}</label>
        <imput style={{border: '2px solid #93A267'}} kind={kind} class="form-control" id="formGroupExampleInput" placeholder={placeholder}
        />
        </div>


        </>

        



    )
}

export default Imput