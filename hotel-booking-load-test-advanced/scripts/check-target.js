const target = process.env.TARGET_URL || "http://localhost:3000";

async function main() {
  const url = `${target.replace(/\\/$/, "")}/api/rooms`;
  console.log(`Checking backend: ${url}`);

  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const body = await response.text();
    console.log(`HTTP status: ${response.status}`);
    console.log(`Response preview: ${body.slice(0, 500)}`);

    if (!response.ok) {
      console.error("The endpoint responded, but its status is not 2xx.");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Could not connect. Start your backend and check TARGET_URL.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
