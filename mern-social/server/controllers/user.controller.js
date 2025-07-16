import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
// OLD: import formidable from 'formidable'
import { IncomingForm } from 'formidable' // <-- CORRECT IMPORT FOR formidable v2+
import fs from 'fs'
import profileImage from './../../client/assets/images/profile-pic.png'

const create = async (req, res) => {
  debugger
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
       error: "Email already exists. Please use a different email."
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id).populate('following', '_id name')
    .populate('followers', '_id name')
    .exec()
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = (req, res) => {
  // OLD: let form = new formidable.IncomingForm()
  let form = new IncomingForm() // <-- CORRECT INSTANTIATION
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }

    // --- Add normalization for fields that might be parsed as arrays ---
    // formidable sometimes parses single values into a single-element array.
    // Ensure these fields are strings before Mongoose tries to cast them.
    for (const key of ['name', 'email', 'password', 'about']) {
        if (Array.isArray(fields[key])) {
            fields[key] = fields[key][0];
        }
    }

    let user = req.profile
    user = extend(user, fields)
    user.updated = Date.now()

    if(files.photo){
        // formidable v3+ returns files as arrays, e.g., files.photo is [ { filepath: '...', mimetype: '...' } ]
        // formidable v2 returns files as objects, e.g., files.photo is { path: '...', type: '...' }
        const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;

        if (photoFile && photoFile.filepath) { // Use .filepath for formidable v3+, .path for v2
            user.photo.data = fs.readFileSync(photoFile.filepath || photoFile.path); // Fallback for path
            user.photo.contentType = photoFile.mimetype || photoFile.type; // Fallback for type
        }
    }
    try {
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}
// user.controller.js

// ... (other imports and functions)

const remove = async (req, res) => {
  try {
    let user = req.profile // req.profile is populated by userByID middleware
    
    // Check if req.profile exists (safety measure)
    if (!user) {
      return res.status(404).json({
        error: "User not found for deletion."
      });
    }

    // Use deleteOne() instead of remove()
    // Mongoose 6.x and later: doc.deleteOne() is preferred over doc.remove()
    let deletedUser = await user.deleteOne(); 

    // Or, if you need to delete by ID directly (less common when userByID is used):
    // let deletedUser = await User.findByIdAndDelete(user._id);

    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    // Log the actual error on the server side for debugging
    console.error("Error deleting user:", err); 
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err) // Ensure errorHandler provides a useful message
    })
  }
}

// ... (rest of the file)

const photo = (req, res, next) => {
  if(req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+profileImage)
}

const addFollowing = async (req, res, next) => {
  try{
    await User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}})
    next()
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addFollower = async (req, res) => {
  try{
    let result = await User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
                            .populate('following', '_id name')
                            .populate('followers', '_id name')
                            .exec()
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    }catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const removeFollowing = async (req, res, next) => {
  try{
    await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
    next()
  }catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const removeFollower = async (req, res) => {
  try{
    let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
                            .populate('following', '_id name')
                            .populate('followers', '_id name')
                            .exec()
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
}

const findPeople = async (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  try {
    let users = await User.find({ _id: { $nin : following } }).select('name')
    res.json(users)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople
}