export default (
  { graphQLErrors, networkError, operation, forward },
  nuxtContext
) => {
  console.log(graphQLErrors, networkError, operation, forward) // eslint-disable-line
}
