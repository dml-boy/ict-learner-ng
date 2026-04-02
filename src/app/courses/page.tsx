'use client';

import { useState, useEffect } from 'react';
import LandingHeader from '@/components/LandingHeader';
import LandingFooter from '@/components/LandingFooter';
import Link from 'next/link';
import Image from 'next/image';

interface Subject {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const MOCK_SUBJECTS: Subject[] = [
  { _id: '1', title: 'Web Development', description: 'Master HTML, CSS, and modern JavaScript to build stunning real-world applications.', icon: '🌐', color: '#10b981' },
  { _id: '2', title: 'Python Programming', description: 'Learn the fundamentals of Python and dive into data science and automation.', icon: '🐍', color: '#3b82f6' },
  { _id: '3', title: 'Cloud Computing', description: 'Explore AWS, Azure, and Google Cloud to deploy scalable global infrastructures.', icon: '☁️', color: '#6366f1' },
];

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch('/api/subjects');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setSubjects(json.data);
        } else {
          setSubjects(MOCK_SUBJECTS);
        }
      } catch (err) {
        setSubjects(MOCK_SUBJECTS);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#044331] font-['Outfit','Inter',system-ui,sans-serif]">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-24 px-6 max-w-[1140px] mx-auto text-center">
        <div className="reveal-up">
          <span className="bg-emerald-50 text-emerald-600 py-2 px-5 rounded-full text-sm font-bold mb-6 inline-block uppercase tracking-wider">
            Curriculum Catalog
          </span>
          <h1 className="text-5xl md:text-[4rem] font-black mb-8 leading-tight">
            Explore Our World-Class <br /> ICT Subjects
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
            From foundational digital literacy to advanced software engineering—curated for the ambitious Nigerian student.
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-20 px-6 bg-slate-50 relative min-h-[600px]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-[1140px] mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {subjects.map((subject, i) => (
                <div 
                  key={subject._id} 
                  className="bg-white p-10 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(4,67,49,0.08)] flex flex-col items-center text-center group reveal-up"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div 
                    className="w-24 h-24 rounded-[28px] flex items-center justify-center text-5xl mb-8 transition-transform group-hover:scale-110 duration-500 overflow-hidden relative"
                    style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                  >
                    {subject.icon?.startsWith('http') ? (
                      <Image 
                        src={subject.icon} 
                        alt={subject.title} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      subject.icon
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{subject.title}</h3>
                  <div className="h-1 w-12 bg-emerald-200 mb-6 group-hover:w-24 transition-all duration-500 rounded-full"></div>
                  <p className="text-slate-500 leading-relaxed text-[17px] mb-10 flex-grow">
                    {subject.description}
                  </p>
                  
                  <Link 
                    href="/login" 
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#044331] transition-all shadow-xl hover:shadow-emerald-900/10"
                  >
                    Enroll to Learn <span className="text-xl">🎓</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-[900px] mx-auto text-center reveal-up">
           <h2 className="text-3xl md:text-4xl font-black mb-8">Can't find what you're looking for?</h2>
           <p className="text-slate-500 text-lg mb-12">
             Our curriculum is constantly expanding based on institutional partnerships and the needs of Nigerian tech ecosystems. 
           </p>
           <Link href="/contact" className="text-[#044331] font-black underline underline-offset-8 decoration-emerald-300 hover:text-emerald-600 transition-all uppercase tracking-widest text-sm">
             Request a Custom Subject
           </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
