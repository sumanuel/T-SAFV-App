import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import sdk from "../lib/tsafv-sdk";

const AppSessionContext = createContext(null);

function decodeBase64(value) {
  if (typeof global.atob === "function") {
    return global.atob(value);
  }

  if (typeof atob === "function") {
    return atob(value);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString("binary");
  }

  return "";
}

function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      decodeBase64(normalized)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function AppSessionProvider({ token, onSignOut, children }) {
  const [associations, setAssociations] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activeAssociationId, setActiveAssociationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSyncAt, setLastSyncAt] = useState(null);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [associationsRes, invitationsRes] = await Promise.all([
        sdk.getMyAssociations(token),
        sdk.getMyInvitations(token),
      ]);

      const nextAssociations =
        associationsRes.status === 200 ? associationsRes.data || [] : [];
      const nextInvitations =
        invitationsRes.status === 200 ? invitationsRes.data || [] : [];

      setAssociations(nextAssociations);
      setInvitations(nextInvitations);
      setLastSyncAt(new Date().toISOString());
      setActiveAssociationId((current) => {
        if (!nextAssociations.length) return null;
        if (
          current &&
          nextAssociations.some((item) => String(item.id) === String(current))
        ) {
          return current;
        }
        return nextAssociations[0].id;
      });

      if (associationsRes.status !== 200 && invitationsRes.status !== 200) {
        setError("No fue posible sincronizar asociaciones e invitaciones.");
      }
    } catch (refreshError) {
      setError("No fue posible cargar la sesión operativa.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const activeAssociation =
    associations.find(
      (item) => String(item.id) === String(activeAssociationId),
    ) || null;

  const value = useMemo(
    () => ({
      token,
      user: decodeToken(token),
      associations,
      invitations,
      activeAssociation,
      activeAssociationId,
      setActiveAssociationId,
      refreshSession,
      loading,
      error,
      lastSyncAt,
      signOut: onSignOut,
    }),
    [
      token,
      associations,
      invitations,
      activeAssociation,
      activeAssociationId,
      refreshSession,
      loading,
      error,
      lastSyncAt,
      onSignOut,
    ],
  );

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error("useAppSession debe usarse dentro de AppSessionProvider");
  }
  return context;
}
