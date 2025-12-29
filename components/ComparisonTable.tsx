'use client';

import { RoleMatch } from '@/lib/roleMatcher';
import { ParsedResume } from '@/lib/resumeParser';
import { Trophy, TrendingDown } from 'lucide-react';

interface ComparisonTableProps {
  resumes: Array<{
    resume: ParsedResume;
    matches: RoleMatch[];
  }>;
  selectedRole: string;
}

export default function ComparisonTable({ resumes, selectedRole }: ComparisonTableProps) {
  if (resumes.length === 0) return null;

  const roleMatches = resumes.map(({ resume, matches }) => {
    const match = matches.find(m => m.role === selectedRole);
    return {
      name: resume.name || 'Unknown',
      email: resume.email,
      match: match || null,
      resume,
    };
  });

  // Sort by score descending
  roleMatches.sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0));

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-primary-600 text-white px-6 py-4">
        <h3 className="text-lg font-semibold">Team Comparison: {selectedRole}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Qualifications
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roleMatches.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {index === 0 ? (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">1st</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">{index + 1}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.email && (
                      <div className="text-sm text-gray-500">{item.email}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.match ? (
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${scoreColor(item.match.score)}`}>
                        {item.match.score}%
                      </span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 transition-all"
                          style={{ width: `${item.match.score}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <TrendingDown className="h-4 w-4" />
                      No match
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {item.match ? (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-medium">Experience: </span>
                        {item.match.matchedExperience.length} matches
                      </div>
                      <div>
                        <span className="font-medium">Skills: </span>
                        {item.match.matchedSkills.length} matches
                      </div>
                      {item.match.matchedCertifications.length > 0 && (
                        <div>
                          <span className="font-medium">Certs: </span>
                          {item.match.matchedCertifications.length} matches
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No data available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

