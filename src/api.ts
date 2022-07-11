const API_KEY = '9cc9eaaeb46391b48b419b15f22862e7';
const BASE_PATH = 'https://api.themoviedb.org/3';

interface IMovie {
	id: number;
	backdrop_path: string;
	poster_path: string;
	title: string;
	overview: string;
}

export interface IGetMoviesResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export interface IGetMoviesPopularResult {
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export function getMovies() {
	// 영어: en-US, 한글: ko-KR
	return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`).then(response =>
		response.json()
	);
}

export function getPopularMovie() {
	return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`).then(response =>
		response.json()
	);
}
