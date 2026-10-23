'use client';

export default function ShaderBackground() {
  return (
    <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative">
      <div
        className="w-full h-full absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          filter: 'blur(80px)',
          opacity: 0.6,
        }}
      />
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
