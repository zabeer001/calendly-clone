# Common Booking Module

This directory contains the shared booking UI used across frontend and backend booking flows.

The goal of this module is to keep reusable booking form logic in one place:
- shared create flow UI
- reusable field components
- local field-specific helpers where needed
- a small shared Zustand store for the common create flow

## Folder Structure

```txt
common/booking/
  README.md
  create/
    CreateBookingPage.jsx
    _components/
      BackendCreateBookingHeader.jsx
      CreateBookingComponents.jsx
      CreateBookingError.jsx
      CreateBookingForm.jsx
      CreateBookingHeader.jsx
      CreateBookingStepOne.jsx
      CreateBookingStepTwo.jsx
      FrontendCreateBookingHeader.jsx
      GuestsSection.jsx
      formClasses.js
    _store/
      useCreateBookingStore.js
  form-fields/
    FieldShell.jsx
    LabeledInput.jsx
    LabeledSelect.jsx
    LabeledTextarea.jsx
    NoticeCard.jsx
    SelectionSummaryCard.jsx
    EventTypeField.jsx
    TitleField.jsx
    TimezoneField.jsx
    StartAtField.jsx
    DurationField.jsx
    StatusField.jsx
    NotesField.jsx
    CancelReasonField.jsx
    startAtField/
      StartAtField.jsx
      startAtField.constants.js
      useStartAtFieldState.js
      _compoennts/
        StartAtCalendarSection.jsx
        StartAtHeader.jsx
        StartAtTimeSlotsSection.jsx
      utils/
        buildStartAtValue.js
        buildTimeSlots.js
        formatSelectedSummary.js
        getSlotInterval.js
        parseDateTimeValue.js
        toSyntheticChange.js
        index.js
```

## Design Rules

### 1. `form-fields/` stays reusable

Files in `form-fields/` should stay focused on rendering and field-level interaction.

Rules:
- accept data through props
- emit changes through props
- avoid feature-specific API calls
- avoid coupling to page-level navigation

Exception:
- field-local state is allowed when it only belongs to that field, such as `startAtField/useStartAtFieldState.js`

### 2. `create/` owns the create flow

The `create/` directory is the shared create booking experience.

Responsibilities:
- step switching
- create submission
- error display
- create-specific Zustand state
- frontend/backend header switching through `CreateBookingHeader.jsx`

### 3. Complex fields can have internal modules

`startAtField/` is the reference pattern for a larger field.

It splits the field into:
- a top-level export component
- a local state hook
- small pure helper functions in `.js` files
- small JSX sections under `_compoennts/`

This keeps the public API simple while preventing a single oversized field file.

## State Boundaries

### Shared create store

Source: `create/_store/useCreateBookingStore.js`

This store owns the create booking form state for the common create flow.

It should contain:
- create form values
- create loading state
- create error state

It should not contain:
- local UI state that only matters to one field
- backend edit-only behavior

### Field-local state

Example: `form-fields/startAtField/useStartAtFieldState.js`

This is intentionally local React state, not Zustand.

That is the preferred pattern when:
- the state is only used by one field
- nothing else needs to subscribe to it
- persistence outside the field is unnecessary

## Recommended Patterns

### Add a new shared field

1. Build the field in `form-fields/`.
2. Keep its public API prop-based (`value`, `onChange`, `visible`, etc.).
3. If it grows large, create a subfolder like `startAtField/`.
4. Reuse it from create or backend pages instead of duplicating UI.

### Add a new create step

1. Add a new step component in `create/_components/`.
2. Keep step transition logic inside `CreateBookingForm.jsx`.
3. Reuse existing form field components where possible.

## Notes

- `form-fields/StartAtField.jsx` is a compatibility re-export for the nested `startAtField/StartAtField.jsx`.
- The `_compoennts` folder name inside `startAtField/` is currently misspelled but is intentionally left as-is until renamed everywhere.
