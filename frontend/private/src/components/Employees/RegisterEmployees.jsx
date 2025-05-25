import React from "react";
import Button from "../Button";

const RegisterEmployees = ({
  name, setName,
  lastname, setLastName,
  phone, setPhone,
  email, setEmail,
  password, setPassword,
  handleSubmit,
}) => {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Apellido"
        value={lastname}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />


      <Button text={"Guardar"}label="Guardar" type="submit" colorClass="primary" />
    </form>
  );
};

export default RegisterEmployees;