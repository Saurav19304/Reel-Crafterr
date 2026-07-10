import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DB_URL = "https://extendsclass.com/api/json-storage/bin/aacfeca";

// GET all bookings
export async function GET() {
  try {
    const res = await fetch(DB_URL, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
      next: { revalidate: 0 }
    });
    if (!res.ok) {
      return NextResponse.json([], { 
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
      });
    }
    const items = await res.json();
    // Sort by ID descending (newest first)
    const sorted = Array.isArray(items) ? items.sort((a: any, b: any) => b.id - a.id) : [];
    return NextResponse.json(sorted, {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
    });
  } catch (err) {
    console.error("Failed to read extendsclass bookings:", err);
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
    });
  }
}

// POST new booking
export async function POST(request: NextRequest) {
  try {
    const { name, contact, plan, date, brief } = await request.json();

    if (!name || !contact || !plan) {
      return NextResponse.json({ error: "Name, contact, and plan are required." }, { status: 400 });
    }

    // Get current bookings
    let items = [];
    try {
      const getRes = await fetch(DB_URL, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
        next: { revalidate: 0 }
      });
      if (getRes.ok) {
        items = await getRes.json();
      }
    } catch (e) {
      console.warn("Could not read current bookings, starting fresh");
    }

    if (!Array.isArray(items)) {
      items = [];
    }

    const newBooking = {
      id: Date.now(),
      name,
      contact,
      plan,
      date: date || "TBD",
      brief: brief || "No details provided",
      createdAt: new Date().toLocaleString()
    };

    items.push(newBooking);

    // Save updated list
    const putRes = await fetch(DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items)
    });

    if (!putRes.ok) {
      throw new Error("Failed to write to database bin");
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err: any) {
    console.error("Booking post error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit booking inquiry." }, { status: 500 });
  }
}

// DELETE booking
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    // Get current bookings
    let items = [];
    const getRes = await fetch(DB_URL, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
      next: { revalidate: 0 }
    });
    if (getRes.ok) {
      items = await getRes.json();
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "No bookings database found." }, { status: 404 });
    }

    const filtered = items.filter((item: any) => item.id !== Number(id));

    // Save updated list
    const putRes = await fetch(DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtered)
    });

    if (!putRes.ok) {
      throw new Error("Failed to update database bin");
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Booking delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete booking." }, { status: 500 });
  }
}
