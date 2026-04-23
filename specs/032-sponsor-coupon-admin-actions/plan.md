# Implementation Plan: Sponsor Coupon Admin Actions

## Goal

Give the sponsorship admin screen direct operational actions over courtesy coupons without relying on manual database intervention.

## Scope

- Add sponsor coupon generation endpoint
- Add coupon expiration endpoint
- Add backend tests for both flows
- Extend the sponsorship admin screen with action buttons and refresh logic

## Validation

- `cd backend && npm test`
- `cd backend && npm run build`
- `cd frontend && npm run build`
