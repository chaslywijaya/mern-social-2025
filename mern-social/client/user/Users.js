import React, {useState, useEffect} from 'react'
// HAPUS BARIS INI: import { makeStyles } from '@mui/styles'
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
    useTheme // TAMBAHKAN INI
} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Person from '@mui/icons-material/Person'
import {Link} from 'react-router-dom'
import {list} from './api-user.js'

// HAPUS SELURUH BLOK useStyles INI:
// const useStyles = makeStyles(theme => ({ ... }));

export default function Users() {
  // HAPUS BARIS INI: const classes = useStyles()
  const theme = useTheme() // TAMBAHKAN INI
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])


    return (
      <Paper
        sx={{ // GANTI className DENGAN sx:
          padding: theme.spacing(1),
          margin: theme.spacing(5)
        }}
        elevation={4}
      >
        <Typography
          variant="h6" // Gunakan variant yang sesuai, `type="title"` sudah deprecated
          sx={{ // GANTI className DENGAN sx:
            margin: theme.spacing(4, 0, 2),
            color: theme.palette.openTitle
          }}
        >
          All Users
        </Typography>
        <List dense>
          {users.map((item, i) => {
           return <Link to={"/user/" + item._id} key={i}>
                      <ListItem button>
                        <ListItemAvatar>
                          <Avatar>
                            <Person/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.name}/>
                        <ListItemSecondaryAction>
                        <IconButton>
                            <ArrowForward/>
                        </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Link>
                   })
                 }
        </List>
      </Paper>
    )
}