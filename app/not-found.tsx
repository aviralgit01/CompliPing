import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    // <div classNameName="h-screen w-full flex items-center justify-center bg-[var(--color-brand-muted)] relative overflow-hidden">

    //   {/* Background glow */}
    //   <div classNameName="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)]/20 via-transparent to-[var(--color-brand-accent)]/20 blur-3xl" />

    //   {/* Floating circles */}
    //   <div classNameName="absolute w-72 h-72 bg-[var(--color-brand-primary)]/20 rounded-full top-10 left-10 animate-float-slow" />
    //   <div classNameName="absolute w-60 h-60 bg-[var(--color-brand-accent)]/20 rounded-full bottom-10 right-10 animate-float-reverse" />

    //   {/* Content */}
    //   <div classNameName="relative text-center px-6">

    //     {/* 404 */}
    //     <h1 classNameName="text-8xl font-bold text-[var(--color-brand-primary)] animate-fade-scale">
    //       404
    //     </h1>

    //     {/* Message */}
    //     <p classNameName="mt-4 text-lg text-gray-700 animate-fade-up">
    //       You landed on a page that doesn’t exist.
    //     </p>

    //     {/* Button */}
    //     <a href="/">
    //       <button classNameName="mt-8 px-6 py-3 rounded-xl bg-[var(--color-brand-primary)] text-white font-medium shadow-lg hover:bg-[var(--color-brand-secondary)] transition-all duration-300 hover:scale-105">
    //         Go Home
    //       </button>
    //     </a>

    //     {/* Subtle blinking text */}
    //     <p classNameName="mt-8 text-sm text-gray-500 animate-pulse-slow">
    //       ERROR 404
    //     </p>
    //   </div>
    // </div>

    <div className="h-full w-full bg-gray-50 flex items-center">
      <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
        <div className="w-full lg:w-1/2 mx-12">
          <div className="text-7xl text-brand-primary font-dark font-extrabold mb-8">
            {" "}
            404
          </div>
          <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
            Sorry we couldn't find the page you're looking for
          </p>

          <Link
            href="/"
            className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-brand-primary active:bg-brand-primary hover:bg-primary-blue"
          >
            back to homepage
          </Link>
        </div>
        <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
          <Image
            height={20}
            width={20}
            className="w-full h-full"
            src={
              "https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
            }
            alt="not fund image"
          />
        </div>
      </div>
    </div>
  );
}
