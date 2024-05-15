"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FileBadge,
  GitBranchPlus,
  Github,
  GithubIcon,
  LucideGithub,
  RocketIcon,
} from "lucide-react";
import { Fira_Code } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const firaCode = Fira_Code({ subsets: ["latin"] });

export default function Home() {
  const [repoURL, setURL] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [deployPreviewURL, setDeployPreviewURL] = useState("");
  const [deploymentId, setDeploymentId] = useState(null);
  const intervalRef = useRef(null);
  const logContainerRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const REVERSE_PROXY_DOMAIN = process.env.NEXT_PUBLIC_REVERSE_PROXY_DOMAIN;

  const isValidURL = useMemo(() => {
    if (!repoURL || repoURL.trim() === "") return [false, null];
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(repoURL), "Enter valid Github Repository URL"];
  }, [repoURL]);

  const startPolling = useCallback((id) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    console.log("start polling");

    intervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/logs/${id}`);
        if (response.data) {
          const sortedLogs = response.data.logs.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          setLogs(sortedLogs);
          console.log("logs", sortedLogs);
          // Check if last log is "Upload Completed" and stop polling if true
          if (
            response.data.logs.length > 0 &&
            (response.data.logs.length > 19 ||
              response.data.logs.slice(-1)[0].log.includes("Upload Completed"))
          ) {
            stopPolling();
          }
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }, 2000);
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    console.log("stop polling");
  }, []);

  useEffect(() => {
    return stopPolling;
  }, [stopPolling]);

  useEffect(() => {
    if (deploymentId) {
      startPolling(deploymentId);
    } else {
      stopPolling();
      setLogs([]);
    }
  }, [deploymentId, startPolling, stopPolling]);

  const handleClickDeploy = useCallback(async () => {
    setLoading(true);
    const { data } = await axios.post(`${BACKEND_URL}/project`, {
      gitURL: repoURL,
      name: projectName,
    });

    if (data && data.data) {
      const { id, name, subDomain } = data.data.project;
      console.log("id", id);
      console.log("name", name);
      console.log("subdomain", subDomain);
      console.log(data.data.project);
      const PreviewURL = `http://${subDomain}.${REVERSE_PROXY_DOMAIN}`;
      setProjectName(projectName);
      const result = await axios.post(`${BACKEND_URL}/deploy`, {
        projectId: id,
      });

      console.log("result", result.data.data.deploymentId);
      const deploymentId = result.data.data.deploymentId;
      setDeploymentId(deploymentId);
      setDeployPreviewURL(null);
      console.log(PreviewURL);

      // Start polling on successful deployment
      startPolling(deploymentId);
      setTimeout(() => {
        setLoading(false);
        setDeployPreviewURL(PreviewURL);
      }, 40000);
    }
  }, [projectName, repoURL]);

  return (
    <main className="flex justify-center items-center h-[100vh] bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#2a2a2a]">
      <div className="w-[600px]">
        <span className="flex justify-start items-center gap-2">
          <GithubIcon className="text-5xl" />
          <Input
            className="w-full"
            disabled={loading}
            value={repoURL}
            onChange={(e) => setURL(e.target.value)}
            type="url"
            placeholder="Github URL"
          />
        </span>
        <span className="flex justify-start items-center gap-2 mt-2">
          <FileBadge className="w-6 h-6" />
          <Input
            disabled={loading}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />
        </span>
        <span className="flex justify-start items-center gap-2 mt-2">
          <RocketIcon className="w-6 h-6" />
          <Button
            onClick={handleClickDeploy}
            disabled={!isValidURL[0] || loading}
            className="w-full mt-3 "
          >
            {loading ? "In Progress" : "Deploy"}
          </Button>
        </span>
        {loading ? (
          <div className="flex items-center justify-center mt-2">
            <div className="w-12 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        ) : (
          deployPreviewURL && (
            <div className="mt-2 bg-slate-900 py-4 px-2 rounded-lg">
              <p>
                Preview URL{" "}
                <a
                  target="_blank"
                  className="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg"
                  href={deployPreviewURL}
                >
                  {deployPreviewURL}
                </a>
              </p>
            </div>
          )
        )}
        {logs.length > 0 && (
          <div
            className={`${firaCode.className} text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}
          >
            <pre className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <code
                  ref={logs.length - 1 === i ? logContainerRef : undefined}
                  key={i}
                >{`> ${log.log}`}</code>
              ))}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
