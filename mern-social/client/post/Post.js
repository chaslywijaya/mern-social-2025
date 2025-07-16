import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Avatar,
    IconButton,
    Divider,
    useTheme
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentIcon from '@mui/icons-material/Comment'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {remove, like, unlike} from './api-post.js'
import Comments from './Comments'

export default function Post (props){
  const theme = useTheme()
  
  // Amankan akses ke auth.isAuthenticated()
  const authInfo = auth.isAuthenticated(); // Ini bisa berupa {token, user: {_id, ...}} atau false
  const currentLoggedInUser = authInfo && authInfo.user ? authInfo.user : null; // Ini akan menjadi objek user atau null

  // Periksa apakah user yang sedang login sudah terautentikasi dan memiliki _id
  const checkLike = (likes) => {
    // Hanya lakukan checkLike jika ada user yang login
    if (!currentLoggedInUser || !currentLoggedInUser._id) {
      return false; // Jika tidak ada user yang login, tidak bisa "like"
    }
    let match = likes.indexOf(currentLoggedInUser._id) !== -1
    return match
  }

  const [values, setValues] = useState({
    // Pastikan props.post.likes ada sebelum memanggil checkLike
    like: props.post.likes ? checkLike(props.post.likes) : false,
    likes: props.post.likes ? props.post.likes.length : 0,
    comments: props.post.comments || [] // Pastikan comments adalah array
  })

  // Jika useEffect ini penting, pastikan dependencies array sudah benar
  useEffect(() => {
    setValues(prevValues => ({ // Gunakan functional update untuk prevValues
      ...prevValues,
      like: props.post.likes ? checkLike(props.post.likes) : false,
      likes: props.post.likes ? props.post.likes.length : 0,
      comments: props.post.comments || []
    }));
  }, [props.post.likes, props.post.comments, currentLoggedInUser ? currentLoggedInUser._id : null]); // Tambahkan dependency user id

  const clickLike = () => {
    // Pastikan user login sebelum bisa like
    if (!currentLoggedInUser || !currentLoggedInUser._id) {
        console.log("User not logged in to like/unlike.");
        return;
    }
    let callApi = values.like ? unlike : like
    callApi({
      userId: currentLoggedInUser._id // Gunakan currentLoggedInUser._id yang aman
    }, {
      t: authInfo.token // Gunakan token dari authInfo
    }, props.post._id).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setValues({...values, like: !values.like, likes: data.likes.length})
      }
    })
  }

  const updateComments = (comments) => {
    setValues({...values, comments: comments})
  }

  const deletePost = () => {
    // Pastikan user login sebelum bisa delete
    if (!currentLoggedInUser || !currentLoggedInUser._id) {
        console.log("User not logged in to delete post.");
        return;
    }
    remove({
      postId: props.post._id
    }, {
      t: authInfo.token // Gunakan token dari authInfo
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        props.onRemove(props.post)
      }
    })
  }

  // Amankan akses ke props.post.postedBy
  const postedBy = props.post.postedBy;
  const postedById = postedBy ? postedBy._id : null;
  const postedByName = postedBy ? postedBy.name : 'Unknown User'; // Default value jika postedBy tidak ada

  return (
    <Card
      sx={{
        maxWidth:600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
      }}
    >
      <CardHeader
        avatar={
          // Pastikan postedBy dan _id-nya ada sebelum digunakan di avatar src
          postedById
            ? <Avatar src={'/api/users/photo/' + postedById} />
            : <Avatar /> // Avatar default jika tidak ada postedBy
        }
        action={
          // Hanya tampilkan tombol delete jika user login dan itu post miliknya
          currentLoggedInUser && postedById === currentLoggedInUser._id &&
          <IconButton onClick={deletePost}>
            <DeleteIcon />
          </IconButton>
        }
        title={
          // Pastikan postedBy._id ada sebelum membuat link
          postedById
            ? <Link to={"/user/" + postedById}>{postedByName}</Link>
            : <span>{postedByName}</span> // Jika tidak ada ID, tampilkan hanya nama
        }
        subheader={(new Date(props.post.created)).toDateString()}
        sx={{
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1)
        }}
      />
      <CardContent
        sx={{
          backgroundColor: 'white',
          padding: theme.spacing(2, 0)
        }}
      >
        <Typography component="p" sx={{ margin: theme.spacing(2) }}>
          {props.post.text}
        </Typography>
        {props.post.photo &&
          (<div
            sx={{
              textAlign: 'center',
              backgroundColor: '#f2f5f4',
              padding:theme.spacing(1)
            }}>
            <img
              sx={{ height: 200 }}
              src={'/api/posts/photo/'+props.post._id}
              alt="post media"
              />
          </div>)}
      </CardContent>
      <CardActions>
        { values.like
          ? <IconButton onClick={clickLike} sx={{ margin: theme.spacing(1) }} aria-label="Like" color="secondary">
              <FavoriteIcon />
            </IconButton>
          : <IconButton onClick={clickLike} sx={{ margin: theme.spacing(1) }} aria-label="Unlike" color="secondary">
              <FavoriteBorderIcon />
            </IconButton> } <span>{values.likes}</span>
            <IconButton sx={{ margin: theme.spacing(1) }} aria-label="Comment" color="secondary">
              <CommentIcon/>
            </IconButton> <span>{values.comments.length}</span>
      </CardActions>
      <Divider/>
      {/* Pastikan props.post._id ada sebelum meneruskan ke Comments */}
      {props.post._id && <Comments postId={props.post._id} comments={values.comments} updateComments={updateComments}/>}
    </Card>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}