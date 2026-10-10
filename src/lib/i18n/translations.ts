import type { Locale } from '#lib/types/year.js';

const NUMBER_WORDS: Record<Locale, string[]> = {
	'pt-BR': [
		'zero',
		'um',
		'dois',
		'três',
		'quatro',
		'cinco',
		'seis',
		'sete',
		'oito',
		'nove',
		'dez',
		'onze',
		'doze',
		'treze',
		'catorze',
		'quinze',
		'dezesseis',
		'dezessete',
		'dezoito',
		'dezenove',
		'vinte'
	],
	en: [
		'zero',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
		'ten',
		'eleven',
		'twelve',
		'thirteen',
		'fourteen',
		'fifteen',
		'sixteen',
		'seventeen',
		'eighteen',
		'nineteen',
		'twenty'
	]
};

/** Small counts as words for editorial copy ("Ten years…"); larger ones stay numeric. */
function numberWord(n: number, locale: Locale): string {
	return NUMBER_WORDS[locale][n] ?? String(n);
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

const ptBR = {
	siteName: 'Year in Music',
	siteTagline: 'Um arquivo pessoal de álbuns do ano',
	heroTitle: 'Meus álbuns do ano',
	topN: (n: number) => `Top ${n}`,
	statsKicker: 'Estatísticas',
	albumsRated: 'álbuns avaliados',
	vsYear: (year: number) => `vs. ${year}`,
	amazing: 'Incríveis',
	greatOrBetter: 'Ótimos ou melhores',
	distributionTitle: 'Distribuição das notas',
	ratingColumn: 'Nota',
	countColumn: 'Álbuns',
	rankingKicker: 'O ranking',
	rankingTitle: (n: number) => `Os ${n} melhores álbuns`,
	bonusKicker: 'Bônus',
	bonusListLabel: 'Álbuns bônus',
	fullListOnRym: 'Lista completa no RateYourMusic',
	songsKicker: 'Playlist',
	bestSongs: (year: number) => `Melhores músicas de ${year}`,
	oneSongPerArtist: 'Uma música por artista.',
	openInSpotify: 'Abrir no Spotify',
	playlistEmbedTitle: (year: number) => `Playlist no Spotify: melhores músicas de ${year}`,
	archiveKicker: (first: number) => `Desde ${first}`,
	archiveTitle: 'O arquivo',
	archiveLink: 'Arquivo',
	statsLink: 'Estatísticas',
	/** Header label on phones, where the full word would crowd the bar. */
	statsLinkShort: 'Números',
	acrossTitle: 'Ao longo dos anos',
	acrossTagline: (years: number) =>
		years === 1
			? 'Um ano ouvindo, avaliando e escolhendo meus discos favoritos.'
			: `${capitalize(numberWord(years, 'pt-BR'))} anos ouvindo, avaliando e escolhendo meus discos favoritos.`,
	acrossDescription: (first: number, latest: number) =>
		`Um olhar estatístico e editorial sobre as listas anuais de música do Dan Eisenberg, de ${first} a ${latest}.`,
	bigPictureKicker: 'O panorama',
	yearsLabel: 'Anos',
	byYearKicker: 'Por ano',
	listenedTitle: 'Álbuns avaliados por ano',
	listenedLede: 'Álbuns avaliados a cada ano.',
	/** "2017, 2019 e 2021" */
	joinList: (items: string[]) =>
		items.length <= 1
			? (items[0] ?? '')
			: `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`,
	mostActiveKicker: 'Ano mais ativo',
	mostActiveCopy: (year: string, total: number) =>
		`${year} foi o ano com mais álbuns avaliados: ${total}.`,
	mostActiveTieCopy: (years: string, total: number) =>
		`${years} empataram como os anos com mais álbuns avaliados, ${total} cada.`,
	highLowKicker: 'O auge e o vale',
	strongestCopy: (year: string, pct: string) =>
		`${year} teve a maior proporção de álbuns com nota 4,0 ou superior: ${pct}.`,
	strongestTieCopy: (years: string, pct: string) =>
		`${years} dividiram a maior proporção de álbuns com nota 4,0 ou superior: ${pct}.`,
	toughestCopy: (year: string, pct: string) => `${year} teve a menor, ${pct}.`,
	toughestTieCopy: (years: string, pct: string) => `${years} dividiram a menor, ${pct}.`,
	recurringSoundKicker: 'O som recorrente',
	topGenreCopy: (genre: string, albums: number) =>
		`${genre} apareceu em ${albums} álbuns ranqueados, mais do que qualquer outro gênero principal.`,
	topGenreTieCopy: (genres: string, albums: number) =>
		`${genres} empataram como os gêneros principais mais frequentes, em ${albums} álbuns ranqueados cada.`,
	greatShareTitle: 'Ótimos ou melhores',
	greatShareLede: 'Parcela dos álbuns avaliados com nota 4,0 ou mais.',
	rarestKicker: 'A nota mais rara',
	amazingTitle: 'Incríveis',
	amazingLede: 'Álbuns com nota 5,0 em cada ano.',
	allYearsKicker: 'Todos os anos',
	profileTitle: 'Distribuição das notas',
	profileLede: (total: string) => `Todas as notas dadas a ${total} álbuns.`,
	artistsKicker: 'Artistas',
	recurringTitle: 'Presenças recorrentes',
	recurringLede: 'Quem mais voltou às listas anuais.',
	appearances: (n: number) => (n === 1 ? '1 presença' : `${n} presenças`),
	topFiveTimes: (n: number) => `${n}× Top 5`,
	genresKicker: 'Gêneros',
	soundTitle: 'O som dos anos',
	soundLede: (albums: number) => `Gêneros principais dos ${albums} álbuns ranqueados.`,
	albumsCount: (n: number) => (n === 1 ? '1 álbum' : `${n} álbuns`),
	winnersKicker: 'O nº 1 de cada ano',
	winnersTitle: 'Os vencedores',
	openYear: (year: number) => `Abrir ${year}`,
	albumsRatedIn: (year: number, n: number) => `${year}: ${n} álbuns avaliados`,
	greatShareIn: (year: number, pct: string) => `${year}: ${pct} com nota 4,0 ou mais`,
	amazingIn: (year: number, n: number) =>
		`${year}: ${n === 1 ? '1 álbum' : `${n} álbuns`} com nota 5,0`,
	comingSoon: 'Em breve',
	currentYear: 'Ano atual',
	previousYear: 'Ano anterior',
	nextYear: 'Próximo ano',
	listenOnSpotify: 'Ouvir no Spotify',
	openInAppleMusic: 'Abrir no Apple Music',
	openOnBandcamp: 'Abrir no Bandcamp',
	viewOnRym: 'Ver no RateYourMusic',
	artworkAlt: (album: string, artist: string) => `Capa de ${album}, de ${artist}`,
	albumOnRym: (album: string) => `${album} no RateYourMusic`,
	opensInNewTab: 'abre em nova aba',
	languageLabel: 'Idioma',
	skipToContent: 'Ir para o conteúdo',
	notFoundTitle: 'Ano não encontrado',
	notFoundBody: 'Esse ano ainda não existe no arquivo.',
	backToNewest: 'Voltar ao ano mais recente',
	footerNote: 'Notas no RateYourMusic, playlists no Spotify.',
	pageDescription: (year: number) => `Os melhores álbuns e músicas de ${year}, segundo o Dan.`
};

type Dictionary = typeof ptBR;

const en: Dictionary = {
	siteName: 'Year in Music',
	siteTagline: 'A personal archive of albums of the year',
	heroTitle: 'My albums of the year',
	topN: (n) => `Top ${n}`,
	statsKicker: 'Statistics',
	albumsRated: 'albums rated',
	vsYear: (year) => `vs. ${year}`,
	amazing: 'Amazing',
	greatOrBetter: 'Great or better',
	distributionTitle: 'Rating distribution',
	ratingColumn: 'Rating',
	countColumn: 'Albums',
	rankingKicker: 'The ranking',
	rankingTitle: (n) => `The ${n} best albums`,
	bonusKicker: 'Bonus',
	bonusListLabel: 'Bonus albums',
	fullListOnRym: 'Full list on RateYourMusic',
	songsKicker: 'Playlist',
	bestSongs: (year) => `Best songs of ${year}`,
	oneSongPerArtist: 'One song per artist.',
	openInSpotify: 'Open in Spotify',
	playlistEmbedTitle: (year) => `Spotify playlist: best songs of ${year}`,
	archiveKicker: (first) => `Since ${first}`,
	archiveTitle: 'The archive',
	archiveLink: 'Archive',
	statsLink: 'Stats',
	statsLinkShort: 'Stats',
	acrossTitle: 'Across the years',
	acrossTagline: (years) =>
		years === 1
			? 'One year of listening, rating and choosing my favorite records.'
			: `${capitalize(numberWord(years, 'en'))} years of listening, rating and choosing my favorite records.`,
	acrossDescription: (first, latest) =>
		`A statistical, editorial look across Dan Eisenberg's annual music lists, ${first} to ${latest}.`,
	bigPictureKicker: 'The big picture',
	yearsLabel: 'Years',
	byYearKicker: 'By year',
	listenedTitle: 'Albums rated by year',
	listenedLede: 'Albums rated each year.',
	joinList: (items) =>
		items.length <= 1
			? (items[0] ?? '')
			: `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`,
	mostActiveKicker: 'Most active year',
	mostActiveCopy: (year, total) => `${year} led with ${total} albums rated, the most of any year.`,
	mostActiveTieCopy: (years, total) => `${years} tied for the most albums rated, at ${total} each.`,
	highLowKicker: 'The high and the low',
	strongestCopy: (year, pct) => `${year} had the highest Great-or-better rate at ${pct}.`,
	strongestTieCopy: (years, pct) => `${years} shared the highest Great-or-better rate at ${pct}.`,
	toughestCopy: (year, pct) => `${year} had the lowest, at ${pct}.`,
	toughestTieCopy: (years, pct) => `${years} shared the lowest, at ${pct}.`,
	recurringSoundKicker: 'The recurring sound',
	topGenreCopy: (genre, albums) =>
		`${genre} appeared on ${albums} ranked albums, more than any other primary genre.`,
	topGenreTieCopy: (genres, albums) =>
		`${genres} tied as the most frequent primary genres, on ${albums} ranked albums each.`,
	greatShareTitle: 'Great or better',
	greatShareLede: 'Share of the albums rated that scored 4.0 or higher.',
	rarestKicker: 'The rarest rating',
	amazingTitle: 'Amazing',
	amazingLede: 'Albums rated 5.0 in each year.',
	allYearsKicker: 'All years',
	profileTitle: 'Rating distribution',
	profileLede: (total) => `Every rating given to ${total} albums.`,
	artistsKicker: 'Artists',
	recurringTitle: 'Repeat appearances',
	recurringLede: 'Who kept coming back to the yearly lists.',
	appearances: (n) => (n === 1 ? '1 appearance' : `${n} appearances`),
	topFiveTimes: (n) => `${n}× Top 5`,
	genresKicker: 'Genres',
	soundTitle: 'The sound of the years',
	soundLede: (albums) => `Primary genres across the ${albums} ranked albums.`,
	albumsCount: (n) => (n === 1 ? '1 album' : `${n} albums`),
	winnersKicker: "Every year's #1",
	winnersTitle: 'The winners',
	openYear: (year) => `Open ${year}`,
	albumsRatedIn: (year, n) => `${year}: ${n} albums rated`,
	greatShareIn: (year, pct) => `${year}: ${pct} rated 4.0 or higher`,
	amazingIn: (year, n) => `${year}: ${n === 1 ? '1 album' : `${n} albums`} rated 5.0`,
	comingSoon: 'Coming soon',
	currentYear: 'Current year',
	previousYear: 'Previous year',
	nextYear: 'Next year',
	listenOnSpotify: 'Listen on Spotify',
	openInAppleMusic: 'Open in Apple Music',
	openOnBandcamp: 'Open on Bandcamp',
	viewOnRym: 'View on RateYourMusic',
	artworkAlt: (album, artist) => `Cover of ${album} by ${artist}`,
	albumOnRym: (album) => `${album} on RateYourMusic`,
	opensInNewTab: 'opens in a new tab',
	languageLabel: 'Language',
	skipToContent: 'Skip to content',
	notFoundTitle: 'Year not found',
	notFoundBody: 'That year is not in the archive yet.',
	backToNewest: 'Back to the newest year',
	footerNote: 'Ratings on RateYourMusic, playlists on Spotify.',
	pageDescription: (year) => `The best albums and songs of ${year}, according to Dan.`
};

export const translations: Record<Locale, Dictionary> = { 'pt-BR': ptBR, en };
export type { Dictionary };
