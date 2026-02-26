# Bookings Frontend Architecture

This directory contains the full bookings UI for:
- list/index page
- create page
- edit page
- shared form field components

The code is designed around **separation of concerns**:
- page files do routing-level wiring
- feature components render UI sections
- Zustand stores own form state and update actions
- API module is the only place that talks to backend endpoints
- shared form-fields are presentational only (no Zustand inside)

---

## Folder Structure

```txt
bookings/
  README.md
  api/
    bookingApi.js
  index/
    BookingsPage.jsx
  create/
    CreateBookingPage.jsx
    _store/
      useCreateBookingStore.js
    _components/
      CreateBookingComponents.jsx
      CreateBookingHeader.jsx
      CreateBookingError.jsx
      CreateBookingForm.jsx
      GuestsSection.jsx
      formClasses.js
  edit/
    EditBookingPage.jsx
    _store/
      useEditBookingStore.js
    _components/
      EditBookingComponents.jsx
      EditBookingHeader.jsx
      EditBookingError.jsx
      EditBookingForm.jsx
      GuestsSection.jsx
      formClasses.js
  _components/
    formClasses.js
    form-fields/
      LabeledInput.jsx
      LabeledSelect.jsx
      LabeledTextarea.jsx
      EventTypeField.jsx
      TitleField.jsx
      TimezoneField.jsx
      StartAtField.jsx
      DurationField.jsx
      StatusField.jsx
      NotesField.jsx
      CancelReasonField.jsx
```

---

## High-Level Design

### 1) Shared form-fields are UI-only
Files in `bookings/_components/form-fields` are reusable input wrappers and field blocks.
They receive `value`, `onChange`, and optional `visible` via props.

They **do not import Zustand**.

This keeps them:
- reusable across create/edit (and future pages)
- testable and predictable
- free from feature/store coupling

### 2) Feature forms own state wiring
`CreateBookingForm.jsx` and `EditBookingForm.jsx` connect shared fields to their own stores using selectors and actions:
- read form values from store slices
- call `updateField` on input changes
- call submit handler with full store state

### 3) Page files are minimal
- `CreateBookingPage.jsx` only renders `CreateBookingComponents`
- `EditBookingPage.jsx` reads `bookingId` from `usePage().props` and renders `EditBookingComponents`

### 4) API is centralized
`api/bookingApi.js` holds:
- fetch list
- fetch single booking
- create
- update
- delete
- shared error parser

This avoids endpoint logic spread across UI files.

---

## Zustand in This Module

## Create store (`useCreateBookingStore`)
Source: `create/_store/useCreateBookingStore.js`

State:
- `form`
- `isSaving`
- `error`

Actions:
- `setError`
- `setIsSaving`
- `reset`
- `updateField`
- `updateGuestField`
- `addGuest`
- `removeGuest`

Submit flow (`CreateBookingForm`):
1. Read latest data using `useCreateBookingStore.getState().form`
2. Set loading + clear error
3. Call `createBooking(form)`
4. Redirect on success
5. Show parsed error on failure

## Edit store (`useEditBookingStore`)
Source: `edit/_store/useEditBookingStore.js`

State:
- `form`
- `isLoading`
- `isSaving`
- `error`

Actions:
- `setForm`
- `setError`
- `setIsLoading`
- `setIsSaving`
- `reset`
- `updateField`
- `updateGuestField`
- `addGuest`
- `removeGuest`

Load + submit flow (`EditBookingForm`):
1. On mount, fetch booking by `bookingId`
2. Normalize API data to form shape (including guests and `datetime-local`)
3. Write to store via `setForm`
4. On submit, read `useEditBookingStore.getState().form`
5. Call `updateBooking(bookingId, form)`
6. Redirect or show error

---

## Form Data Contract

Both create/edit stores use the same form shape:

```js
{
  event_type: string,
  title: string,
  guests: [{ name: string, email: string, phone: string }],
  timezone: string,
  start_at: string, // datetime-local format in UI
  duration_minutes: number | string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  notes: string,
  cancel_reason: string
}
```

API normalization (`bookingApi.js`):
- `duration_minutes` converted to number (or null for empty string)
- empty `cancel_reason` removed from payload

---

## Why This Is Scalable

- Shared field components are decoupled from state engine
- Create and edit can evolve independently while keeping UI consistency
- API calls are centralized and reusable
- State mutation logic is explicit and local to each store
- Guest array handling is standardized for create/edit

---

## Adding a New Field (Recommended Pattern)

1. Add the key to both initial form objects (`create` and `edit` stores).
2. Ensure edit loader maps backend value into `setForm` payload.
3. Create a presentational field in `bookings/_components/form-fields` (or reuse existing primitives).
4. Wire `value` and `onChange` in both:
   - `CreateBookingForm.jsx`
   - `EditBookingForm.jsx`
5. If needed, update payload normalization in `bookingApi.js`.

---

## Notes

- `GuestsSection` is currently duplicated in create/edit components; behavior is aligned but could be shared later.
- There are local `formClasses.js` files in create/edit plus shared `bookings/_components/formClasses.js`; these can be consolidated further if desired.
