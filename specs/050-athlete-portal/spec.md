# Feature Specification: Athlete Portal

## Summary

Deliver the athlete-facing confirmation and personal area flow. Initial registration remains passwordless, protected by configurable Google reCAPTCHA, and sends an e-mail confirmation link. After confirmation, the athlete can open a personal area with their own registration status, team, modalities, coupon context, results, and LGPD information.

## Requirements

- The system must provide a public athlete personal area entry point.
- Public athlete registration must require e-mail.
- Public athlete registration must be protected by configurable Google reCAPTCHA verification.
- Successful registration must send a confirmation e-mail with a short-lived tokenized link.
- The confirmation link must mark the athlete e-mail as verified and open the personal area.
- Athletes must view only their own registration data, modalities, individual results, redeemed coupons, and LGPD consent status.
- The initial registration must not require a password or administrative credentials.
- The implementation must include automated backend tests and update the technical specification progress map.

## Non-Goals

- Full athlete account/password management.
- Athlete self-service editing in this slice.
- Payment or physical access control.
