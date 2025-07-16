import React, {useState, useEffect} from 'react'
// HAPUS BARIS INI: import {makeStyles} from '@mui/styles'
import {
    Card,
    Typography,
    Divider,
    useTheme // TAMBAHKAN INI
} from '@mui/material'
import auth from './../auth/auth-helper'
import PostList from './PostList'
import {listNewsFeed} from './api-post.js'
import NewPost from './NewPost'

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({ ... }));

export default function Newsfeed () {
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const [posts, setPosts] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listNewsFeed({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [])

  const addPost = (post) => {
    const updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }
  const removePost = (post) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

    return (
      <Card
        sx={{ // GANTI className DENGAN sx:
          margin: 'auto',
          paddingTop: 0,
          paddingBottom: theme.spacing(3)
        }}
      >
        <Typography
          variant="h6" // Gunakan variant="h6" atau "body1" atau "subtitle1" (typography type sudah deprecated)
          sx={{ // GANTI className DENGAN sx:
            padding: theme.spacing(3, 2.5, 2),
            color: theme.palette.openTitle,
            fontSize: '1em'
          }}
        >
          Newsfeed
        </Typography>
        <Divider/>
        <NewPost addUpdate={addPost}/>
        <Divider/>
        <PostList removeUpdate={removePost} posts={posts}/>
      </Card>
    )
}