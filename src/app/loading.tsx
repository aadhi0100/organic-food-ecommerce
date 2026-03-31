import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-green-400 blur-xl opacity-50 animate-pulse dark:bg-green-600" />
          <Image
            src="/icon-512.svg"
            alt="OrganicFood"
            width={80}
            height={80}
            className="relative rounded-2xl shadow-xl animate-[bounce_2s_ease-in-out_infinite]"
          />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-green-600 dark:bg-green-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
