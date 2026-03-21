import { promises as fs } from "fs";
import path from "path";

async function replaceInDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceInDir(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx") || fullPath.endsWith(".js") || fullPath.endsWith(".jsx"))) {
      let content = await fs.readFile(fullPath, "utf-8");
      if (content.includes("£")) {
        content = content.replaceAll("£", "₹");
        await fs.writeFile(fullPath, content, "utf-8");
        console.log(`Updated currency in ${fullPath}`);
      }
      if (content.includes("€")) {
        content = content.replaceAll("€", "₹");
        await fs.writeFile(fullPath, content, "utf-8");
        console.log(`Updated euro currency in ${fullPath}`);
      }
    }
  }
}

replaceInDir("./src").then(() => console.log("Done."));
