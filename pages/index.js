import Link from 'next/link'
import dayjs from 'dayjs'
import useSportEvents from '@/hooks/useSportEvents'

const GameCard = ({ id, sport, league, participants, startsAt, markets }) => (
  <tr className="border-b dark:border-neutral-500 mt-3 mb-3">
    <td>
      <div className="flex flex-row justify-start">
        {
          participants.map(({ image, name }) => (
            <img className="w-4 h-4" src={image} alt={name} />
          ))
        }
      </div>
    </td>
    <td className="whitespace-nowrap font-medium">
      <Link
        className="transition"
        href={`/games/${id}`}
      >{participants[0].name} - {participants[1].name}
      </Link>
    </td>
    <td className="whitespace-nowrap">
      {dayjs(startsAt * 1000).format('DD MMM HH:mm')}
    </td>
    {
      markets.map((market) => (
        market.marketName == "Full Time Result" &&
        market.outcomes[0].map((outcome) => (
          <td className="font-medium text-center">
            <button className="bg-gray-200 hover:bg-gray-300 transition font-medium py-1 px-2 rounded">{parseFloat(outcome.odds).toFixed(2)}</button>
          </td>
        ))
      ))
    }
  </tr>
)

export default function Home() {
  const { loading, games } = useSportEvents()
  let leagues = {}
  if (typeof games !== "undefined") {
    games.map((game) => {
      if (typeof leagues[game.league.name] == "undefined") leagues[game.league.name] = []
      leagues[game.league.name].push(game)
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main>
      {
        Object.keys(leagues).map((keyname, i) => (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2">
                <div className="overflow-hidden">
                  <h1 className="text-lg font-bold">{keyname}</h1>
                  <table className="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" className=""></th>
                        <th scope="col" className=""></th>
                        <th scope="col" className="">Time</th>
                        <th scope="col" className="text-center">1</th>
                        <th scope="col" className="text-center">X</th>
                        <th scope="col" className="text-center">2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        leagues[keyname].map((game) => (
                          <GameCard key={game.id} {...game} />
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </main>
  )
}

