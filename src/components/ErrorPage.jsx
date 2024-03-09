import { useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  console.log(error);

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occured.</p>
      <p>
        <i>
          {error.status} - {error.statusText || error.message}
        </i>
      </p>
    </div>
  );
}

export default ErrorPage;
