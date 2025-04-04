const Imput = ({label, placeholder, type}) => {

    return (

        <>
        <div class="col-sm-4">
        <label for="formGroupExampleInput" class="form-label">{label}</label>
        <input type={type} class="form-control" id="formGroupExampleInput" placeholder={placeholder}/>
        </div>


        </>

        



    )
}

export default Imput