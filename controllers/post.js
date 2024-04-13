const { response } = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const crearPost = async (req, res = response) => {
  const { title, content, authorId } = req.body;
  try {
    // PRISMA
    const newUser = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: authorId,
      },
    });

    res.status(201).json({
      ok: true,
      newUser,
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

const obtenerPost = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      where: {
        title: {
          contains: search,
          mode: "insensitive", // Para hacer la búsqueda insensible a mayúsculas y minúsculas
        },
      },
      skip: page * limit,
      take: limit,
    });

    const total = await prisma.post.count({
      where: {
        title: {
          contains: search,
          mode: "insensitive", // Para hacer la búsqueda insensible a mayúsculas y minúsculas
        },
      },
    });

    res.status(201).json({
      ok: true,
      total,
      page: page + 1,
      limit,
      posts,
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

module.exports = {
  crearPost,
  obtenerPost,
};
