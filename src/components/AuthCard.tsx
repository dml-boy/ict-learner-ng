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
    <div className="auth-page px-4">
      <div className="auth-container">
        <div className="peak-card transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10">
          <div className="auth-header">
            <div className="auth-logo-wrapper mb-8">
              <Link href="/">
                <Image 
                  src="/logosm.svg" 
                  alt="ICT Learner NG" 
                  width={64} 
                  height={58} 
                  className="mx-auto" 
                  priority 
                />
              </Link>
            </div>
            {!isSuccess && (
              <>
                <h1 className="gradient-text text-4xl font-black mb-3 tracking-tight">
                  {headerTitle}
                </h1>
                <p className="auth-subtitle text-slate-500 font-medium">
                  {headerSubtitle}
                </p>
              </>
            )}
          </div>

          <div className="mt-8">
            {children}
          </div>

          {footerContent && (
            <div className="auth-footer mt-12 pt-8 border-t border-slate-100 text-center">
              {footerContent}
            </div>
          )}

          <div className="auth-divider mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-slate-400 hover:text-[#044331] transition-colors font-bold uppercase tracking-widest flex items-center justify-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
