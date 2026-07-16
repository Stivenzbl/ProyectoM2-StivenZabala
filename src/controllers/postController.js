const postService = require('../services/postService');
const commentService = require('../services/commentService');

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error al listar posts:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener la lista de posts.' });
  }
};

const createPost = async (req, res) => {
  const { title, content, authorId, published } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: 'El título es obligatorio.' });
  }

  if (!content || !String(content).trim()) {
    return res.status(400).json({ message: 'El contenido es obligatorio.' });
  }

  if (!authorId) {
    return res.status(400).json({ message: 'author_id es obligatorio.' });
  }

  try {
    const newPost = await postService.createPost({ title: String(title).trim(), content: String(content).trim(), authorId, published: Boolean(published) });
    return res.status(201).json(newPost);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ message: 'El author_id proporcionado no existe.' });
    }
    console.error('Error al crear post:', error);
    return res.status(500).json({ message: 'No se pudo crear el post.' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: `Post con ID ${req.params.id} no encontrado.` });
    }
    const comments = await commentService.listCommentsByPost(req.params.id);
    return res.status(200).json({ post, comments });
  } catch (error) {
    console.error('Error al obtener post:', error);
    if (error.status === 404) {
      return res.status(404).json({ message: `Post con ID ${req.params.id} no encontrado.` });
    }
    return res.status(500).json({ message: 'Error interno del servidor al recuperar el post y sus comentarios.' });
  }
};

const getPostsByAuthor = async (req, res) => {
  try {
    const posts = await postService.getPostsByAuthor(req.params.authorId);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener posts por autor:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createComment = async (req, res) => {
  const { authorId, content } = req.body;

  if (!authorId) {
    return res.status(400).json({ message: 'authorId es obligatorio.' });
  }

  if (!content || !String(content).trim()) {
    return res.status(400).json({ message: 'El contenido es obligatorio.' });
  }

  try {
    await commentService.createComment(req.params.postId, authorId, String(content).trim());
    return res.status(201).json({ message: 'Comentario publicado exitosamente.' });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ message: 'El post o author indicado no existe.' });
    }
    console.error('Error al comentar:', error);
    return res.status(500).json({ message: 'No se pudo publicar el comentario.' });
  }
};

const listCommentsByPost = async (req, res) => {
  try {
    const comments = await commentService.listCommentsByPost(req.params.postId);
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error al listar comentarios:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await postService.updatePost(req.params.id, req.body);
    return res.status(200).json(updatedPost);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: `Post con ID ${req.params.id} no encontrado.` });
    }
    console.error('Error al actualizar post:', error);
    return res.status(500).json({ message: 'No se pudo actualizar el post.' });
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: `Post con ID ${req.params.id} no encontrado.` });
    }
    console.error('Error al borrar post:', error);
    return res.status(500).json({ message: 'No se pudo eliminar el post.' });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  getPostsByAuthor,
  createComment,
  listCommentsByPost,
  updatePost,
  deletePost
};