# Programme volunteer signup

The portal supports Dubbo E-waste (`dubbo_ewaste`), Library of Things (`library_of_things`) and Repair Café (`repair_cafe`). A coordinator supplies a programme-specific access code. The database verifies its SHA-256 digest against `private.signup_access_codes`, strips the submitted code, and creates volunteer membership in that programme only. Signup never grants admin privileges.

Existing E-waste and Repair Café codes are retained. A Library of Things admin must set its signup code before distributing it. Go to **Menu → Programme memberships**, expand the programme and use **Set or rotate volunteer signup code**. Codes need at least 10 characters and are never committed to Git or returned by the app. Existing memberships remain unchanged when a code rotates.

One account can hold multiple memberships with independent roles. Programme admins can manage their own team; global admins can manage all three. Logging in opens the relevant dashboard, with a programme chooser for switching areas. Changing accounts clears the previous programme-selection cookie.
