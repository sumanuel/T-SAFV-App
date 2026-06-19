import { apiGet, apiPost } from '../config/api';

export async function register(data) {
  return apiPost('/api/auth/register', data);
}

export async function login(email, password) {
  return apiPost('/api/auth/login', { email, password });
}

export async function getMyInvitations(token) {
  return apiGet('/api/invitaciones/mine', token);
}

export async function acceptInvitation(userToken, inviteToken) {
  return apiPost('/api/invitaciones/respond', { token: inviteToken }, userToken);
}

export async function createInvitacion(userToken, payload) {
  return apiPost('/api/invitaciones', payload, userToken);
}

export async function createAsociacion(userToken, payload) {
  return apiPost('/api/asociaciones', payload, userToken);
}

export default {
  register,
  login,
  getMyInvitations,
  acceptInvitation,
  createInvitacion,
  createAsociacion,
};
