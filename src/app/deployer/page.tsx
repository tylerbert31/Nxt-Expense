// app/deployer/page.tsx
import { exec } from "child_process";
import { NextResponse } from "next/server";

async function executeCommand(command: string) {
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

export default async function DeployerPage() {
  try {
    await executeCommand("git fetch origin master");
    await executeCommand("git pull origin master");
    await executeCommand("npm run build");
    await executeCommand('pm2 restart "nexpense"');

    return NextResponse.json({
      success: true,
      message: "Deployment completed successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Deployment failed: ${error}`,
    });
  }
}
