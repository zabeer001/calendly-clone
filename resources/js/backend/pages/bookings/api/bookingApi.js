import { apiRequest } from '../../../../shared/apiClient';

function normalizeBookingPayload(form) {
    const payload = {
        ...form,
        duration_minutes: form.duration_minutes === '' ? null : Number(form.duration_minutes),
    };

    if (!payload.cancel_reason) {
        delete payload.cancel_reason;
    }

    return payload;
}

export async function fetchBookings({ status = '', search = '' } = {}) {
    const params = new URLSearchParams();

    if (status) {
        params.set('status', status);
    }

    if (search) {
        params.set('search', search);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const payload = await apiRequest(`/api/bookings${query}`, { auth: true });

    return Array.isArray(payload?.data?.data) ? payload.data.data : [];
}

export async function fetchBookingById(uniqId) {
    const payload = await apiRequest(`/api/bookings/${uniqId}`, { auth: true });
    return payload?.data;
}

export async function createBooking(form) {
    return apiRequest('/api/bookings', {
        method: 'POST',
        body: normalizeBookingPayload(form),
    });
}

export async function updateBooking(uniqId, form) {
    return apiRequest(`/api/bookings/${uniqId}`, {
        method: 'PUT',
        auth: true,
        body: normalizeBookingPayload(form),
    });
}

export async function deleteBooking(id) {
    return apiRequest(`/api/bookings/${id}`, {
        method: 'DELETE',
        auth: true,
    });
}

export function getApiErrorMessage(error, fallbackMessage) {
    if (error?.status === 422 && error?.payload?.errors) {
        const firstError = Object.values(error.payload.errors)?.[0]?.[0];
        return firstError || 'Validation failed.';
    }

    return error?.message || fallbackMessage;
}
