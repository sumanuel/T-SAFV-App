import { apiGet, apiPost } from "../config/api";

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
};
