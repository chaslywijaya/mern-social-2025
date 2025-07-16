import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    TextField,
    Typography,
    Avatar,
    Icon,
    IconButton,
    useTheme // TAMBAHKAN INI
} from '@mui/material'
import PropTypes from 'prop-types'
// HAPUS BARIS INI: import {makeStyles} from '@mui/styles'
import {create} from './api-post.js'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({ ... }));

export default function NewPost (props){
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const [values, setValues] = useState({
    text: '',
    photo: '',
    error: '',
    user: {}
  })
  const jwt = auth.isAuthenticated()
  useEffect(() => {
    setValues({...values, user: auth.isAuthenticated().user})
  }, [])
  const clickPost = () => {
    let postData = new FormData()
    postData.append('text', values.text)
    postData.append('photo', values.photo)
    create({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, postData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, text:'', photo: ''})
        props.addUpdate(data)
      }
    })
  }
  const handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
  }
  const photoURL = values.user._id ?'/api/users/photo/'+ values.user._id : '/api/users/defaultphoto'
    return (
    // GANTI className DENGAN sx:
    <div style={{
        backgroundColor: '#efefef',
        padding: theme.spacing(3, 0, 0.125) // theme.spacing(0.125) untuk 1px (jika base spacing 8px)
      }}>
      <Card
        sx={{ // GANTI className DENGAN sx:
          maxWidth:600,
          margin: 'auto',
          marginBottom: theme.spacing(3),
          backgroundColor: 'rgba(65, 150, 136, 0.09)',
          boxShadow: 'none'
        }}
      >
      <CardHeader
            avatar={
              <Avatar src={photoURL}/>
            }
            title={values.user.name}
            sx={{ // GANTI className DENGAN sx:
              paddingTop: theme.spacing(1),
              paddingBottom: theme.spacing(1)
            }}
          />
      <CardContent
        sx={{ // GANTI className DENGAN sx:
          backgroundColor: 'white',
          paddingTop: 0,
          paddingBottom: 0
        }}
      >
        <TextField
            placeholder="Share your thoughts ..."
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange('text')}
            sx={{ // GANTI className DENGAN sx:
              marginLeft: theme.spacing(2),
              marginRight: theme.spacing(2),
              width: '90%'
            }}
            margin="normal"
        />
        <input accept="image/*" onChange={handleChange('photo')} style={{ display: 'none' }} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file">
          <IconButton
            color="secondary"
            sx={{ height: 30, marginBottom: 5 }} // GANTI className DENGAN sx:
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label> <span sx={{ verticalAlign: 'super' }}>{values.photo ? values.photo.name : ''}</span> {/* GANTI className DENGAN sx: */}
        { values.error && (<Typography component="p" color="error">
            <Icon color="error" sx={{ verticalAlign: 'middle' }}>error</Icon> {/* Tambahkan sx jika Anda memiliki error style */}
              {values.error}
            </Typography>)
        }
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          disabled={values.text === ''}
          onClick={clickPost}
          sx={{ // GANTI className DENGAN sx:
            margin: theme.spacing(2)
          }}
        >POST</Button>
      </CardActions>
    </Card>
  </div>)

}

NewPost.propTypes = {
  addUpdate: PropTypes.func.isRequired
}