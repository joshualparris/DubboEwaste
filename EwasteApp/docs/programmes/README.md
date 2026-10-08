# Programme separation and scoped roles

Each tracked item has `programme`, `owner_kind` and optional `owner_name`. Programmes are E-waste, Library of Things and Repair Café. Existing inventory stays E-waste with ownership marked unconfirmed; a previous authority check is not treated as proof of programme ownership. Repair Café feedback/demand records are assigned Repair Café. New Repair Café intake defaults to customer ownership; lending intake defaults to programme ownership.

## Roles and administration

`program_access.programme_role` supports volunteer, technician, manager, auditor and admin independently for each programme. `profiles.role=admin` is global administration. A programme admin cannot change global profiles, global permission templates, another programme's memberships or their own authority in a programme where they are only a volunteer. Inactive profiles and inactive memberships lose data access immediately through database lookups.

Use `/programmes` to choose a working area; global admins can choose all programmes. `/admin/programmes` manages programme memberships and signup codes. The global account admin role remains in `/admin/permissions`. A single-programme admin can recruit volunteers through their own signup code; a global admin can grant cross-programme access to existing people.

## Boundaries

The migration scopes 67 operational tables; Repair Café public feedback has separate read and submission gates so the resident form still accepts public submissions. Product-reference model data and the separate learner-owned progress system remain shared. Public certificate verification remains intentionally public. Transfer logs use source/destination access instead of an ordinary programme column.

Navigation and request routing hide or reject irrelevant sections, including global administration. Restrictive SQL RLS remains the final boundary for direct API calls. Programme headers/cookies cannot grant membership. SQL triggers reject FK/polymorphic links to another programme; evidence storage checks the associated item. Programme-specific SQL/table capabilities prevent lending and repair volunteers from entering E-waste-only operations.

## Loans and transfers

Library loans require a programme-owned library item and a borrower from that programme. A unique index prevents two open loans for one item. Checkout records condition and due date; returns record inspection. Loan identity and completed returns are immutable. Items on loan cannot change ownership or transfer until returned.

Transfers require admin access to both source and destination. They retain the asset ID and owner, append an immutable transfer log and move attached device history/photos/repair/media records. Current source customer/job/lot/location links are captured in the log and cleared, allowing the destination to record its own custody. Harvested parts and completed commercial/lending records retain their original programme. E-waste-only history stays available to global admins even if the new programme does not expose that module. A transfer does not establish ownership or customer consent.

## Validation

- Live PostgreSQL transaction tests passed all 15 programme/role combinations, with cross-programme asset read/update/delete, insert, attachment, photo/storage and global privilege denials.
- Separate rollback-only suites passed independent programme roles, scoped administration, forged-header denial, revoked/inactive/anonymous access denial, loans/returns, open-loan transfer denial, global all-programme views and transfer history. All synthetic fixtures rolled back; original inventory remained four E-waste assets and no QA auth accounts remained.
- Real page/component code rendered against synthetic boundaries at 320, 390, 768 and 1280 pixels: 58 routes, 23 seeded documents, programme-specific volunteer/admin screens and navigation, 569 recorded cases passed. This is not a live authenticated browser audit.
- TypeScript, source guards and the production build passed.
- Database security advisors reported no new programme/RLS findings after privileged implementations moved behind checked private functions. The existing leaked-password-protection advisory is unchanged; [Supabase remediation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

The exercised suites are `supabase/tests/programme_access.sql`, `programme_memberships.sql` and `programme_lifecycle.sql`. Each uses BEGIN/ROLLBACK synthetic fixtures. Run them against a development database through a privileged SQL session. `npm run qa:mobile:browser` runs the isolated Chromium layout checks; see `rendered-audit.json`.

## Migration ordering

Apply the timestamped `programme_asset_access` files in order, followed by checked RPC wrappers and ownership guard. Row restrictions and global-admin gates are installed before expanding effective programme roles. The original manual migrations, including the earlier programme-signup migration, must already be present. Existing codes and accounts are preserved; Library of Things signup is configured by its admin through the new UI.
