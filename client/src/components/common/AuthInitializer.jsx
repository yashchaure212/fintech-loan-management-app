import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import {
  useGetMeQuery,
  useRefreshTokenMutation,
} from "@/features/auth/authApi";
import {
  setUser,
  logout,
  setInitialized,
  setTokens,
} from "@/features/auth/authSlice";
import { storage } from "@/utils/storage";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [bootstrapComplete, setBootstrapComplete] = useState(false);
  const [refreshSession] = useRefreshTokenMutation();

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      const accessToken = storage.getAccessToken();
      const refreshToken = storage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        if (!cancelled) {
          dispatch(setInitialized());
          setBootstrapComplete(true);
        }
        return;
      }

      if (!accessToken && refreshToken) {
        try {
          const response = await refreshSession({ refreshToken }).unwrap();

          if (!cancelled) {
            dispatch(
              setTokens({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
              }),
            );
          }
        } catch {
          if (!cancelled) {
            dispatch(logout());
            dispatch(setInitialized());
            setBootstrapComplete(true);
          }

          return;
        }
      }

      if (!cancelled) {
        setBootstrapComplete(true);
      }
    }

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [dispatch, refreshSession]);

  const shouldFetchMe =
    bootstrapComplete && Boolean(storage.getAccessToken());

  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !shouldFetchMe,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      dispatch(setUser(data.data.user));
      dispatch(setInitialized());
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (!bootstrapComplete) {
      return;
    }

    if (!storage.getAccessToken() && !storage.getRefreshToken()) {
      dispatch(setInitialized());
      return;
    }

    if (isError) {
      dispatch(logout());
      dispatch(setInitialized());
    }
  }, [bootstrapComplete, isError, dispatch]);

  return children;
}

export default AuthInitializer;
