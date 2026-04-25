Have a Meta Business account
Have a WhatsApp Business Account (WABA)
Verify their business (sometimes optional for low limits)
Add & verify a phone number
Generate API credentials


Flow:
User clicks “Connect WhatsApp”
You open Meta’s embedded onboarding popup
User:
logs into Facebook
selects/creates business
adds phone number
Meta returns:
WABA_ID
PHONE_NUMBER_ID
ACCESS_TOKEN

👉 You store this → tenant is now connected

Company signs up in your app
Goes to Settings → WhatsApp
Clicks “Connect WhatsApp”
Completes Meta onboarding
You store credentials
Webhook starts receiving messages
Chat UI becomes active ✅

Inside Meta Developer:

You need:
App created
WhatsApp product added
Facebook Login enabled
Redirect URI set:
https://yourdomain.com/api/meta/callback
🔑 2. Required Permissions

Request these scopes:

whatsapp_business_management
whatsapp_business_messaging
business_management

Environment Variables
META_APP_ID=your_app_id
META_APP_SECRET=your_secret
META_REDIRECT_URI=https://yourdomain.com/api/meta/callback
NEXT_PUBLIC_META_APP_ID=your_app_id


📄 /app/settings/page.tsx
"use client";

const CLIENT_ID = process.env.NEXT_PUBLIC_META_APP_ID!;
const REDIRECT_URI = "https://yourdomain.com/api/meta/callback";

export default function ConnectWhatsApp() {
  const connect = () => {
    const url =
      `https://www.facebook.com/v19.0/dialog/oauth?` +
      `client_id=${CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&scope=whatsapp_business_management,whatsapp_business_messaging,business_management` +
      `&response_type=code`;

    window.open(url, "_blank", "width=600,height=700");
  };

  return (
    <button onClick={connect}>
      Connect WhatsApp
    </button>
  );
}

/app/api/meta/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/tenant";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code" });
  }

  // Step 1: Exchange code → access token
  const tokenRes = await axios.get(
    `https://graph.facebook.com/v19.0/oauth/access_token`,
    {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: process.env.META_REDIRECT_URI,
        code,
      },
    }
  );

  const accessToken = tokenRes.data.access_token;

  // Step 2: Get businesses
  const businessRes = await axios.get(
    `https://graph.facebook.com/v19.0/me/businesses`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const businessId = businessRes.data.data[0].id;

  // Step 3: Get WhatsApp Business Account (WABA)
  const wabaRes = await axios.get(
    `https://graph.facebook.com/v19.0/${businessId}/owned_whatsapp_business_accounts`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const wabaId = wabaRes.data.data[0].id;

  // Step 4: Get phone numbers
  const phoneRes = await axios.get(
    `https://graph.facebook.com/v19.0/${wabaId}/phone_numbers`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const phoneNumberId = phoneRes.data.data[0].id;

  // Step 5: Store in DB
  const tenantId = await getTenantId();

  await prisma.channel.create({
    data: {
      tenantId,
      phoneNumberId,
      accessToken,
      wabaId,
    },
  });

  return NextResponse.redirect("/dashboard");
}



Token Exchange Upgrade

Short-lived → long-lived token:

GET /oauth/access_token?
grant_type=fb_exchange_token


===============

Data Flow Strategy (IMPORTANT)

Instead of doing everything in callback, we:

👉 Store temporary onboarding session

OnboardingSession {
  id
  tenantId
  accessToken
  businesses[]
  wabas[]
  phoneNumbers[]
}
📦 3. Backend: Store Onboarding Data
Update Callback API

📄 /api/meta/callback

const onboarding = await prisma.onboardingSession.create({
  data: {
    tenantId,
    accessToken,
    businesses: JSON.stringify(businessRes.data.data),
  },
});

👉 Redirect to:

return NextResponse.redirect(
  `/onboarding/select-business?sessionId=${onboarding.id}`
);
/app/onboarding/select-business/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SelectBusiness() {
  const [businesses, setBusinesses] = useState([]);
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("sessionId");

  useEffect(() => {
    fetch(`/api/onboarding/businesses?sessionId=${sessionId}`)
      .then(res => res.json())
      .then(setBusinesses);
  }, []);

  return (
    <div>
      <h2>Select Business</h2>
      {businesses.map((b: any) => (
        <div key={b.id}
          onClick={() =>
            router.push(
              `/onboarding/select-phone?sessionId=${sessionId}&businessId=${b.id}`
            )
          }
        >
          {b.name}
        </div>
      ))}
    </div>
  );
}
API: Fetch Businesses
// /api/onboarding/businesses
const session = await prisma.onboardingSession.findUnique({ where: { id } });

return JSON.parse(session.businesses);
6. Step 2 → Phone Number Selection UI (IMPORTANT)

📄 /app/onboarding/select-phone/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SelectPhone() {
  const [phones, setPhones] = useState([]);
  const params = useSearchParams();

  const sessionId = params.get("sessionId");
  const businessId = params.get("businessId");

  useEffect(() => {
    fetch(`/api/onboarding/phones?sessionId=${sessionId}&businessId=${businessId}`)
      .then(res => res.json())
      .then(setPhones);
  }, []);

  return (
    <div>
      <h2>Select WhatsApp Number</h2>

      {phones.map((p: any) => (
        <div key={p.id} style={{ border: "1px solid", padding: 10 }}>
          <p>{p.display_phone_number}</p>
          <button onClick={() => connect(p)}>
            Use this number
          </button>
        </div>
      ))}
    </div>
  );

  async function connect(phone: any) {
    await fetch("/api/onboarding/complete", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        phoneNumberId: phone.id,
        wabaId: phone.waba_id,
      }),
    });

    window.location.href = "/dashboard";
  }
}


API: Fetch Phone Numbers
// /api/onboarding/phones

const session = await prisma.onboardingSession.findUnique({
  where: { id: sessionId },
});

const token = session.accessToken;

// Step 1 → get WABAs
const wabaRes = await axios.get(
  `https://graph.facebook.com/v19.0/${businessId}/owned_whatsapp_business_accounts`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

const wabaId = wabaRes.data.data[0].id;

// Step 2 → get phones
const phoneRes = await axios.get(
  `https://graph.facebook.com/v19.0/${wabaId}/phone_numbers`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

return phoneRes.data.data;


/api/onboarding/complete

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { sessionId, phoneNumberId, wabaId } = await req.json();

  const session = await prisma.onboardingSession.findUnique({
    where: { id: sessionId },
  });

  await prisma.channel.create({
    data: {
      tenantId: session.tenantId,
      phoneNumberId,
      wabaId,
      accessToken: session.accessToken,
    },
  });

  // Subscribe webhook
  await fetch(
    `https://graph.facebook.com/v19.0/${wabaId}/subscribed_apps`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  return Response.json({ success: true });
}

1. Multi-Number Support (Per Tenant)
🧠 Key Change

Previously:

1 tenant → 1 WhatsApp number

Now:

1 tenant → many numbers (channels)
🗄️ Updated Schema
model Channel {
  id            String   @id @default(uuid())
  tenantId      String
  name          String   // e.g. "Support", "Sales"
  phoneNumberId String
  displayNumber String
  accessToken   String
  wabaId        String
  isActive      Boolean  @default(true)

  createdAt     DateTime @default(now())
}
🔁 Message Routing Update

Instead of:

findFirst({ tenantId })

👉 Use phoneNumberId:

const channel = await prisma.channel.findFirst({
  where: { phoneNumberId },
});
💬 UI: Channel Switcher

📄 Example:

<select onChange={(e) => setChannel(e.target.value)}>
  {channels.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name} ({c.displayNumber})
    </option>
  ))}
</select>
🎯 Use Cases
Sales number
Support number
Marketing campaigns
💰 2. Billing System (Per WhatsApp Account)

⚠️ Important reality:

Meta already charges per conversation.

👉 You are building a markup SaaS billing layer

🧠 Billing Model Options
Option A (Recommended)
Per WhatsApp number (channel)
usage-based (messages/conversations)
🗄️ Billing Schema
model Subscription {
  id        String @id @default(uuid())
  tenantId  String
  plan      String
  status    String

  createdAt DateTime @default(now())
}

model Usage {
  id        String @id @default(uuid())
  tenantId  String
  channelId String

  messagesSent Int @default(0)
  messagesReceived Int @default(0)

  month     String
}
🔢 Track Usage

Whenever sending message:

await prisma.usage.upsert({
  where: {
    tenantId_channelId_month: {
      tenantId,
      channelId,
      month: "2026-04",
    },
  },
  update: {
    messagesSent: { increment: 1 },
  },
  create: {
    tenantId,
    channelId,
    month: "2026-04",
    messagesSent: 1,
  },
});
💳 Payment Integration

Use:

Stripe
Flow:
User selects plan
Create Stripe subscription
Store subscriptionId
Webhook updates status
💸 Example Pricing
₹999 / number / month
₹0.20 per conversation
📊 3. Analytics Dashboard
🧠 What to Track
Messages
sent / received
per day
Agents
chats handled
response time
Campaigns
delivered
replies
conversion rate
🗄️ Analytics Schema
model Campaign {
  id        String @id @default(uuid())
  tenantId  String
  name      String
  template  String

  sentCount Int @default(0)
  replyCount Int @default(0)

  createdAt DateTime @default(now())
}

model AgentStat {
  id        String @id @default(uuid())
  userId    String
  tenantId  String

  messagesHandled Int @default(0)
  avgResponseTime Float

  date DateTime
}
📈 Dashboard UI
6
📊 Example Charts
Messages Over Time
GET /api/analytics/messages?range=7d
Agent Performance
GET /api/analytics/agents
Campaign Stats
GET /api/analytics/campaigns
📉 Example Query
const messages = await prisma.message.groupBy({
  by: ["createdAt"],
  _count: true,
});
⚡ 4. Campaign Tracking

When sending broadcast:

await prisma.campaign.update({
  where: { id },
  data: {
    sentCount: { increment: 1 },
  },
});

When user replies:

replyCount++