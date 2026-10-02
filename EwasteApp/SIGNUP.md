# Public signup with access code

The staff app allows anyone who knows the current shared access code to create an account.

## Behaviour

- signup page: `/signup`
- access code is checked server-side against Supabase
- plaintext access code is not committed to Git
- only a SHA-256 hash is stored in the private Supabase schema
- valid signups become active `volunteer` accounts
- direct/bypassed signups without the correct proof remain inactive
- admins can later change roles in the `profiles` table

## Rotating the code

Update the private stored hash in Supabase:

```sql
update private.signup_config
set access_code_sha256 = encode(extensions.digest('<new code>', 'sha256'), 'hex'),
    updated_at = now()
where singleton = true;
```

Do not commit the plaintext access code to this public repository.
