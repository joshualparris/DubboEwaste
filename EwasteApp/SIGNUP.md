# Volunteer signup with programme access codes

The shared portal supports two separate volunteer programmes:

- **DubboEwaste** — AssetFlow / e-waste operations.
- **Repair Café Dubbo** — Repair Café Volunteer Hub only.

## Behaviour

- login page: `/login`
- signup page: `/signup`
- the volunteer enters the access code supplied by their coordinator
- the server compares a SHA-256 digest against private Supabase configuration
- plaintext access codes are never committed to Git
- the plaintext code is removed from auth metadata before the user row is stored
- the verified code automatically assigns the correct programme
- DubboEwaste signups receive the `volunteer` role + `dubbo_ewaste` programme
- Repair Café signups receive the restricted `repair_volunteer` role + `repair_cafe` programme
- direct/bypassed signups without a valid code remain unauthorised
- admins/managers can hold both programme memberships

## Login routing

- DubboEwaste only → `/dashboard`
- Repair Café only → `/repair-cafe-volunteers`
- both → `/access` area chooser

Repair Café-only accounts are also blocked at the route and database layers from AssetFlow operational data.

## Access-code storage

Hashes are held in:

`private.signup_access_codes`

The legacy DubboEwaste code was migrated from `private.signup_config` without exposing its plaintext.

The Repair Café code hash is installed directly in the live Supabase environment and is intentionally not present in this public repository.

## Rotating either code

Run against the private Supabase environment:

```sql
update private.signup_access_codes
set access_code_sha256 = encode(extensions.digest('<new access code>', 'sha256'), 'hex'),
    active = true,
    updated_at = now()
where program = '<dubbo_ewaste or repair_cafe>';
```

Do not commit plaintext access codes to this repository.
