import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const UpcomingMovie = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Lấy danh sách phim sắp chiếu
        const upcomingResponse = await axios.get('/api/movies/upcoming');
        setUpcomingMovies(upcomingResponse.data);

        // Lấy danh sách phim thịnh hành
        const trendingResponse = await axios.get('/api/movies/trending');
        setTrendingMovies(trendingResponse.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
      }
    };

    fetchMovies();
  }, []);

  const MovieSection = ({ title, movies }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={3} key={movie._id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="300"
                image={movie.poster}
                alt={movie.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thời lượng: {movie.duration} phút
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <MovieSection title="Phim Sắp Chiếu" movies={upcomingMovies} />
      <MovieSection title="Phim Thịnh Hành" movies={trendingMovies} />
    </Box>
  );
};

export default UpcomingMovie;
