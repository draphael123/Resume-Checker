'use client';

import { useState } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import ResultsDisplay from '@/components/ResultsDisplay';
import ComparisonTable from '@/components/ComparisonTable';
import { ParsedResume } from '@/lib/resumeParser';
import { RoleMatch, RoleCategory } from '@/lib/roleMatcher';
import { Users, TrendingUp, BarChart3 } from 'lucide-react';

export default function Home() {
  const [resumes, setResumes] = useState<Array<{
    resume: ParsedResume;
    matches: RoleMatch[];
  }>>([]);
  const [selectedRole, setSelectedRole] = useState<RoleCategory>('Customer Service');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingResult, setViewingResult] = useState<number | null>(null);

  const handleUpload = async (file: File, name: string) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) {
        formData.append('name', name);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const data = await response.json();
      setResumes([...resumes, data]);
      setViewingResult(resumes.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const roles: RoleCategory[] = ['Customer Service', 'Medical Assistants', 'NPs', 'RNs'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resume Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload team member resumes to determine the best fit for Customer Service, Medical Assistants, NPs, and RNs roles
          </p>
        </div>

        {/* Stats Cards */}
        {resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{resumes.length}</p>
                </div>
                <Users className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Comparison</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{selectedRole}</p>
                </div>
                <BarChart3 className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Match</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {resumes.length > 0 && resumes[0].matches[0]?.score}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary-500" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Upload Resume
              </h2>
              <ResumeUpload onUpload={handleUpload} disabled={loading} />
              {loading && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <p className="text-sm text-gray-600 mt-2">Analyzing resume...</p>
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {viewingResult !== null && resumes[viewingResult] && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <ResultsDisplay
                  resume={resumes[viewingResult].resume}
                  matches={resumes[viewingResult].matches}
                  onClose={() => setViewingResult(null)}
                />
              </div>
            )}

            {resumes.length > 0 && (
              <>
                {/* Role Filter */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Compare by Role
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          setViewingResult(null);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedRole === role
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comparison Table */}
                <ComparisonTable resumes={resumes} selectedRole={selectedRole} />

                {/* Individual Results List */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    All Uploaded Resumes
                  </h2>
                  <div className="space-y-3">
                    {resumes.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setViewingResult(index)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.resume.name || `Resume ${index + 1}`}
                            </p>
                            {item.resume.email && (
                              <p className="text-sm text-gray-600">{item.resume.email}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Best Match</p>
                            <p className="text-lg font-semibold text-primary-600">
                              {item.matches[0]?.role} ({item.matches[0]?.score}%)
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {resumes.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No resumes uploaded yet
                </h3>
                <p className="text-gray-600">
                  Upload your first resume to get started with role matching
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

