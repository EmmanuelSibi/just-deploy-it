
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ellipsis, PencilLineIcon, RocketIcon, SeparatorHorizontalIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import homesvg from '../public/home.svg'


console.log("Hello, world!");

export default function Component() {

  return (
    <div className="flex flex-col min-h-[100vh] bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#2a2a2a]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#3a3a3a] dark:text-[#f0f0f0]">
                  Just{"  "}<Ellipsis className="h-8 w-8 inline-block" />{"  "}Deploy {"  "}<Ellipsis className="h-8 w-8 inline-block" />{"  "}It {"  "}<RocketIcon className="h-8 w-8 inline-block" />
                </h1>
                <p className="mx-auto max-w-[700px] text-[#5a5a5a] md:text-xl dark:text-[#d0d0d0]">
                  Effortless cloud deployment for your projects. Just provide a
                  GitHub URL and we will handle the rest.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#3a3a3a] px-4 py-2 text-sm font-medium text-[#f0f0f0] shadow transition-colors hover:bg-[#3a3a3a]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2a2a2a] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#f0f0f0] dark:text-[#3a3a3a] dark:hover:bg-[#f0f0f0]/90 dark:focus-visible:ring-[#d0d0d0]"
                  href="/deploy"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f0f0] dark:bg-[#2a2a2a]">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-[#e0e0e0] px-3 py-1 text-sm dark:bg-[#3a3a3a]">
                    GitHub Integration
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#3a3a3a] dark:text-[#f0f0f0]">
                    Deploy from GitHub
                  </h2>
                  <p className="max-w-[600px] text-[#5a5a5a] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-[#d0d0d0]">
                    Simply provide a GitHub URL and JustDeployIt will handle the
                    rest. No more manual deployments or complex configurations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#3a3a3a] px-8 text-sm font-medium text-[#f0f0f0] shadow transition-colors hover:bg-[#3a3a3a]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2a2a2a] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#f0f0f0] dark:text-[#3a3a3a] dark:hover:bg-[#f0f0f0]/90 dark:focus-visible:ring-[#d0d0d0]"
                    href="/deploy"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              {/* <img
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.svg"
                width="550"
              /> */}
              <Image src={homesvg} className="mx-auto aspect-image overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last" />

            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-[#3a3a3a] dark:text-[#f0f0f0]">
                Experience the easiest cloud deployment platform.
              </h2>
              <p className="mx-auto max-w-[600px] text-[#5a5a5a] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-[#d0d0d0]">
                Let your team focus on building great products, not managing
                infrastructure.
              </p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
