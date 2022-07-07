import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Wrapper = styled.div`
	background: black;
`;

const Loader = styled.div`
	height: 24vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
	background-size: cover;
`;

const Title = styled.h2`
	font-size: 60px;
	font-weight: bold;
	margin-bottom: 20px;
	font-family: 'Hahmlet-Bold';
`;
const Overview = styled.p`
	font-size: 20px;
	width: 50vw;
	font-family: 'Hahmlet-Regular';
`;

const Slider = styled.div`
	position: relative;
	top: -100px;
`;

const SubTitle = styled.p`
	font-size: 40px;
	width: 50vw;
	font-family: 'Hahmlet-Regular';
	margin: 10px;
`;

const Row = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 5px;
	width: 100%;
	position: absolute;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
	background-color: white;
	height: 350px;
	/* height: 150px; */
	color: red;
	font-size: 60px;
	background-image: url(${props => props.bgPhoto});
	background-size: cover;
	background-position: center center;
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
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
		y: -50,
		transition: {
			delay: 0.5,
			duration: 0.3,
			type: 'tween'
		}
	}
};

const offset = 6;

function Home() {
	const { data, isLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);

	const increaseIndex = () => {
		if (data) {
			if (leaving) return;
			const totalMovies = data?.results.length;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setLeaving(true);
			setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
		}
	};

	const toggleLeaving = () => setLeaving(prev => !prev);
	return (
		<Wrapper>
			{isLoading ? (
				<Loader>Loading</Loader>
			) : (
				<>
					<Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')} onClick={increaseIndex}>
						<Title>{data?.results[0].title}</Title>
						<Overview>{data?.results[0].overview}</Overview>
					</Banner>
					<Slider>
						<SubTitle>Now Playing!</SubTitle>
						<AnimatePresence initial={false} onExitComplete={toggleLeaving}>
							<Row
								variants={rowVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ type: 'tween', duration: 1 }}
								key={index}
							>
								{data?.results
									.slice(1)
									.slice(offset * index, offset * index + offset)
									.map(movie => (
										<Box
											key={movie.id}
											bgPhoto={makeImagePath(movie.poster_path || '', 'w500')}
											// bgPhoto={makeImagePath(movie.backdrop_path || '', 'w500')}
											variants={boxVariants}
											transition={{ type: 'tween' }}
											initial="normal"
											whileHover="hover"
										/>
									))}
							</Row>
						</AnimatePresence>
					</Slider>
				</>
			)}
		</Wrapper>
	);
}

export default Home;
