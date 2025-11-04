import { NextResponse, NextRequest } from "next/server";
// import { createClient } from "@/libs/supabase/server";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component or <BetaWaitlistForm />
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Here you can add your own logic
    // For instance, sending a welcome email (use the the sendEmail helper function from /libs/resend)
    // For instance, saving the lead in the database (uncomment the code below)

    // const supabase = await createClient();
    // await supabase.from("leads").insert({ 
    //   email: body.email,
    //   name: body.name,
    //   phone: body.phone,
    //   country: body.country,
    //   grade: body.grade,
    //   subject: body.subject,
    // });

    // Log the form data for now (you can replace this with database storage)
    console.log("Beta waitlist submission:", {
      email: body.email,
      name: body.name,
      phone: body.phone,
      country: body.country,
      grade: body.grade,
      subject: body.subject,
    });

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
