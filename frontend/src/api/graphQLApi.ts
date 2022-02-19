import axios from "axios"

const graphQLAxios = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8341/graphql"
})

interface GraphQLResponse<T> {
  data: T
  errors: any | null
}

const graphQLApi = <I, R>({ query }: Query<I, R>, variables: I): Promise<R> => {
  return graphQLAxios.post<GraphQLResponse<R>>("", {
    query,
    variables
  })
  .then(r => {
    if (r.data.errors != null) {
      console.log(r.data.errors.map((e: any) => e.message).join("\n"))
      throw Error(r.data.errors)
    }
    return r.data.data
  })
}

export interface Query<I, R> {
  query: string
}

export default graphQLApi
