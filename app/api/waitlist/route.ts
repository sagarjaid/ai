import crypto from "node:crypto";

import { NextResponse } from "next/server";

interface WaitlistRequestBody {
  parentName: string;
  kidsName: string;
  email: string;
  phone: string;
  country: string;
  grade: string;
  subject: string;
  currentUrl?: string;
}

const FACEBOOK_PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION ?? "v18.0";

const SHEETY_URL =
  "https://api.sheety.co/33d9ec27f5c7dfb130eb655baacab48d/aiforjrLeads/leads";

const REQUIRED_ENV_VARS: Record<string, string | undefined> = {
  FACEBOOK_PIXEL_ID: FACEBOOK_PIXEL_ID,
  FACEBOOK_ACCESS_TOKEN: FACEBOOK_ACCESS_TOKEN,
};

const isEnvConfigured = Object.entries(REQUIRED_ENV_VARS).every(
  ([, value]) => Boolean(value)
);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizePhone = (phone: string) =>
  phone.replace(/[^\d]/g, "").replace(/^0+/, "");

const extractFirstName = (value: string) =>
  value.trim().split(/\s+/)[0] ?? "";

const normalizeFirstName = (value: string) =>
  extractFirstName(value).toLowerCase().replace(/[^a-z]/g, "");

const normalizeCountry = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z]/g, "");

const hashSha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

async function sendToSheety(body: WaitlistRequestBody) {
  const phoneNumber = Number.parseInt(body.phone, 10);

  const sheetyResponse = await fetch(SHEETY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lead: {
        parentName: body.parentName,
        kidsName: body.kidsName,
        email: body.email,
        phoneNumber: Number.isNaN(phoneNumber) ? body.phone : phoneNumber,
        country: body.country,
        grade: body.grade,
        subject: body.subject,
        currectUrl: body.currentUrl ?? "",
        date: new Date().toISOString().split("T")[0],
      },
    }),
  });

  if (!sheetyResponse.ok) {
    const errorData = await sheetyResponse.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Sheety request failed with ${sheetyResponse.status}`
    );
  }
}

async function sendLeadToFacebook(body: WaitlistRequestBody) {
  if (!isEnvConfigured) {
    console.warn(
      "Facebook Conversions API env vars missing, skipping lead event"
    );
    return;
  }

  const endpoint = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${FACEBOOK_PIXEL_ID}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;

  const userData: Record<string, string[]> = {
    em: [hashSha256(normalizeEmail(body.email))],
    ph: [hashSha256(normalizePhone(body.phone))],
  };

  const normalizedFirstName = normalizeFirstName(body.parentName);
  if (normalizedFirstName) {
    userData.fn = [hashSha256(normalizedFirstName)];
  }

  const normalizedCountry = normalizeCountry(body.country);
  if (normalizedCountry) {
    userData.country = [hashSha256(normalizedCountry)];
  }

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          ...userData,
        },
        action_source: "website",
      },
    ],
  };

  const facebookResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!facebookResponse.ok) {
    const errorData = await facebookResponse.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Facebook request failed with ${facebookResponse.status}`
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<WaitlistRequestBody>;

    if (
      !body.parentName ||
      !body.kidsName ||
      !body.email ||
      !body.phone ||
      !body.country ||
      !body.grade ||
      !body.subject
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedBody: WaitlistRequestBody = {
      parentName: body.parentName.trim(),
      kidsName: body.kidsName.trim(),
      email: normalizeEmail(body.email),
      phone: normalizePhone(body.phone),
      country: body.country,
      grade: body.grade,
      subject: body.subject,
      currentUrl: body.currentUrl,
    };

    await sendToSheety(normalizedBody);
    await sendLeadToFacebook(normalizedBody);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist submission error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit waitlist request",
      },
      { status: 500 }
    );
  }
}

