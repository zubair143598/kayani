import type { NextConfig } from "next";
const config: NextConfig = {
 poweredByHeader: false,
 // Use threads for verification in environments that restrict child processes.
 ...(process.env.LOCAL_CHECK_THREADS === "1" ? { experimental: { workerThreads: true, cpus: 2, useTypeScriptCli: false } } : {}),
};
export default config;
