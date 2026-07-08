import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "data", "bookings.db.json");

// Read helper
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Failed to read bookings DB:", err);
    return [];
  }
}

// Write helper
function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write bookings DB:", err);
  }
}

export async function GET() {
  const items = readDb();
  // Sort by ID (timestamp) descending (newest first)
  const sorted = items.sort((a: any, b: any) => b.id - a.id);
  return NextResponse.json(sorted);
}

export async function POST(request: NextRequest) {
  try {
    const { name, contact, plan, date, brief } = await request.json();

    if (!name || !contact || !plan) {
      return NextResponse.json({ error: "Name, contact, and plan are required." }, { status: 400 });
    }

    const items = readDb();
    
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
    writeDb(items);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err: any) {
    console.error("Booking post error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit booking inquiry." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const items = readDb();
    const index = items.findIndex((item: any) => item.id === Number(id));

    if (index === -1) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    items.splice(index, 1);
    writeDb(items);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Booking delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete booking." }, { status: 500 });
  }
}
