import { gql, useQuery } from '@apollo/client'
import dictionaries from '@/dictionaries'
import { aggregateOutcomesByMarkets } from '@azuro-org/toolkit'

// this query retrieves data for 10 upcoming events that have not yet started
const QUERY = `
  query Games($where: Game_filter!) {
    games(first: 1000, where: $where) {
      id
      sport {
        name
      }
      league {
        name
        country {
          name
        }
      }
      participants {
        name
        image
      }
      startsAt
      liquidityPool {
        address
      }
      conditions {
        conditionId
        status
        outcomes {
          id
          outcomeId
          odds
        }
      }
    }
  }
`

export default function useSportEvents() {

  let data = useQuery(gql`${QUERY}`, {
    variables: {
      where: {
        // note that the value of "startAt" is in seconds
        startsAt_gt: Math.floor(Date.now() / 1000),
        sport_: { name: 'Football' },
      },
    },
  })

  let { loading } = data
  let games

  if (data.data?.games && data.data.games.length > 0) {
    games = data.data.games.map((game) => {
        
      const { id, sport, league, participants, startsAt, liquidityPool, conditions } = game
      let markets = aggregateOutcomesByMarkets({
        lpAddress: liquidityPool.address,
        conditions,
        dictionaries,
      })

      game = { id, sport, league, participants, startsAt, markets }
      return game
    })
  }

  return { loading, games }
}
