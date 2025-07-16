import React, {useEffect, useState} from 'react'
import {
    Card,
    CardActions,
    CardContent,
    Button, // <-- Button component
    TextField,
    Typography,
    Icon,
    Avatar,
    useTheme
} from '@mui/material'
import FileUpload from '@mui/icons-material/AddPhotoAlternate'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import { Navigate, useParams, useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const theme = useTheme()
  const { userId } = useParams()
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    about: '',
    photo: '',
    email: '',
    password: '',
    redirectToProfile: false,
    error: '',
    id: ''
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, id: data._id, name: data.name, email: data.email, about: data.about})
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [userId])

  const clickSubmit = () => {
    let userData = new FormData()
    values.name && userData.append('name', values.name)
    values.email && userData.append('email', values.email)
    values.password && userData.append('password', values.password)
    values.about && userData.append('about', values.about)
    values.photo && userData.append('photo', values.photo)
    update({
      userId: userId
    }, {
      t: jwt.token
    }, userData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, 'redirectToProfile': true})
      }
    })
  }
  const handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
  }
    const photoUrl = values.id
                      ? `/api/users/photo/${values.id}?${new Date().getTime()}`
                      : '/api/users/defaultphoto'
    if (values.redirectToProfile) {
      return (<Navigate to={'/user/' + values.id}/>)
    }
    return (
      <Card
        sx={{
          maxWidth: 600,
          margin: 'auto',
          textAlign: 'center',
          marginTop: theme.spacing(5),
          paddingBottom: theme.spacing(2)
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              margin: theme.spacing(2),
              color: theme.palette.protectedTitle
            }}
          >
            Edit Profile
          </Typography>
          <Avatar src={photoUrl} sx={{ width: 60, height: 60, margin: 'auto' }} /><br/>
          <input accept="image/*" onChange={handleChange('photo')} style={{ display: 'none' }} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <Button
              variant="contained"
              // OLD: color="default"
              color="primary" // <-- CHANGE THIS LINE to 'primary', 'secondary', or 'inherit'
              component="span"
            >
              Upload
              <FileUpload/>
            </Button>
          </label> <span sx={{ marginLeft:'10px' }}>{values.photo ? values.photo.name : ''}</span><br/>
          <TextField id="name" label="Name" sx={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1), width: 300 }} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="About"
            multiline
            rows="2"
            value={values.about}
            onChange={handleChange('about')}
            sx={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1), width: 300 }}
            margin="normal"
          /><br/>
          <TextField id="email" type="email" label="Email" sx={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1), width: 300 }} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" sx={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1), width: 300 }} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" sx={{ verticalAlign: 'middle' }}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} sx={{ margin: 'auto', marginBottom: theme.spacing(2) }}>Submit</Button>
        </CardActions>
      </Card>
    )
}