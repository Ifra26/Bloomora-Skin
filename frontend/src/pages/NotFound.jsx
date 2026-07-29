import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container section empty-state">
      <span className="eyebrow">404</span>
      <h1>This page isn't in the formulation book.</h1>
      <Link to="/" className="btn btn-primary btn-sm">Back to home</Link>
    </div>
  );
}
