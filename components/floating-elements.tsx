"use client"

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full floating-element blur-sm"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400/30 to-red-400/30 rounded-lg floating-element blur-sm rotate-45"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full floating-element blur-sm"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-lg floating-element blur-sm rotate-12"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full floating-element blur-sm"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute top-1/3 right-1/3 w-14 h-14 bg-gradient-to-r from-teal-400/30 to-cyan-400/30 rounded-lg floating-element blur-sm rotate-45"
        style={{ animationDelay: "5s" }}
      />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 mesh-gradient" />
    </div>
  )
}
