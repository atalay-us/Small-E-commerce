import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="not-found-overlay">
      <div className="not-found-container">
        <p>404 NOT FOUND</p>
        <Link to={"/"}>Return to homepage</Link>
      </div>
    </div>
  )
}

export default NotFound