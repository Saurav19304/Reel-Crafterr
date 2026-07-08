import { NextRequest, NextResponse } from "next/server";

const DB_URL = "https://extendsclass.com/api/json-storage/bin/fdfccdb";

// GET all portfolio items
export async function GET() {
  try {
    const res = await fetch(DB_URL, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }
    const items = await res.json();
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch (err) {
    console.error("Failed to read extendsclass portfolio:", err);
    return NextResponse.json([]);
  }
}

// POST new portfolio item
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const file = formData.get("file") as File | null;

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required." }, { status: 400 });
    }

    if (file && file.size > 0) {
      // Direct file upload is not supported in read-only Vercel serverless environment
      return NextResponse.json({
        error: "Direct file uploads are not supported on Vercel serverless hosting. Please enter an Instagram Post / Reel URL instead, which will be loaded dynamically in high-resolution."
      }, { status: 400 });
    }

    if (!instagramUrl) {
      return NextResponse.json({ error: "An Instagram Post or Reel URL is required." }, { status: 400 });
    }

    let mediaUrl = "";
    const lowerCategory = category.toLowerCase();
    
    // Set default category image fallback
    if (lowerCategory.includes("automotive")) {
      mediaUrl = "/assets/images/car.png";
    } else if (lowerCategory.includes("decor") || lowerCategory.includes("estate")) {
      mediaUrl = "/assets/images/decor.png";
    } else if (lowerCategory.includes("wedding")) {
      mediaUrl = "/assets/images/wedding.png";
    } else {
      mediaUrl = "/assets/images/haldi.png";
    }

    const type = instagramUrl.includes("/reel/") ? "video" : "image";

    // Get current portfolio database
    let items = [];
    try {
      const getRes = await fetch(DB_URL, { cache: "no-store" });
      if (getRes.ok) {
        items = await getRes.json();
      }
    } catch (e) {
      console.warn("Could not read current portfolio, starting fresh");
    }

    if (!Array.isArray(items)) {
      items = [];
    }
    
    // Create new item
    const newItem = {
      id: Date.now(),
      title,
      category,
      instagramUrl,
      mediaUrl,
      type,
      likes: `${(Math.random() * 20 + 2).toFixed(1)}K`,
      views: `${(Math.random() * 300 + 40).toFixed(0)}K`
    };

    items.push(newItem);

    // Save updated portfolio
    const putRes = await fetch(DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items)
    });

    if (!putRes.ok) {
      throw new Error("Failed to write to database bin");
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload portfolio item." }, { status: 500 });
  }
}

// DELETE portfolio item
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    // Get current portfolio database
    let items = [];
    const getRes = await fetch(DB_URL, { cache: "no-store" });
    if (getRes.ok) {
      items = await getRes.json();
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "No portfolio database found." }, { status: 404 });
    }

    const filtered = items.filter((item: any) => item.id !== Number(id));

    // Save updated portfolio
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
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete item." }, { status: 500 });
  }
}
