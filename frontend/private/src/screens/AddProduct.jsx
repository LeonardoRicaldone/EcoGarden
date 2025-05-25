import "./AddProduct.css"
import { Link } from "react-router-dom"
import HeaderProducts from '../components/HeaderProducts';

const AddProduct = () => {


    return(

        <>

<div className="productos-container">
      <HeaderProducts title={"Products register"}/>

      <div className="product-form-content">
        <div className="upload-section">
          <div className="upload-box">
            <div className="upload-icon">Imagen</div>
          </div>
          <button className="submit-button">Subir foto</button>
        </div>

        <form className="form-section">
          <label>
            Nombre del producto
            <input type="text" name="nombre" />
          </label>

          <label>
            Descripción
            <textarea name="descripcion" rows="3" />
          </label>

          <div className="form-row">
            <label className="categoria-label">
              Categoría
              <select name="categoria">
                <option value="">Seleccione</option>
                <option value="frutas">Frutas</option>
                <option value="vegetales">Vegetales</option>
              </select>
            </label>

            <label className="precio-label">
              Precio
              <input type="text" name="precio" placeholder="$" />
            </label>
          </div>

          <button type="submit" className="submit-button">Registrar Producto</button>
        </form>
      </div>
    </div>

        </>
        
    )
}

export default AddProduct;