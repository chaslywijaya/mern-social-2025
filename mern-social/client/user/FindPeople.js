import React, {useState, useEffect} from 'react'
// HAPUS BARIS INI: import {makeStyles} from '@mui/styles'
import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Avatar,
    Button,
    IconButton,
    Typography,
    Snackbar, // Ubah import Snackbar
    useTheme // TAMBAHKAN INI
} from '@mui/material'
import {Link} from 'react-router-dom'
import {findPeople, follow} from './api-user.js'
import auth from './../auth/auth-helper'
import ViewIcon from '@mui/icons-material/Visibility'

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({ ... }));

export default function FindPeople() {
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const [values, setValues] = useState({
    users: [],
    open: false,
    followMessage: ''
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    findPeople({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setValues({...values, users:data})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [])
  const clickFollow = (user, index) => {
    follow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, user._id).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        let toFollow = values.users
        toFollow.splice(index, 1)
        setValues({...values, users: toFollow, open: true, followMessage: `Following ${user.name}!`})
      }
    })
  }
  const handleRequestClose = (event, reason) => {
    setValues({...values, open: false })
  }
    return (<div>
      <Paper
        sx={{ // GANTI className DENGAN sx. Untuk mixins.gutters, terapkan propertinya langsung
            padding: theme.spacing(1),
            margin: 0
            // Jika theme.mixins.gutters memiliki properti lain, tambahkan di sini
            // Misalnya: breakpoints: { xs: 0, sm: theme.breakpoints.values.sm, md: theme.breakpoints.values.md },
        }}
        elevation={4}
      >
        <Typography
          variant="h6" // Gunakan variant yang sesuai, `type="title"` sudah deprecated
          sx={{ // GANTI className DENGAN sx:
            margin: theme.spacing(3, 1, 2),
            color: theme.palette.openTitle,
            fontSize: '1em'
          }}
        >
          Who to follow
        </Typography>
        <List>
          {values.users.map((item, i) => {
              return <span key={i}>
                <ListItem>
                  <ListItemAvatar
                    sx={{ marginRight: theme.spacing(1) }} // GANTI className DENGAN sx:
                  >
                      <Avatar src={'/api/users/photo/'+item._id}/>
                  </ListItemAvatar>
                  <ListItemText primary={item.name}/>
                  <ListItemSecondaryAction
                    sx={{ right: theme.spacing(2) }} // GANTI className DENGAN sx:
                  >
                    <Link to={"/user/" + item._id}>
                      <IconButton
                        variant="contained"
                        color="secondary"
                        sx={{ verticalAlign: 'middle' }} // GANTI className DENGAN sx:
                      >
                        <ViewIcon/>
                      </IconButton>
                    </Link>
                    <Button aria-label="Follow" variant="contained" color="primary" onClick={()=> {clickFollow(item, i)}}>
                      Follow
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </span>
            })
          }
        </List>
      </Paper>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={values.open}
          onClose={handleRequestClose}
          autoHideDuration={6000}
          message={<span sx={{ color: theme.palette.protectedTitle }}>{values.followMessage}</span>} // GANTI className DENGAN sx:
      />
    </div>)
}