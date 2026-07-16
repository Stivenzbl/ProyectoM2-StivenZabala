const authorService = require('../services/authorService');

const getAllAuthors = async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('Error al listar autores:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener la lista de autores.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: `Autor con ID ${req.params.id} no encontrado.` });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error('Error al obtener autor:', error);
    if (error.status === 404) {
      return res.status(404).json({ message: `Autor con ID ${req.params.id} no encontrado.` });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createAuthor = async (req, res) => {
  const { name, email, bio } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: 'El nombre es obligatorio.' });
  }

  if (!email || !String(email).trim()) {
    return res.status(400).json({ message: 'El email es obligatorio.' });
  }

  try {
    const newAuthor = await authorService.createAuthor({ name: String(name).trim(), email: String(email).trim(), bio: bio ? String(bio).trim() : null });
    return res.status(201).json(newAuthor);
  } catch (error) {
    if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
      return res.status(409).json({ message: 'Este correo electrónico ya está registrado.' });
    }
    console.error('Error al crear autor:', error);
    return res.status(500).json({ message: 'No fue posible crear el autor.' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await authorService.updateAuthor(req.params.id, req.body);
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: `Autor con ID ${req.params.id} no encontrado.` });
    }
    if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
    }
    console.error('Error al actualizar autor:', error);
    return res.status(500).json({ message: 'No se pudo actualizar el autor.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    await authorService.deleteAuthor(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: `Autor con ID ${req.params.id} no encontrado.` });
    }
    if (error.code === '23503') {
      return res.status(409).json({ message: 'No se puede eliminar al autor porque tiene posts o comentarios asociados.' });
    }
    console.error('Error al borrar autor:', error);
    return res.status(500).json({ message: 'No se pudo eliminar el autor.' });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};