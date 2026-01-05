/**
 * MSW handlers for Supabase PostgREST API.
 *
 * Minimal handlers for testing. Extend as needed.
 * @see https://postgrest.org/en/stable/references/api.html
 */

import { http, HttpResponse } from 'msw';

import { MOCK_SUPABASE_URL, MOCK_USER } from '@/mocks/constants';
import { createProfile, mockProfiles } from '@/mocks/fixtures/profiles';

export const supabaseHandlers = [
  // GET /rest/v1/profiles
  http.get(`${MOCK_SUPABASE_URL}/rest/v1/profiles`, ({ request }) => {
    const url = new URL(request.url);
    const idFilter = url.searchParams.get('id');
    const isSingle = request.headers.get('Accept')?.includes('vnd.pgrst.object');

    let profiles = [...mockProfiles];

    // Filter by ID if specified (eq.user_123 format)
    if (idFilter?.startsWith('eq.')) {
      const id = idFilter.replace('eq.', '');
      profiles = profiles.filter((p) => p.id === id);
    }

    // Simulate RLS: only return current user's data
    profiles = profiles.filter((p) => p.id === MOCK_USER.id);

    if (isSingle) {
      return profiles.length > 0
        ? HttpResponse.json(profiles[0])
        : HttpResponse.json({ message: 'No rows found', code: 'PGRST116' }, { status: 406 });
    }

    return HttpResponse.json(profiles);
  }),

  // POST /rest/v1/profiles
  http.post(`${MOCK_SUPABASE_URL}/rest/v1/profiles`, async ({ request }) => {
    const body = await request.json();
    const profile = createProfile(body as Record<string, unknown>);

    return request.headers.get('Prefer')?.includes('return=representation')
      ? HttpResponse.json(profile, { status: 201 })
      : new HttpResponse(null, { status: 201 });
  }),

  // PATCH /rest/v1/profiles
  http.patch(`${MOCK_SUPABASE_URL}/rest/v1/profiles`, async ({ request }) => {
    const body = await request.json();
    const profile = { ...mockProfiles[0], ...(body as Record<string, unknown>), updated_at: new Date().toISOString() };

    return request.headers.get('Prefer')?.includes('return=representation')
      ? HttpResponse.json(profile)
      : new HttpResponse(null, { status: 204 });
  }),

  // DELETE /rest/v1/profiles
  http.delete(`${MOCK_SUPABASE_URL}/rest/v1/profiles`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
