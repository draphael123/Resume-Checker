'use client';

import { RoleMatch, RoleCategory } from '@/lib/roleMatcher';
import { ParsedResume } from '@/lib/resumeParser';
import { Trophy, Award } from 'lucide-react';

interface BestCandidatesSummaryProps {
  resumes: Array<{
    resume: ParsedResume;
    matches: RoleMatch[];
  }>;
}

export default function BestCandidatesSummary({ resumes }: BestCandidatesSummaryProps) {
  const roles: RoleCategory[] = ['Customer Service', 'Medical Assistants', 'NPs', 'RNs'];
  
  const getBestCandidateForRole = (role: RoleCategory) => {
    let bestIndex = -1;
    let bestScore = -1;
    
    resumes.forEach((item, index) => {
      const match = item.matches.find(m => m.role === role);
      if (match && match.score > bestScore) {
        bestScore = match.score;
        bestIndex = index;
      }
    });
    
    if (bestIndex === -1) return null;
    
    return {
      resume: resumes[bestIndex].resume,
      match: resumes[bestIndex].matches.find(m => m.role === role)!,
      index: bestIndex,
    };
  };

  const getRoleColor = (role: RoleCategory) => {
    const colors: Record<RoleCategory, string> = {
      'Customer Service': 'bg-purple-100 text-purple-800 border-purple-200',
      'Medical Assistants': 'bg-blue-100 text-blue-800 border-blue-200',
      'NPs': 'bg-green-100 text-green-800 border-green-200',
      'RNs': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[role];
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">
          Best Candidates by Role
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const best = getBestCandidateForRole(role);
          
          if (!best) {
            const roleColorClass = getRoleColor(role);
            const borderClass = roleColorClass.includes('purple') 
              ? 'border-purple-200' 
              : roleColorClass.includes('blue')
              ? 'border-blue-200'
              : roleColorClass.includes('green')
              ? 'border-green-200'
              : 'border-red-200';
            
            return (
              <div
                key={role}
                className={`border-2 border-dashed rounded-lg p-4 ${borderClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}>
                    {role}
                  </span>
                  <span className="text-sm text-gray-500">No matches found</span>
                </div>
              </div>
            );
          }
          
          return (
            <div
              key={role}
              className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${
                best.match.score >= 80
                  ? 'border-green-300 bg-green-50'
                  : best.match.score >= 60
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                      {role}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {best.resume.name || `Candidate ${best.index + 1}`}
                  </h3>
                  {best.resume.email && (
                    <p className="text-sm text-gray-600 mt-1">{best.resume.email}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${scoreColor(best.match.score)}`}>
                    {best.match.score}%
                  </div>
                  <div className="text-xs text-gray-500">Match Score</div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Experience: </span>
                    <span className="font-medium text-gray-700">
                      {best.match.matchedExperience.length} matches
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Skills: </span>
                    <span className="font-medium text-gray-700">
                      {best.match.matchedSkills.length} matches
                    </span>
                  </div>
                </div>
                {best.match.matchedCertifications.length > 0 && (
                  <div className="mt-2 text-xs">
                    <span className="text-gray-500">Certifications: </span>
                    <span className="font-medium text-gray-700">
                      {best.match.matchedCertifications.length} found
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

