<?php

namespace App\Http\Controllers\Api\GoogleMeet;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventAttendee;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoogleMeetController extends Controller
{

    public function __construct()
    {
        $this->middleware(['auth:api', 'role:admin,superadmin'])
            ->except(['callback']);
    }



    public function authUrl(Request $request): JsonResponse
    {
        $client = $this->buildClient();

        if ($request->filled('state')) {
            $client->setState((string) $request->query('state'));
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'auth_url' => $client->createAuthUrl(),
            ],
        ]);
    }

    public function callback(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $client = $this->buildClient();
        $token = $client->fetchAccessTokenWithAuthCode((string) $request->query('code'));

        if (isset($token['error'])) {
            return response()->json([
                'status' => 'error',
                'message' => (string) ($token['error_description'] ?? $token['error']),
                'data' => $token,
            ], 422);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Token generated. Copy refresh_token into GOOGLE_REFRESH_TOKEN in .env',
            'data' => [
                'refresh_token' => $token['refresh_token'] ?? null,
                'access_token' => $token['access_token'] ?? null,
                'expires_in' => $token['expires_in'] ?? null,
                'scope' => $token['scope'] ?? null,
                'token_type' => $token['token_type'] ?? null,
            ],
        ]);
    }

    public function createMeetLink(Request $request): JsonResponse
    {
        $defaults = [
            'title' => 'Quick Google Meet',
            'start_at' => now()->addMinutes(10)->toDateTimeString(),
            'duration_minutes' => 30,
            'timezone' => config('app.timezone', 'UTC'),
        ];

        $validated = validator(
            array_merge($defaults, $request->all()),
            [
                'title' => ['required', 'string', 'max:160'],
                'description' => ['nullable', 'string', 'max:2000'],
                'start_at' => ['required', 'date'],
                'duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
                'timezone' => ['required', 'string', 'max:80'],
                'attendees' => ['nullable', 'array'],
                'attendees.*.email' => ['required_with:attendees', 'email', 'max:255'],
            ]
        )->validate();

        $meetData = $this->generateMeetLink($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Google Meet link created successfully.',
            'data' => $meetData,
        ], 201);
    }

    public function publicLink(Request $request): RedirectResponse|JsonResponse
    {
        $defaults = [
            'title' => 'Quick Google Meet',
            'start_at' => now()->addMinutes(10)->toDateTimeString(),
            'duration_minutes' => 30,
            'timezone' => config('app.timezone', 'UTC'),
        ];

        $validated = validator(
            array_merge($defaults, $request->all()),
            [
                'title' => ['required', 'string', 'max:160'],
                'description' => ['nullable', 'string', 'max:2000'],
                'start_at' => ['required', 'date'],
                'duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
                'timezone' => ['required', 'string', 'max:80'],
                'attendees' => ['nullable', 'array'],
                'attendees.*.email' => ['required_with:attendees', 'email', 'max:255'],
            ]
        )->validate();

        $meetData = $this->generateMeetLink($validated);
        $target = $meetData['meet_link'] ?: $meetData['calendar_link'];

        if ($request->boolean('json')) {
            return response()->json([
                'status' => 'success',
                'message' => 'Google Meet link created successfully.',
                'data' => $meetData,
            ], 201);
        }

        return redirect()->away($target);
    }

    private function generateMeetLink(array $validated): array
    {
        $refreshToken = (string) config('services.google.refresh_token', '');

        if ($refreshToken === '') {
            abort(422, 'Missing GOOGLE_REFRESH_TOKEN in environment.');
        }

        $client = $this->buildClient();
        $accessToken = $client->fetchAccessTokenWithRefreshToken($refreshToken);

        if (isset($accessToken['error'])) {
            abort(422, (string) ($accessToken['error_description'] ?? $accessToken['error']));
        }

        $calendarService = new Calendar($client);

        $start = Carbon::parse($validated['start_at'], $validated['timezone']);
        $end = $start->copy()->addMinutes((int) $validated['duration_minutes']);

        $event = new Event([
            'summary' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'visibility' => 'public',
            'start' => new EventDateTime([
                'dateTime' => $start->toRfc3339String(),
                'timeZone' => $validated['timezone'],
            ]),
            'end' => new EventDateTime([
                'dateTime' => $end->toRfc3339String(),
                'timeZone' => $validated['timezone'],
            ]),
            'attendees' => collect($validated['attendees'] ?? [])
                ->map(fn(array $attendee) => new EventAttendee(['email' => $attendee['email']]))
                ->values()
                ->all(),
            'conferenceData' => new ConferenceData([
                'createRequest' => new CreateConferenceRequest([
                    'requestId' => 'meet-' . uniqid('', true),
                ]),
            ]),
        ]);

        $calendarId = (string) config('services.google.calendar_id', 'primary');
        $createdEvent = $calendarService->events->insert($calendarId, $event, [
            'conferenceDataVersion' => 1,
            'sendUpdates' => 'all',
        ]);

        return [
            'event_id' => $createdEvent->getId(),
            'calendar_link' => $createdEvent->getHtmlLink(),
            'meet_link' => $createdEvent->getHangoutLink(),
        ];
    }

    private function buildClient(): Client
    {
        $clientId = (string) config('services.google.client_id');
        $clientSecret = (string) config('services.google.client_secret');
        $redirectUri = (string) config('services.google.redirect_uri');

        if (
            $clientId === '' ||
            $clientSecret === '' ||
            $redirectUri === '' ||
            str_contains($clientId, 'dummy-') ||
            str_contains($clientSecret, 'dummy-')
        ) {
            abort(422, 'Google OAuth is not configured. Set real GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in .env and run php artisan config:clear.');
        }

        $client = new Client();
        $client->setClientId($clientId);
        $client->setClientSecret($clientSecret);
        $client->setRedirectUri($redirectUri);
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setIncludeGrantedScopes(true);
        $client->setScopes([
            Calendar::CALENDAR,
        ]);

        return $client;
    }
}
