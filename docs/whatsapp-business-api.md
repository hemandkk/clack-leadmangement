# WhatsApp Business Cloud API Integration

## Tenant boundary

Resolve the tenant from the trusted request subdomain before handling any
integration route. Never accept `tenant_id` from the browser as authoritative.
Store Meta credentials encrypted and scope every phone number, conversation,
message, and webhook event to the resolved tenant.

## Laravel endpoints expected by the web app

### Account setup

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/integrations/whatsapp` | Return masked account configuration |
| POST | `/api/integrations/whatsapp/connect` | Validate and encrypt Meta credentials |
| DELETE | `/api/integrations/whatsapp` | Disable messaging without deleting audit history |
| POST | `/api/integrations/whatsapp/verify-webhook` | Check that webhook verification completed |

### Phone numbers

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/integrations/whatsapp/phone-numbers` | List tenant-owned business phone numbers |
| POST | `/api/integrations/whatsapp/phone-numbers` | Validate a Meta Phone Number ID and save assignment |
| DELETE | `/api/integrations/whatsapp/phone-numbers/{id}` | Disable a phone-number assignment |

### Inbox

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/whatsapp/conversations?search=` | List tenant conversations |
| GET | `/api/whatsapp/conversations/{id}/messages` | List messages in chronological order |
| POST | `/api/whatsapp/conversations/{id}/messages` | Queue an outbound message |

## Webhook

Expose a public endpoint such as:

```text
GET  /api/webhooks/whatsapp
POST /api/webhooks/whatsapp
```

The `GET` handler performs Meta verification. The `POST` handler should:

1. Verify the webhook signature using the Meta app secret.
2. Resolve the tenant from the incoming `phone_number_id`.
3. Store the raw event with a unique event or message ID.
4. Return `200` quickly.
5. Process messages and statuses asynchronously through a queue.
6. Upsert prospects and conversations for inbound messages.
7. Update `sent`, `delivered`, `read`, and `failed` statuses idempotently.
8. Publish a tenant-scoped WebSocket event for the inbox UI.

## Database tables

Suggested tables:

```text
whatsapp_accounts
whatsapp_phone_numbers
whatsapp_conversations
whatsapp_messages
whatsapp_webhook_events
```

Add a `tenant_id` foreign key and index to every table. Add unique indexes for
Meta IDs such as `phone_number_id`, `wamid`, and webhook event IDs.

## Messaging rules

- Send free-form messages only while the customer-service window is open.
- Require an approved template when the window is closed.
- Queue outbound sends and retry transient failures with backoff.
- Encrypt access tokens at rest and never return them unmasked.
- Log credential changes, phone-number assignments, and outbound sends.

## Multiple staff numbers

A WhatsApp Business Account can expose multiple registered phone numbers. Store
each number separately and optionally assign it to a staff member. Before
sending a message, authorize the current user and select an allowed
`phone_number_id`; do not let the browser send an arbitrary Meta phone ID.
