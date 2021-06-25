import React from 'react';
import { Link } from 'react-router-dom';
import { setAccessToken } from './accessToken';
import { useLogoutMutation, useMeQuery } from './generated/graphql';

interface Props {}

export const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  let body: any = null;
  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>You are login as: {data.me.email}</div>;
  } else {
    body = <div>Not logged in</div>;
  }

  return (
    <header>
      <div>
        <Link to="/">home</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/bye">Bye</Link>
      </div>
      <div>
        <button
          onClick={async () => {
            await logout;
            setAccessToken('');
            await client!.resetStore();
          }}>
          Logout
        </button>
      </div>
      {body}
    </header>
  );
};
