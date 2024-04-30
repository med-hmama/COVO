const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getOnePost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.route("/").post(createPost).get(getAllPosts);

router.route("/:id").get(getOnePost).put(updatePost).delete(deletePost);

module.exports = router;
