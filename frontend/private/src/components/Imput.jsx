const Imput = ({label, placeholder, type}) => {

    return (

        <>
        <div class="w-100">
        <label style={{ color: "#93A267" }} for="formGroupExampleInput" class="form-label">{label}</label>
        <input style={{border: '2px solid #93A267'}} type={type} class="form-control" id="formGroupExampleInput" placeholder={placeholder}
        />
        </div>


        </>

        



    )
}

export default Imput