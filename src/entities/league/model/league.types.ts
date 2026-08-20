import emblemImage from '/emblem/pl.webp'

interface leagueListProps {
  name: string
  id: number
  // season: number
  // webp image
  emblemImage: string
}

const leagueList: leagueListProps[] = [
  {
    name: 'pl',
    id: 39,
    // season: 2024, // 26년 기준 최신
    emblemImage,
  },
]

export { leagueList, type leagueListProps }
