# Backend Bookings Module

This directory contains the backend bookings pages and the page-specific state/API wiring for:
- booking list
- backend create flow
- backend edit flow

The shared booking field UI does not live here. Shared field components are in `resources/js/common/booking`.

## Folder Structure

```txt
backend/pages/bookings/
  README.md
  api/
    bookingApi.js
  index/
    BookingsPage.jsx
  create/
    CreateBookingPage.jsx
    _components/
      CreateBookingComponents.jsx
      CreateBookingError.jsx
      CreateBookingForm.jsx
      CreateBookingHeader.jsx
      CreateBookingStepOne.jsx
      CreateBookingStepTwo.jsx
      GuestsSection.jsx
      formClasses.js
    _store/
      useCreateBookingStore.js
  edit/
    EditBookingPage.jsx
    _components/
      EditBookingComponents.jsx
      EditBookingError.jsx
      EditBookingFields.jsx
      EditBookingForm.jsx
      EditBookingHeader.jsx
      GuestsSection.jsx
      formClasses.js
    _store/
      useEditBookingStore.js
  _components/
    formClasses.js
```

## Responsibilities

### `index/`

`index/BookingsPage.jsx` owns the booking list screen.

Responsibilities:
- fetch bookings
- filter and search
- handle delete
- show list feedback messages

This page currently keeps its own local React state because the state is page-local and short-lived.

### `create/`

The backend create flow owns:
- backend-specific create layout
- create page copy
- create Zustand store
- submit flow for creating a booking

It reuses shared field components from `resources/js/common/booking/form-fields`.

### `edit/`

The backend edit flow owns:
- loading a booking by id
- mapping API data into form shape
- edit-specific status/cancel logic
- edit Zustand store
- update submission

It also reuses shared field components from `resources/js/common/booking/form-fields`.

### `api/`

`api/bookingApi.js` is the only place in this module that should talk to booking endpoints.

Keep endpoint details here:
- fetch list
- fetch one
- create
- update
- delete
- shared error parsing

## State Rules

### Create store

Source: `create/_store/useCreateBookingStore.js`

Owns:
- create form values
- create loading state
- create error state

### Edit store

Source: `edit/_store/useEditBookingStore.js`

Owns:
- edit form values
- edit loading state
- edit saving state
- edit error state

### Shared field state

Field-level logic should stay in shared field components under `resources/js/common/booking/form-fields`.

This backend module should not duplicate field logic unless the behavior is truly backend-only.

## Form Contract

Both backend create and edit flows use the same form shape:

```js
{
  event_type: string,
  title: string,
  guests: [{ name: string, email: string, phone: string }],
  timezone: string,
  start_at: string,
  duration_minutes: number | string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  notes: string,
  cancel_reason: string
}
```

Notes:
- `start_at` is handled in UI-friendly format for form controls
- payload normalization belongs in `api/bookingApi.js`

## Recommended Change Pattern

When adding or changing a booking field:

1. Update the shared field in `resources/js/common/booking/form-fields` if the UI is reusable.
2. Add the field to both backend store initial states if backend create and edit both need it.
3. Map backend API data into the edit form shape.
4. Update create and edit form wiring.
5. Adjust payload normalization in `api/bookingApi.js` if needed.

## Notes

- `GuestsSection` is duplicated between backend create and edit. That is acceptable for now because each flow has its own store wiring.
- There are multiple `formClasses.js` files. They work, but this can be consolidated later if style drift starts.
