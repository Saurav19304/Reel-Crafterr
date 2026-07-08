import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "data", "portfolio.db.json");

// Read helper
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Failed to read portfolio DB:", err);
    return [];
  }
}

// Write helper
function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write portfolio DB:", err);
  }
}

export async function GET() {
  const items = readDb();
  return NextResponse.json(items);
}

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

    let mediaUrl = "";
    let type: "image" | "video" = "image";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filename = `${Date.now()}-${safeName}`;
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      mediaUrl = `/uploads/${filename}`;

      // Determine type
      if (file.type.startsWith("video") || filename.endsWith(".mp4") || filename.endsWith(".mov") || filename.endsWith(".webm")) {
        type = "video";
      }
    } else if (instagramUrl) {
      // If no file but there is an instagramUrl, we can use the category cover as default thumbnail
      if (category.toLowerCase().includes("automotive")) {
        mediaUrl = "/assets/images/car.png";
      } else if (category.toLowerCase().includes("decor")) {
        mediaUrl = "/assets/images/decor.png";
      } else if (category.toLowerCase().includes("wedding")) {
        mediaUrl = "/assets/images/wedding.png";
      } else {
        mediaUrl = "/assets/images/haldi.png";
      }
      type = instagramUrl.includes("/reel/") ? "video" : "image";
    } else {
      return NextResponse.json({ error: "Either a file upload or an Instagram URL is required." }, { status: 400 });
    }

    const items = readDb();
    
    // Create new item
    const newItem = {
      id: Date.now(),
      title,
      category,
      instagramUrl: instagramUrl || "",
      mediaUrl,
      type,
      likes: `${(Math.random() * 20 + 2).toFixed(1)}K`,
      views: `${(Math.random() * 300 + 40).toFixed(0)}K`
    };

    items.push(newItem);
    writeDb(items);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload portfolio item." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const items = readDb();
    const itemIndex = items.findIndex((item: any) => item.id === Number(id));

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const itemToDelete = items[itemIndex];

    // If it's a locally uploaded file, delete it from public/uploads
    if (itemToDelete.mediaUrl && itemToDelete.mediaUrl.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", itemToDelete.mediaUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Failed to delete local file:", err);
      }
    }

    items.splice(itemIndex, 1);
    writeDb(items);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete item." }, { status: 500 });
  }
}
