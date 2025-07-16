// D:\Kuliah\Full-Stack-React-Projects-Second-Edition-master\Chapter05\mern-social\server\express.js

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

// Import untuk SSR
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';

import { ThemeProvider } from '@mui/material/styles';
import theme from '../client/theme';
import MainRouter from '../client/MainRouter';
import Template from '../template';

// *** NEW IMPORTS FOR API ROUTES ***
import userRoutes from './routes/user.routes'; // <-- ADD THIS LINE
import authRoutes from './routes/auth.routes'; // <-- ADD THIS LINE (assuming you have auth routes)
import postRoutes from './routes/post.routes';
// *** END NEW IMPORTS ***

import path from 'path'; // Moved this up for clarity
const CURRENT_WORKING_DIR = process.cwd();


const app = express();

// Konfigurasi middleware Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Untuk melayani file statis dari dist (bundel client-side)
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

// *** IMPORTANT: MOUNT YOUR API ROUTES HERE, BEFORE THE CATCH-ALL SSR ROUTE ***
app.use('/', userRoutes); // <-- ADD THIS LINE
app.use('/', authRoutes);
app.use('/', postRoutes); // <-- ADD THIS LINE (assuming you have auth routes)
// *** END IMPORTANT ***


// Route untuk SSR (THIS SHOULD BE THE LAST GET ROUTE)
app.get('*', (req, res) => {
    const cache = createEmotionCache({ key: 'css', prepend: true });
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    let markup;
    let css = '';

    try {
        markup = ReactDOMServer.renderToString(
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <StaticRouter location={req.url}>
                        <MainRouter />
                    </StaticRouter>
                </ThemeProvider>
            </CacheProvider>
        );

        const emotionChunks = extractCriticalToChunks(markup);
        css = constructStyleTagsFromChunks(emotionChunks);

    } catch (error) {
        console.error('Error during SSR rendering:', error);
        return res.status(500).send('Internal Server Error');
    }

    res.status(200).send(Template({ markup: markup, css: css }));
});

// Catch unhandled errors (especially for JWT or other middleware)
// Make sure this is also defined. You might have it from a previous version.
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  } else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
  }
});


export default app;