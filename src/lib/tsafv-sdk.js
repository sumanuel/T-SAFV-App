import { apiGet, apiPost } from "../config/api";

function buildQueryString(params) {
  const entries = Object.entries(params || {}).filter(([, value]) => {
    return value !== undefined && value !== null && value !== "";
  });

  if (!entries.length) return "";

  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => searchParams.append(key, String(value)));

  return `?${searchParams.toString()}`;
}

export async function register(data) {
  return apiPost("/api/auth/register", data);
}

export async function login(email, password) {
  return apiPost("/api/auth/login", { email, password });
}

export async function getMyInvitations(token) {
  return apiGet("/api/invitaciones/mine", token);
}

export async function getMyAssociations(token) {
  return apiGet("/api/asociaciones/mine", token);
}

export async function acceptInvitation(userToken, inviteToken) {
  return apiPost(
    "/api/invitaciones/respond",
    { token: inviteToken },
    userToken,
  );
}

export async function createInvitacion(userToken, payload) {
  return apiPost("/api/invitaciones", payload, userToken);
}

export async function createAsociacion(userToken, payload) {
  return apiPost("/api/asociaciones", payload, userToken);
}

export async function getUnits(userToken) {
  return apiGet("/api/unidades", userToken);
}

export async function getAssociationMembers(userToken, asociacionId) {
  return apiGet(`/api/asociaciones/${asociacionId}/miembros`, userToken);
}

export async function getAssociationUnits(userToken, asociacionId) {
  return apiGet(`/api/asociaciones/${asociacionId}/unidades`, userToken);
}

export async function getAssociationTraceability(userToken, asociacionId) {
  return apiGet(`/api/asociaciones/${asociacionId}/trazabilidad`, userToken);
}

export async function getAssociationTraceabilityFiltered(
  userToken,
  asociacionId,
  filters,
) {
  const query = buildQueryString(filters);
  return apiGet(
    `/api/asociaciones/${asociacionId}/trazabilidad${query}`,
    userToken,
  );
}

export async function createFiscalRecord(userToken, payload) {
  return apiPost("/api/fiscal/registros", payload, userToken);
}

export default {
  register,
  login,
  getMyInvitations,
  getMyAssociations,
  acceptInvitation,
  createInvitacion,
  createAsociacion,
  getUnits,
  getAssociationMembers,
  getAssociationUnits,
  getAssociationTraceability,
  getAssociationTraceabilityFiltered,
  createFiscalRecord,
};
