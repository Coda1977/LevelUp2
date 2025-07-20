import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure audio directory exists
const audioDir = path.join(process.cwd(), "public", "audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

export async function generateAudio(text: string, chapterId: number, voice: string = "alloy"): Promise<string> {
  try {
    const filename = `chapter-${chapterId}-${Date.now()}.mp3`;
    const filePath = path.join(audioDir, filename);
    
    console.log(`Generating audio for chapter ${chapterId}...`);
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.audio.speech.create({
      model: "tts-1", // Standard quality for faster generation
      voice: voice as any,
      input: text,
      response_format: "mp3",
    });

    // Convert response to buffer and save
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    console.log(`Audio generated: ${filename}`);
    
    // Return the public URL path
    return `/audio/${filename}`;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error("Failed to generate audio");
  }
}

export async function generateHighQualityAudio(text: string, chapterId: number, voice: string = "alloy"): Promise<string> {
  try {
    const filename = `chapter-${chapterId}-hd-${Date.now()}.mp3`;
    const filePath = path.join(audioDir, filename);
    
    console.log(`Generating HD audio for chapter ${chapterId}...`);
    
    const response = await openai.audio.speech.create({
      model: "tts-1-hd", // High quality for better audio
      voice: voice as any,
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    console.log(`HD Audio generated: ${filename}`);
    
    return `/audio/${filename}`;
  } catch (error) {
    console.error("Error generating HD audio:", error);
    throw new Error("Failed to generate HD audio");
  }
}

export function deleteAudioFile(audioUrl: string): void {
  try {
    if (audioUrl && audioUrl.startsWith('/audio/')) {
      const filename = audioUrl.replace('/audio/', '');
      const filePath = path.join(audioDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted audio file: ${filename}`);
      }
    }
  } catch (error) {
    console.error("Error deleting audio file:", error);
  }
}

// Clean up old audio files (optional maintenance function)
export function cleanupOldAudioFiles(daysOld: number = 30): void {
  try {
    const files = fs.readdirSync(audioDir);
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    files.forEach(file => {
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtime.getTime() < cutoffTime) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old audio file: ${file}`);
      }
    });
  } catch (error) {
    console.error("Error cleaning up audio files:", error);
  }
}