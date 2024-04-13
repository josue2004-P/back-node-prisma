const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//CREAR USUARIO
const crearUsuario = async (req, res = response) => {
  const { email, password, nombre,rol } = req.body;
  try {
    let usuario = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password, salt);

    // PRISMA
    const newUser = await prisma.user.create({
      data: {
        nombre: nombre,
        email: email,
        password: newPassword,
        rol: rol,
      },
    });

    // Generar JWT
    const token = await generarJWT(newUser.id, newUser.name);

    res.status(201).json({
      ok: true,
      id: newUser.id,
      rol: newUser.rol,
      email:newUser.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: error.message,
      msg: "Por favor hable con el administrador",
    });
  }
};

// CREAR EMPLEADO

const crearEmpleado = async (req, res = response) => {
  const { email, password, nombre,rol,apellido,edad } = req.body;
  try {
    let usuario = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password, salt);

    // CREAR AUTH
    const newUser = await prisma.user.create({
      data: {
        nombre: nombre,
        email: email,
        password: newPassword,
        rol: rol,
      },
    });

    //CREAR PERFIL
    const newEmpleado = await prisma.profile.create({
      data: {
        userId:newUser.id,
        nombre: nombre,
        apellido:apellido,
        edad:edad

      },
    });




    // Generar JWT
    const token = await generarJWT(newUser.id, newUser.name);

    res.status(201).json({
      ok: true,
      id: newUser.id,
      rol: newUser.rol,
      email:newUser.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: error.message,
      msg: "Por favor hable con el administrador",
    });
  }
};


// LOGIN
const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      id: usuario.id,
      name: usuario.name,
      rol: usuario.rol,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {

  const { uid, name } = req;

  const usuario = await prisma.user.findFirst({
    where: {
      id: uid,
    },
  });

  // Generar JWT
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    rol: usuario.rol,
    id: uid,
    token,
  });
};

module.exports = {
  crearUsuario,
  crearEmpleado,
  loginUsuario,
  revalidarToken,
};
