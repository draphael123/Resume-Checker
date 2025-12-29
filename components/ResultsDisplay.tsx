'use client';

import { RoleMatch, RoleCategory } from '@/lib/roleMatcher';
import { ParsedResume } from '@/lib/resumeParser';
import { Award, TrendingUp, Briefcase, GraduationCap, BadgeCheck, X } from 'lucide-react';

interface ResultsDisplayProps {
  resume: ParsedResume;
  matches: RoleMatch[];
  onClose: () => void;
}

export default function ResultsDisplay({ resume, matches, onClose }: ResultsDisplayProps) {
  const bestMatch = matches[0];
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getRoleColor = (role: RoleCategory) => {
    const colors: Record<RoleCategory, string> = {
      'Customer Service': 'bg-purple-100 text-purple-800',
      'Medical Assistants': 'bg-blue-100 text-blue-800',
      'NPs': 'bg-green-100 text-green-800',
      'RNs': 'bg-red-100 text-red-800',
    };
    return colors[role];
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {resume.name || 'Resume Analysis'}
          </h2>
          {resume.email && (
            <p className="text-sm text-gray-600 mt-1">{resume.email}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Best Match Highlight */}
      {bestMatch && (
        <div className={`rounded-lg border-2 p-6 ${scoreColor(bestMatch.score)}`}>
          <div className="flex items-start gap-4">
            <Award className="h-8 w-8 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(bestMatch.role)}`}>
                  {bestMatch.role}
                </span>
                <span className="text-3xl font-bold">{bestMatch.score}%</span>
              </div>
              <p className="text-sm opacity-90">{bestMatch.reasoning}</p>
            </div>
          </div>
        </div>
      )}

      {/* All Matches */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Role Match Scores</h3>
        <div className="grid gap-4">
          {matches.map((match) => (
            <div
              key={match.role}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(match.role)}`}>
                    {match.role}
                  </span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900">{match.score}%</span>
                  </div>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: `${match.score}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{match.reasoning}</p>

              {/* Match Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {match.matchedExperience.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Briefcase className="h-3 w-3" />
                      <span className="font-medium">Experience</span>
                    </div>
                    <p className="text-gray-700">{match.matchedExperience.length} matches</p>
                  </div>
                )}
                {match.matchedSkills.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <BadgeCheck className="h-3 w-3" />
                      <span className="font-medium">Skills</span>
                    </div>
                    <p className="text-gray-700">{match.matchedSkills.length} matches</p>
                  </div>
                )}
                {match.matchedEducation.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <GraduationCap className="h-3 w-3" />
                      <span className="font-medium">Education</span>
                    </div>
                    <p className="text-gray-700">{match.matchedEducation.length} matches</p>
                  </div>
                )}
                {match.matchedCertifications.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Award className="h-3 w-3" />
                      <span className="font-medium">Certs</span>
                    </div>
                    <p className="text-gray-700">{match.matchedCertifications.length} matches</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Summary */}
      <div className="bg-gray-50 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {resume.skills.length > 0 && (
            <div>
              <p className="font-medium text-gray-700 mb-1">Key Skills:</p>
              <p className="text-gray-600">{resume.skills.slice(0, 10).join(', ')}</p>
            </div>
          )}
          {resume.certifications.length > 0 && (
            <div>
              <p className="font-medium text-gray-700 mb-1">Certifications:</p>
              <p className="text-gray-600">{resume.certifications.slice(0, 5).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

