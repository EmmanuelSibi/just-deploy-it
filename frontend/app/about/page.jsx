const { Button } = require("@/components/ui/button");
export default function About() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#2a2a2a]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#f0f0f0] dark:bg-[#2a2a2a]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_500px] items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#3a3a3a] dark:text-[#f0f0f0]">
                  About JustDeployIt
                </h1>
                <p className="max-w-[600px] text-[#5a5a5a] md:text-xl dark:text-[#d0d0d0]">
                  JustDeployIt is a platform that makes it easy to deploy your
                  projects with a single click. We believe in simplicity and
                  efficiency, so we have built a tool that takes the hassle out
                  of deployment.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    className="bg-[#3a3a3a] text-[#f0f0f0] hover:bg-[#4a4a4a] dark:bg-[#f0f0f0] dark:text-[#3a3a3a] dark:hover:bg-[#e0e0e0]"
                    variant="primary"
                  >
                    Learn More
                  </Button>
                  <Button
                    className="bg-[#e0e0e0] text-[#3a3a3a] hover:bg-[#d0d0d0] dark:bg-[#3a3a3a] dark:text-[#f0f0f0] dark:hover:bg-[#4a4a4a]"
                    variant="secondary"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
              <img
                alt="About"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                height={500}
                src="/placeholder.svg"
                width={500}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
