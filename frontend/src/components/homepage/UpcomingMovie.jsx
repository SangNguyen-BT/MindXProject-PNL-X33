import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import PropTypes from 'prop-types';

const API_URL = 'http://localhost:5173'; // hoặc URL của backend của bạn

const MovieSection = ({ title, movies }) => (
  <Box sx={{ mb: 4 }}>
    <h1 className="text-white text-center font-bold sm:text-3xl md:text-4xl lg:text-4xl tracking-wide uppercase my-4 px-2">
      {title}
    </h1>
    <Grid container spacing={2}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie._id}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="300"
              image={movie.poster || movie.portraitImgUrl}
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

MovieSection.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      poster: PropTypes.string,
      portraitImgUrl: PropTypes.string,
      duration: PropTypes.number,
      releaseDate: PropTypes.string,
    })
  ).isRequired,
};

const UpcomingMovie = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/movies`);
        console.log('API Response:', response.data);
        
        const allMovies = response.data.data || [];
        console.log('All Movies:', allMovies);
        
        const halfLength = Math.ceil(allMovies.length / 2);
        const upcoming = allMovies.slice(0, halfLength);
        const trending = allMovies.slice(halfLength);
        
        console.log('Upcoming Movies:', upcoming);
        console.log('Trending Movies:', trending);
        
        setUpcomingMovies(upcoming);
        setTrendingMovies(trending);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
        setUpcomingMovies([]);
        setTrendingMovies([]);
      }
    };

    fetchMovies();
  }, []);

  console.log('State - Upcoming:', upcomingMovies);
  console.log('State - Trending:', trendingMovies);

  return (
    <Box sx={{ p: 3 }}>
      <MovieSection title="Upcoming Movies" movies={upcomingMovies} />
      <MovieSection title="Trending Movies" movies={trendingMovies} />
    </Box>
  );
};

export default UpcomingMovie;
