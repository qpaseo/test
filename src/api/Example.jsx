
function Example() {
    const { isPending, error, data, isFetching } = useQuery({
      queryKey: ['repoData'],
      queryFn: async () => {
        const response = await fetch(
          'https://api.github.com/repos/Dukami-Bilidu/bilidu-front',
        )
        return await response.json()
      },
    })
  
    if (isPending) return 'Loading...'
  
    if (error) return 'An error has occurred: ' + error.message
  
    return (
      <div>
        <h1>{data.full_name}</h1>
        <p>{data.description}</p>
        <strong>👀 {data.subscribers_count}</strong>{' '}
        <strong>✨ {data.stargazers_count}</strong>{' '}
        <strong>🍴 {data.forks_count}</strong>
        <div>{isFetching ? 'Updating...' : ''}</div>
      </div>
    )
  }
  
  export default Example