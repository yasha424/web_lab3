import { gql } from '@apollo/client'

export class QUERIES {
    static QUERY_Get_All = () => `
  		query MyQuery {
    		lab3_movies {
      			title
      			director
      			budget
      			gross
      			id
    		}
  		}
	`

    static MUTATION_Insert = (title, director, budget, gross) =>
        `mutation MyMutation {
            insert_lab3_movies(objects: {title: "${title}", director: "${director}", budget: "${budget}", gross: "${gross}"}) {
                returning {
                    title
                    director
                    budget
                    gross
                    id
                }
            }
        }
    `

    static SUBSCRIPTION_All_Movies = gql`
        subscription MySubscription {
            lab3_movies {
                title
                director
                budget
                gross
            }
        }
    `
}
