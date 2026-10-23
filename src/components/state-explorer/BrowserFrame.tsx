interface BrowserFrameProps {
  url?: string
  children: React.ReactNode
}

export default function BrowserFrame({ url = 'localhost:5174', children }: BrowserFrameProps) {
  return (
    <div className="rounded-2xl border border-neutral-300 bg-white overflow-hidden">
      {/* Chrome bar */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-50 border-b border-neutral-200">
        <div className="flex gap-1.5">
          <div className="w-[11px] h-[11px] rounded-full bg-neutral-300" />
          <div className="w-[11px] h-[11px] rounded-full bg-neutral-300" />
          <div className="w-[11px] h-[11px] rounded-full bg-neutral-300" />
        </div>
        <div className="flex-1 mx-1">
          <div className="text-demo-md text-neutral-400 font-mono bg-white rounded-md px-3 py-[5px] border border-neutral-200 max-w-[200px]">
            {url}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  )
}
