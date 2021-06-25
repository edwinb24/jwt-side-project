import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';

interface LoginProps {}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        console.log('Login Info Submitted');
        const response = await login({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data) return null;
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                __typename: 'Query',
                me: data.login.user,
              },
            });
            data.login.user;
          },
        });
        console.log('🚀response', response);

        if (response && response.data) {
          setAccessToken(response.data.login.accessToken);
        }

        history.push('/');
      }}>
      <div>
        <input
          value={email}
          placeholder="email"
          onChange={e => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
