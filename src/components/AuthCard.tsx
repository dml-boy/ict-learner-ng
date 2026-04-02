'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthCardProps {
  children: React.ReactNode;
  headerTitle: string;
  headerSubtitle: string;
  footerContent?: React.ReactNode;
  isSuccess?: boolean;
}

export default function AuthCard({ 
  children, 
  headerTitle, 
  headerSubtitle, 
  footerContent,
  isSuccess = false
}: AuthCardProps) {
  return (
    <div className="auth-page px-6">
      <div className="auth-container">
        <div className="glass-panel glossy-border p-10 md:p-16 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] group/card">
          <div className="auth-header">
            <div className="auth-logo-wrapper mb-10 translate-y-0 group-hover/card:-translate-y-2 transition-transform duration-500">
              <Link href="/">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center mx-auto glossy-border shadow-xl">
                  <Image 
                    src="/logosm.svg" 
                    alt="ICT Learner NG" 
                    width={56} 
                    height={52} 
                    priority 
                  />
                </div>
              </Link>
            </div>
            {!isSuccess && (
              <>
                <h1 className="gradient-text fluid-text-h2 font-black mb-4 tracking-tighter leading-tight">
                  {headerTitle}
                </h1>
                <p className="auth-subtitle text-text-muted font-bold text-lg opacity-80">
                  {headerSubtitle}
                </p>
              </>
            )}
          </div>

          <div className="mt-10">
            {children}
          </div>

          {footerContent && (
            <div className="auth-footer mt-12 pt-10 border-t border-white/10 dark:border-white/5 text-center">
              {footerContent}
            </div>
          )}

          <div className="auth-divider mt-10 text-center">
            <Link 
              href="/" 
              className="text-[0.75rem] text-text-muted hover:text-primary transition-all duration-300 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 group/link"
            >
              <span className="group-hover/link:-translate-x-2 transition-transform">←</span> 
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
