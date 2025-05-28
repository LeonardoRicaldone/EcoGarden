const logoutController = {};

logoutController.logout = async(req, res) => {
    //Limpiar las cookies, con esto, se borra el token
    res.clearCookie("authToken")

    return res.json({message: "Session closed"})
}

export default logoutController;