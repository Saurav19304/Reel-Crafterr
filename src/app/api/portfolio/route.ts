import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DB_URL = "https://extendsclass.com/api/json-storage/bin/fdfccdb";

// GET all portfolio items (or category covers)
export async function GET(request: NextRequest) {
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
    if (!Array.isArray(items)) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
      });
    }

    const { searchParams } = new URL(request.url);
    const getCovers = searchParams.get("covers") === "true";

    if (getCovers) {
      const covers = items.filter((item: any) => item.isCover);
      return NextResponse.json(covers, {
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
      });
    } else {
      const portfolioItems = items.filter((item: any) => !item.isCover);
      return NextResponse.json(portfolioItems, {
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
      });
    }
  } catch (err) {
    console.error("Failed to read extendsclass portfolio:", err);
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" }
    });
  }
}

// POST new portfolio item (expects JSON payload from client-side uploads)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if deletion action (works around environments that block HTTP DELETE)
    if (body.action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Item ID is required for deletion." }, { status: 400 });
      }

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
        console.warn("Could not read portfolio items for deletion");
      }

      if (!Array.isArray(items)) {
        return NextResponse.json({ error: "No portfolio database found." }, { status: 404 });
      }

      const filtered = items.filter((item: any) => String(item.id) !== String(id));

      const putRes = await fetch(DB_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtered)
      });

      if (!putRes.ok) {
        throw new Error("Failed to write to database bin");
      }

      return NextResponse.json({ success: true });
    }

    // Check if updating category cover page
    if (body.isCover) {
      const { category, mediaUrl } = body;
      if (!category || !mediaUrl) {
        return NextResponse.json({ error: "Category and media URL are required for covers." }, { status: 400 });
      }

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
        console.warn("Could not read database for covers, starting fresh");
      }

      if (!Array.isArray(items)) {
        items = [];
      }

      const existingCoverIndex = items.findIndex(
        (item: any) => item.isCover && item.category.toLowerCase() === category.toLowerCase()
      );

      const coverItem = {
        id: `cover_${category.toLowerCase()}`,
        isCover: true,
        category: category.toLowerCase(),
        mediaUrl
      };

      if (existingCoverIndex > -1) {
        items[existingCoverIndex] = coverItem;
      } else {
        items.push(coverItem);
      }

      const putRes = await fetch(DB_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items)
      });

      if (!putRes.ok) {
        throw new Error("Failed to write cover to database bin");
      }

      return NextResponse.json({ success: true, cover: coverItem });
    }

    const { title, category, mediaUrl, type, instagramUrl } = body;

    if (!title || !category || !mediaUrl) {
      return NextResponse.json({ error: "Title, category, and media URL are required." }, { status: 400 });
    }

    // Get current portfolio database
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
      instagramUrl: instagramUrl || "",
      mediaUrl,
      type: type || "image",
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
      return NextResponse.json({ error: "No portfolio database found." }, { status: 404 });
    }

    const filtered = items.filter((item: any) => String(item.id) !== String(id));

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
