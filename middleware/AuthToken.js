import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const Header = req.headers.token;
    if(Header){
        const token = Header.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if(error) res.status(403).json("Sesion no valida!");
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("Oop! Parece que no estas autenticado...");
    }
}

const verifyTokenAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("No tienes permisos para hacer eso!")
        }
    })
}
const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("No tienes permisos para hacer eso!")
        }
    })
}

export {verifyToken, verifyTokenAuthorization, verifyTokenAdmin};