export async function GET() {
  console.log("Cron triggered");
  return new Response("OK");
}