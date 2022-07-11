import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, getPopularMovie, IGetMoviesPopularResult, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const Wrapper = styled.div`
	background: black;
	padding-bottom: 200px;
`;

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgphoto});
	background-size: cover;
`;

const Title = styled.h2`
	font-size: 60px;
	margin-bottom: 20px;
	/* font-weight: bold; */
	font-family: 'Hahmlet-Bold';
`;
const Overview = styled.p`
	font-size: 20px;
	width: 50%;
	font-family: 'Hahmlet-Regular';
`;

const Slider = styled.div`
	position: relative;
	top: -100px;
	width: 100%;
	margin: auto;
`;

const SubTitle = styled.p`
	font-size: 40px;
	width: 50vw;
	font-family: 'Hahmlet-Regular';
	margin: 10px;
`;

const Row = styled(motion.div)`
	display: grid;
	gap: 5px;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
	height: 500px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
	background-color: white;
	/* height: 150px; */
	background-image: url(${props => props.bgphoto});
	background-size: cover;
	background-position: center center;
	height: 400px;
	cursor: pointer;
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
`;

const NextButton = styled(motion.div)`
	height: 400px;
	width: 50px;
	cursor: pointer;
	position: absolute;
	right: 0;
	background-color: ${props => props.theme.black.lighter};
	text-align: center;
	font-size: 60px;
	display: flex;
	align-items: center;
	font-family: 'Hahmlet-Bold';
	font-weight: bold;
	padding-left: 10px;
`;

const Info = styled(motion.div)`
	padding: 10px;
	background-color: ${props => props.theme.black.lighter};
	opacity: 0;
	position: absolute;
	width: 100%;
	bottom: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`;

const BigMovie = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 80vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${props => props.theme.black.lighter};
`;

const BigCover = styled.img`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`;

const BigTitle = styled.h3`
	color: ${props => props.theme.white.lighter};
	padding: 20px;
	font-size: 46px;
	position: relative;
	top: -80px;
	font-family: 'Hahmlet-Bold';
`;

const BigOverview = styled.p`
	padding: 20px;
	position: relative;
	top: -80px;
	color: ${props => props.theme.white.lighter};
	font-family: 'Hahmlet-Regular';
`;

const rowVariants = {
	hidden: { x: window.outerWidth + 5 },
	visible: { x: 0 },
	exit: { x: -window.outerWidth - 5 }
};

const boxVariants = {
	normal: {
		scale: 1
	},
	hover: {
		scale: 1.3,
		y: -80,
		transition: {
			delay: 0.3,
			duaration: 0.1,
			type: 'tween'
		}
	}
};

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.3,
			duaration: 0.1,
			type: 'tween'
		}
	}
};

const offset = 6;

function Home() {
	const history = useHistory(); // url 변경을 위한 변수
	const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
	const popularMatch = useRouteMatch<{ movieId: string }>('/popularMovies/:movieId');
	const { data: nowData, isLoading: nowLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
	const { data: popularData, isLoading: popularLoading } = useQuery<IGetMoviesPopularResult>(
		['movies', 'popularMovie'],
		getPopularMovie
	);

	const [index, setIndex] = useState(0);
	const [popularIndex, setPopularIndex] = useState(0);

	const [leaving, setLeaving] = useState(false);
	const [popularleaving, setPopularleaving] = useState(false);
	const { scrollY } = useViewportScroll();

	const increaseIndex = (type: string) => {
		if (type === 'now' && nowData) {
			if (leaving) return;
			toggleLeaving('now');
			const totalMovies = nowData.results.length;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
		}

		if (type === 'popular' && popularData) {
			if (popularleaving) return;
			toggleLeaving('popular');
			const totalMovies = popularData.results.length;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setPopularIndex(prev => (prev === maxIndex ? 0 : prev + 1));
		}
	};

	const toggleLeaving = (type: string) => {
		if (type === 'now') {
			setLeaving(prev => !prev);
		}
		if (type === 'popular') {
			setPopularleaving(prev => !prev);
		}
	};

	const onBoxClicked = (movieId: number, type: string) => {
		if (type === 'now') history.push(`/movies/${movieId}`);
		if (type === 'popular') history.push(`/popularMovies/${movieId}`);
	};

	const clickedMovie =
		bigMovieMatch?.params.movieId && nowData?.results.find(movie => movie.id === +bigMovieMatch.params.movieId);

	const clickedPopularMovie =
		popularMatch?.params.movieId && popularData?.results.find(movie => movie.id === +popularMatch.params.movieId);

	const onOverlayClick = () => history.push('/');
	return (
		<Wrapper>
			{nowLoading && popularLoading ? (
				<Loader>Loading</Loader>
			) : (
				<>
					<Banner bgphoto={makeImagePath(nowData?.results[0].backdrop_path || '')}>
						<Title>{nowData?.results[0].title}</Title>
						<Overview>{nowData?.results[0].overview}</Overview>
					</Banner>
					<Slider>
						{/* 현재 상영작 */}
						<SubTitle>Now Playing!</SubTitle>
						<AnimatePresence initial={false} onExitComplete={() => toggleLeaving('now')}>
							<Row
								variants={rowVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ type: 'tween', duration: 1 }}
								key={index}
							>
								{nowData?.results
									.slice(1)
									.slice(offset * index, offset * index + offset)
									.map(movie => (
										<Box
											key={`now_${movie.id}`}
											bgphoto={makeImagePath(movie.poster_path || '', 'w500')}
											variants={boxVariants}
											transition={{ type: 'tween' }}
											initial="normal"
											whileHover="hover"
											onClick={() => onBoxClicked(movie.id, 'now')}
											layoutId={`now_${movie.id}`}
										>
											<Info variants={infoVariants}>
												<h4>{movie.title}</h4>
											</Info>
										</Box>
									))}
							</Row>
							<NextButton onClick={() => increaseIndex('now')} style={{ opacity: 0.8 }}>
								》
							</NextButton>
						</AnimatePresence>

						{/* 인기영화 */}
						<SubTitle style={{ marginTop: '450px' }}>Popular</SubTitle>
						<AnimatePresence initial={false} onExitComplete={() => toggleLeaving('popular')}>
							<Row
								variants={rowVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ type: 'tween', duration: 1 }}
								key={popularIndex}
							>
								{popularData?.results
									.slice(1)
									.slice(offset * popularIndex, offset * popularIndex + offset)
									.map(movie => (
										<Box
											key={`popular_${movie.id}`}
											bgphoto={makeImagePath(movie.poster_path || '', 'w500')}
											variants={boxVariants}
											transition={{ type: 'tween' }}
											initial="normal"
											whileHover="hover"
											onClick={() => onBoxClicked(movie.id, 'popular')}
											layoutId={`popular_${movie.id}`}
										>
											<Info variants={infoVariants}>
												<h4>{movie.title}</h4>
											</Info>
										</Box>
									))}
							</Row>
							<NextButton onClick={() => increaseIndex('popular')} style={{ opacity: 0.8 }}>
								》
							</NextButton>
						</AnimatePresence>
					</Slider>

					{/* 현재 상영작 */}
					<AnimatePresence>
						{bigMovieMatch ? (
							<>
								<Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
								<BigMovie
									style={{ top: scrollY.get() + 100 }}
									layoutId={`now_${bigMovieMatch.params.movieId}`}
								>
									{clickedMovie && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
														clickedMovie.backdrop_path,
														'w500'
													)})`
												}}
											/>
											<BigTitle>{clickedMovie.title}</BigTitle>
											<BigOverview>{clickedMovie.overview}</BigOverview>
										</>
									)}
								</BigMovie>
							</>
						) : null}

						{popularMatch ? (
							<>
								<Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
								<BigMovie
									style={{ top: scrollY.get() + 100 }}
									layoutId={`popular_${popularMatch.params.movieId}`}
								>
									{clickedPopularMovie && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
														clickedPopularMovie.backdrop_path,
														'w500'
													)})`
												}}
											/>
											<BigTitle>{clickedPopularMovie.title}</BigTitle>
											<BigOverview>{clickedPopularMovie.overview}</BigOverview>
										</>
									)}
								</BigMovie>
							</>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

export default Home;
