const Homepage = ({user}) => {
  return (
    <div>
        {user ? <h1>Welcome, {user.username}!</h1> : <h1>Welcome to the Homepage!</h1>}
    </div>
  )
}

export default Homepage