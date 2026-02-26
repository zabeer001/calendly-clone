# Booking Module README

This document explains how the Booking API module is structured and why.

## Goal

Build a Booking module that is:
- clear to read
- easy to extend
- safe for data consistency
- aligned with SOLID principles

## Module Location

- Controller: `app/Http/Controllers/Api/Booking/BookingController.php`
- Services: `app/Http/Controllers/Api/Booking/Services/*`
- Shared booking internals: `app/Http/Controllers/Api/Booking/Services/Sahred/*`

## High-Level Design

1. `BookingController` is thin.
2. Each endpoint delegates to one service class.
3. Validation is separated from service orchestration.
4. Guest persistence is separated from booking orchestration.
5. Guest + booking writes are wrapped in DB transactions.

## Service Responsibilities

- `BookingIndexService`: list/filter bookings.
- `BookingShowService`: show one booking.
- `BookingStoreService`: create booking flow.
- `BookingUpdateService`: update booking flow.
- `BookingDeleteService`: delete booking.

## Shared Components

### Guest persistence

Path: `Services/Sahred/Guest`

- `GuestStorePersistenceInterface`
- `GuestUpdatePersistenceInterface`
- `GuestPersistenceService` (implements both)

Why:
- `BookingStoreService` depends only on store behavior.
- `BookingUpdateService` depends only on update behavior.
- This follows Interface Segregation + Dependency Inversion.

### Validations

Path: `Services/Sahred/Validations`

- `BookingStoreValidation`
- `BookingUpdateValidation`

Why:
- remove private validation methods from services
- keep rules explicit and isolated per use case
- store/update rules can evolve independently (`required` vs `sometimes`)

## Data Model Decisions

- Booking and Guest are many-to-many.
- Pivot table: `booking_guest` (`booking_id`, `guest_id`).
- Guest details (`name`, `email`, `phone`) live in `guests` table.

## Transaction Safety

`BookingStoreService` and `BookingUpdateService` use `DB::transaction(...)` so:
- if guest write succeeds but booking write fails, all changes rollback
- if any exception occurs in the middle, DB stays consistent

## Update Semantics

For update flow:
- fields are assigned only when key exists in validated payload
- this prevents accidental overwrite during partial updates
- `array_key_exists(...)` is intentionally used for nullable updates

## DI Bindings

Bindings are configured in:
- `app/Providers/AppServiceProvider.php`

Both guest interfaces are bound to `GuestPersistenceService`.

## Request Lifecycle (Store)

1. Validate input via `BookingStoreValidation`.
2. Inside transaction:
3. Persist guest via guest persistence service.
4. Create booking and sync guests through pivot relation.
5. Persist booking.
6. Return JSON response.

## Request Lifecycle (Update)

1. Validate input via `BookingUpdateValidation`.
2. Guard business rules (e.g., `end_at > start_at`).
3. Inside transaction:
4. Persist/update guest only when guest fields are present.
5. Apply partial booking assignments.
6. Persist booking.
7. Return JSON response.

## SOLID Snapshot

- SRP: split by responsibility (controller/service/validation/guest persistence)
- OCP: add new persistence strategies through interfaces
- LSP: services consume contracts, implementations are swappable
- ISP: store/update interfaces are separated
- DIP: services depend on abstractions, not concrete guest class

## How to Extend

When adding new booking behavior:
1. Add/modify a dedicated service class.
2. Keep controller thin; delegate logic.
3. Put cross-service logic under `Services/Sahred`.
4. Keep validation in `Sahred/Validations` classes.
5. Preserve transaction boundaries for multi-entity writes.
6. Bind new interfaces in `AppServiceProvider`.

## Notes

- Folder name `Sahred` is kept as-is to match current project structure.
- If renamed to `Shared`, update namespaces/imports consistently.
