import React, { useState, useEffect } from 'react'
// HAPUS BARIS INI: import {makeStyles} from '@mui/styles'
import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Avatar,
    IconButton,
    Typography,
    Divider,
    useTheme
} from '@mui/material'
import Edit from '@mui/icons-material/Edit'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import { Navigate, useParams, Link } from 'react-router-dom'
import FollowProfileButton from './../user/FollowProfileButton'
import ProfileTabs from './../user/ProfileTabs'
import {listByUser} from './../post/api-post.js'

export default function Profile() {
  const theme = useTheme()
  const { userId } = useParams()

  const [values, setValues] = useState({
    user: {following:[], followers:[]}, // Pastikan user diinisialisasi sebagai objek kosong atau null
    redirectToSignin: false,
    following: false
  })
  const [posts, setPosts] = useState([])
  
  // Ambil authInfo sekali, ini bisa null/false atau objek user
  const authInfo = auth.isAuthenticated();
  const jwtToken = authInfo ? authInfo.token : null;
  const currentLoggedInUser = authInfo ? authInfo.user : null; // User yang sedang login


  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    // Jika tidak ada JWT token atau user tidak terautentikasi, mungkin kita tidak perlu memuat profil
    // Tapi jika userId ada di URL, kita tetap perlu mencoba membaca data profil tersebut
    if (!jwtToken && !userId) { // Handle case where no user is logged in AND no userId in URL (unlikely for profile page)
        setValues({...values, redirectToSignin: true});
        return;
    }

    read({
      userId: userId // Gunakan userId dari useParams
    }, {t: jwtToken}, signal).then((data) => { // Gunakan jwtToken yang sudah aman
      if (data && data.error) {
        setValues({...values, redirectToSignin: true})
      } else {
        // Hanya panggil checkFollow jika currentLoggedInUser ada
        let following = currentLoggedInUser ? checkFollow(data) : false;
        setValues({...values, user: data, following: following})
        loadPosts(data._id)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [userId, jwtToken, currentLoggedInUser ? currentLoggedInUser._id : null]) // Tambahkan jwtToken dan currentLoggedInUser._id ke dependency array

  const checkFollow = (user) => {
    // Pastikan jwt.user._id ada sebelum diakses
    if (!currentLoggedInUser || !currentLoggedInUser._id) return false;
    const match = user.followers.some((follower)=> {
      return follower._id == currentLoggedInUser._id // Gunakan currentLoggedInUser._id
    })
    return match
  }

  const clickFollowButton = (callApi) => {
    // Pastikan currentLoggedInUser._id ada sebelum digunakan
    if (!currentLoggedInUser || !currentLoggedInUser._id) {
        console.error("Not logged in to follow/unfollow.");
        return;
    }
    callApi({
      userId: currentLoggedInUser._id
    }, {
      t: jwtToken
    }, values.user._id).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, user: data, following: !values.following})
      }
    })
  }

  const loadPosts = (user) => {
    // Pastikan jwtToken ada sebelum memuat posts
    if (!jwtToken) {
        console.error("Not authenticated to load posts.");
        return;
    }
    listByUser({
      userId: user
    }, {
      t: jwtToken
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
  }
  const removePost = (post) => {
    const updatedPosts = posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts([...updatedPosts]) // Gunakan spread operator untuk membuat array baru agar React mendeteksi perubahan state
  }

  // Penting: Tambahkan null check untuk values.user sebelum mengakses _id atau properti lainnya
  const photoUrl = (values.user && values.user._id)
                    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
                    : '/api/users/defaultphoto';

  if (values.redirectToSignin) {
    return <Navigate to='/signin'/>
  }
  
  // Jika values.user belum terisi (misalnya saat initial render atau data belum fetch), tampilkan loading atau return null
  if (!values.user || !values.user._id) { // Tambahkan kondisi ini
      return (
        <Paper
          sx={{
            maxWidth: 600,
            margin: 'auto',
            padding: theme.spacing(3),
            marginTop: theme.spacing(5),
            textAlign: 'center'
          }}
          elevation={4}
        >
          <Typography variant="h6">Loading Profile...</Typography>
        </Paper>
      );
  }

  return (
    <Paper
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5)
      }}
      elevation={4}
    >
      <Typography
        variant="h6"
        sx={{
          margin: theme.spacing(2, 1, 0),
          color: theme.palette.protectedTitle,
          fontSize: '1em'
        }}
      >
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              src={photoUrl}
              sx={{ width: 60, height: 60, margin: 10 }}
            />
          </ListItemAvatar>
          <ListItemText primary={values.user.name} secondary={values.user.email}/> {
            // Perbaiki conditional check di sini agar lebih aman
            currentLoggedInUser && currentLoggedInUser._id === values.user._id // Gunakan currentLoggedInUser._id
            ? (<ListItemSecondaryAction>
                <Link to={"/user/edit/" + values.user._id}>
                  <IconButton aria-label="Edit" color="primary">
                    <Edit/>
                  </IconButton>
                </Link>
                <DeleteUser userId={values.user._id}/>
              </ListItemSecondaryAction>)
          : (<FollowProfileButton following={values.following} onButtonClick={clickFollowButton}/>)
          }
        </ListItem>
        <Divider/>
        <ListItem>
          <ListItemText primary={values.user.about} secondary={"Joined: " + (
            new Date(values.user.created)).toDateString()}/>
        </ListItem>
      </List>
      {/* Pastikan values.user ada sebelum diteruskan ke ProfileTabs */}
      {values.user && <ProfileTabs user={values.user} posts={posts} removePostUpdate={removePost}/>}
    </Paper>
  )
}