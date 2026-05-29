import API from './apiClient';
import { normalizeSociety, normalizePlot, normalizeFund } from '../utils/normalizers';

export const getSociety = async (query: string) => {
  try {
    const res = await API.get('/Society/search', { params: { query } });
    const data = res.data;
    return (Array.isArray(data) ? data : data?.value ?? data?.societies ?? []).map(normalizeSociety);
  } catch (error) {
    return [];
  }
};

export const getDashboard = async (profile: any) => {
  const societyId = profile?.societyId;
  const plots = profile?.unitOwner ?? [];
  const normalizedPlots = plots.map((p: any, i: number) => normalizePlot(p, i));

  return {
    user: { name: profile?.ownerName || 'Resident' },
    society: {
      id: societyId,
      name: profile?.societyName || 'Home Orbit Society',
    },
    plots: normalizedPlots,
    societyFund: normalizeFund(0),
    announcements: [],
    recentPayments: [],
  };
};

export const getSocietyFund = async (societyId: string | number) => {
  try {
    const res = await API.get(`/society/fund`, { params: { societyId } });
    return normalizeFund(res.data);
  } catch (error) {
    return normalizeFund(0);
  }
};

export const getExpenseHistory = async (societyId: string | number | null, params: { pageNumber: number; pageSize: number }) => {
  try {
    const res = await API.get('/SocietyFund/history', { 
      params: { 
        societyId,
        ...params 
      } 
    });
    return res.data;
  } catch (error) {
    return { items: [], totalCount: 0, pageNumber: params.pageNumber };
  }
};

export const getMaintenanceDue = async (societyId: any, ownerId: any, unitId: any) => {
  try {
    const res = await API.get(`/maintenance/${societyId}/owner/${ownerId}/unit/${unitId}`);
    return res.data;
  } catch (error) {
    return [];
  }
};
