import Post from '../models/post.model'
import errorHandler from './../helpers/dbErrorHandler'
import { IncomingForm } from 'formidable';
import fs from 'fs'

const create = (req, res, next) => {
  let form = new IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ // Fixed: status code as number
        error: "Image could not be uploaded"
      })
    }

    if (Array.isArray(fields.text)) {
      fields.text = fields.text[0];
    }

    let post = new Post(fields)
    post.postedBy= req.profile
    if(files.photo){
      const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo; // Get the actual file object
      const photoPath = photoFile.filepath || photoFile.path; // Use .filepath for v3+, .path for v2
      const photoType = photoFile.mimetype || photoFile.type; // Use .mimetype for v3+, .type for v2

      if (photoPath) {
        post.photo.data = fs.readFileSync(photoPath);
        post.photo.contentType = photoType;
      }
    }
    try {
      let result = await post.save()
      res.json(result)
    }catch (err){
      console.error("Mongoose save error:", err);
      return res.status(400).json({ // Fixed: status code as number
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const postByID = async (req, res, next, id) => {
  try{
    let post = await Post.findById(id).populate('postedBy', '_id name').exec()
    if (!post)
      return res.status(400).json({ // Fixed: status code as number
        error: "Post not found"
      })
    req.post = post
    next()
  }catch(err){
    return res.status(400).json({ // Fixed: status code as number
      error: "Could not retrieve use post"
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let posts = await Post.find({postedBy: req.profile._id})
                          .populate('comments.postedBy', '_id name')
                          .populate('postedBy', '_id name')
                          .sort('-created')
                          .exec()
    res.json(posts)
  }catch(err){
    return res.status(400).json({ // Fixed: status code as number
      error: errorHandler.getErrorMessage(err)
    })
  }
}
// post.controller.js

const listNewsFeed = async (req, res) => {
  // Ensure req.profile and req.profile.following exist
  if (!req.profile || !req.profile.following) {
    return res.status(400).json({
      error: "User profile or following list not available."
    });
  }

  // Create an array that includes both the users being followed AND the logged-in user's own ID
  // It's safer to create a new array to avoid modifying the original req.profile.following
  let usersToInclude = [...req.profile.following.map(user => user._id)]; // Map to just IDs if populated
  usersToInclude.push(req.profile._id); // Add the logged-in user's own ID

  try {
    let posts = await Post.find({ postedBy: { $in: usersToInclude } })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec();
    res.json(posts);
  } catch (err) {
    console.error("Error in listNewsFeed:", err); // Log the actual error for debugging
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const remove = async (req, res) => {
  let post = req.post
  try{
    let deletedPost = await Post.deleteOne({ _id: post._id }); // This line was already correctly updated
    res.json(deletedPost);
  }catch(err){
    console.error("Error deleting post in post.controller.js:", err);
    return res.status(400).json({ // Fixed: status code as number
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

const like = async (req, res) => {
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
    res.json(result)
  }catch(err){
      return res.status(400).json({ // Fixed: status code as number
        error: errorHandler.getErrorMessage(err)
      })
  }
}

const unlike = async (req, res) => {
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
    res.json(result)
  }catch(err){
    return res.status(400).json({ // Fixed: status code as number
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const comment = async (req, res) => {
  let comment = req.body.comment
  comment.postedBy = req.body.userId
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .exec()
    res.json(result)
  }catch(err){
    return res.status(400).json({ // Fixed: status code as number
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const uncomment = async (req, res) => {
  let comment = req.body.comment
  try{
    let result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}}, {new: true})
                          .populate('comments.postedBy', '_id name')
                          .populate('postedBy', '_id name')
                          .exec()
    res.json(result)
  }catch(err){
    return res.status(400).json({ // Fixed: status code as number
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if(!isPoster){
    return res.status(403).json({ // Fixed: status code as number
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  listByUser,
  listNewsFeed,
  create,
  postByID,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster
}