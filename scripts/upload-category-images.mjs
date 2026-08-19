import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local if present
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error(
    "Make sure .env.local exists or pass them via environment variables:",
  );
  console.error(
    "SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-category-images.mjs",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const uploadDir = path.join(
  process.cwd(),
  "supabase_storage_upload",
  "categories",
);

if (!fs.existsSync(uploadDir)) {
  console.error(`❌ Upload directory not found: ${uploadDir}`);
  process.exit(1);
}

async function run() {
  console.log(`🚀 Connecting to Supabase: ${supabaseUrl}`);
  console.log(`📁 Uploading images from: ${uploadDir}\n`);

  const files = fs.readdirSync(uploadDir).filter((f) => f.endsWith(".jpg"));

  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `categories/${file}`;
    const categoryId = file.replace(/\.jpg$/, "");

    process.stdout.write(`Uploading ${storagePath}... `);

    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.log(`❌ Failed: ${uploadError.message}`);
      continue;
    }

    // Update database
    const { error: dbError } = await supabase
      .from("categories")
      .update({ image_storage_path: storagePath })
      .eq("id", categoryId);

    if (dbError) {
      console.log(`⚠️ Uploaded, but DB update failed: ${dbError.message}`);
    } else {
      console.log(`✅ Uploaded & Linked to Category ${categoryId}`);
    }
  }

  console.log("\n🎉 All category images processed successfully!");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
