'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp } from '@/lib/animations';

interface VignetteContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  id: string;
  allowOverflow?: boolean;
  className?: string;
}

export default function VignetteContainer({
  title,
  subtitle,
  children,
  id,
  allowOverflow = false,
  className = ''
}: VignetteContainerProps) {
  return (
    <motion.article
      id={id}
      className={`w-full h-full ${
        allowOverflow ? 'overflow-visible' : 'overflow-hidden'
      } ${className}`}
      {...fadeInUp}
    >
      <div className="space-y-6">
        {/* Title Section - Only show if title is provided */}
        {title && (
          <div className="space-y-2">
            <h2 className="type-h2">
              {title}
            </h2>
            {subtitle && (
              <p className="type-body text-secondary">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content/Demo Section */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </motion.article>
  );
}
