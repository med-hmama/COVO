const Post = require("../models/postModel");
const ObjectID = require("mongoose").Types.ObjectId;

const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOnePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await Post.findByIdAndUpdate({ _id: req.params.id }, req.body).then(
      (docs, err) => {
        if (!err) return res.json({ message: "Succefully updated" });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await Post.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Succefully deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
  updatePost,
  deletePost,
};
