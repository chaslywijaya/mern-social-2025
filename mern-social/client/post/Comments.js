import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import {
    CardHeader,
    TextField,
    Avatar,
    Icon,
    useTheme // TAMBAHKAN INI
} from '@mui/material'
import PropTypes from 'prop-types'
// HAPUS BARIS INI: import {makeStyles} from '@mui/styles'
import {comment, uncomment} from './api-post.js'
import {Link} from 'react-router-dom'

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({ ... }));

export default function Comments (props) {
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const [text, setText] = useState('')
  const jwt = auth.isAuthenticated()
  const handleChange = event => {
    setText(event.target.value)
  }
  const addComment = (event) => {
    if(event.keyCode == 13 && event.target.value){
      event.preventDefault()
      comment({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, props.postId, {text: text}).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setText('')
          props.updateComments(data.comments)
        }
      })
    }
  }

  const deleteComment = comment => event => {
    uncomment({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, props.postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        props.updateComments(data.comments)
      }
    })
  }

    const commentBody = item => {
      return (
        // GANTI className DENGAN style:
        <p style={{
            backgroundColor: 'white',
            padding: theme.spacing(1),
            margin: `2px ${theme.spacing(2)}px 2px 2px`
          }}>
          <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link><br/>
          {item.text}
          <span style={{ // GANTI className DENGAN style:
              display: 'block',
              color: 'gray',
              fontSize: '0.8em'
            }}>
            {(new Date(item.created)).toDateString()} |
            {auth.isAuthenticated().user._id === item.postedBy._id &&
              <Icon
                onClick={deleteComment(item)}
                style={{ // GANTI className DENGAN style:
                  fontSize: '1.6em',
                  verticalAlign: 'middle',
                  cursor: 'pointer'
                }}
              >delete</Icon> }
          </span>
        </p>
      )
    }

    return (<div>
        <CardHeader
              avatar={
                <Avatar
                  style={{ width: 25, height: 25 }} // GANTI className DENGAN style:
                  src={'/api/users/photo/'+auth.isAuthenticated().user._id}
                />
              }
              title={ <TextField
                onKeyDown={addComment}
                multiline
                value={text}
                onChange={handleChange}
                placeholder="Write something ..."
                style={{ width: '96%' }} // GANTI className DENGAN style:
                margin="normal"
                />}
              style={{ paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) }} // GANTI className DENGAN style:
        />
        { props.comments.map((item, i) => {
            return <CardHeader
                        avatar={
                          <Avatar
                            style={{ width: 25, height: 25 }} // GANTI className DENGAN style:
                            src={'/api/users/photo/'+item.postedBy._id}
                          />
                        }
                        title={commentBody(item)}
                        style={{ paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) }} // GANTI className DENGAN style:
                        key={i}/>
              })
        }
    </div>)
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired
}