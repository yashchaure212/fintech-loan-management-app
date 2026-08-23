import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { baseApi } from "@/app/api/baseApi";
import { authApi, useGetMeQuery } from "@/features/auth/authApi";

import {
  setUser,
  logout,
  setInitialized,
  setTokens,
} from "@/features/auth/authSlice";

// IMPORTANT:
// Keep the bootstrap promise alive for the lifetime of this module.
// This prevents React StrictMode from starting a second refresh request.
let bootstrapPromise = null;

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);

  const [bootstrapComplete, setBootstrapComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!bootstrapPromise) {
      bootstrapPromise = dispatch(
        authApi.endpoints.refreshToken.initiate(undefined, {
          subscribe: false,
        }),
      )
        .unwrap()
        .then((response) => {
          const newAccessToken = response?.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("Refresh response did not contain an access token");
          }

          dispatch(
            setTokens({
              accessToken: newAccessToken,
            }),
          );

          return response;
        })
        .catch((error) => {
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());

          throw error;
        });
    }

    bootstrapPromise
      .catch(() => {
        // Session restoration failed.
        // The user is simply treated as logged out.
      })
      .finally(() => {
        if (!cancelled) {
          setBootstrapComplete(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const shouldFetchMe = bootstrapComplete && Boolean(accessToken) && !user;

  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !shouldFetchMe,
  });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const currentUser = data?.data?.user;

    if (!currentUser) {
      dispatch(logout());
      dispatch(setInitialized());
      return;
    }

    dispatch(setUser(currentUser));
    dispatch(setInitialized());
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (!bootstrapComplete) {
      return;
    }

    if (!accessToken) {
      dispatch(logout());
      dispatch(setInitialized());
      return;
    }

    if (isError && !user) {
      dispatch(logout());
      dispatch(setInitialized());
    }
  }, [bootstrapComplete, accessToken, isError, user, dispatch]);

  return children;
}

export default AuthInitializer;
