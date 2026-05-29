import API from './apiClient';

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  user: any;
  selectedProfile: any;
  selectedUnit: any;
  ownerProfiles: any[];
}

const mapSession = (response: any): UserSession => {
  const profile = response.ownerProfiles?.[0] || null;
  const defaultUnit = profile?.unitOwner?.[0] || null;

  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: {
      userId: response.userId,
      username: response.username,
      email: response.email,
      roles: response.roles || [],
    },
    selectedProfile: profile,
    selectedUnit: defaultUnit,
    ownerProfiles: response.ownerProfiles || [],
  };
};

const getErrorMessage = (error: any) => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  const validationErrors = data?.errors && Object.values(data.errors).flat().join(' ');
  const serverMessage = data?.message || data?.title;

  if (error?.response?.status === 429) {
    return 'Too many OTP requests. Please wait a minute and try again.';
  }

  if (error?.response?.status >= 500 || serverMessage === 'An unexpected error occurred.') {
    return 'Please enter a valid number.';
  }

  return validationErrors || serverMessage || error?.message || 'Action failed. Try again.';
};

export const sendOTP = async (phone: string) => {
  try {
    const res = await API.post('/Auth/send-otp', {
      MobileNumber: phone,
    }, {
      params: {
        MobileNumber: phone,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const verifyOTP = async (phone: string, otp: string) => {
  try {
    const response = await API.post('/Auth/verify-otp', {
      MobileNumber: phone,
      OtpCode: otp,
    });

    const session = mapSession(response.data);

    // Enforce phone number in user object
    if (session.user) {
      session.user.phone = phone;
      session.user.name = session.selectedProfile?.ownerName || 
                         session.selectedProfile?.OwnerName || 
                         session.user.username;
    }

    return session;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
