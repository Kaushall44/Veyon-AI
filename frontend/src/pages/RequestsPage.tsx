import React from 'react';

export const RequestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Request Tracking & History</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track real-time status of all submitted institutional service requests</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-subtle">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Request ID</th>
              <th className="p-4">Service Type</th>
              <th className="p-4">Details</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            <tr>
              <td className="p-4 font-mono font-bold text-slate-900">#LB-4019</td>
              <td className="p-4">Lab Booking</td>
              <td className="p-4">Advanced AI Lab (Tomorrow 2-4 PM)</td>
              <td className="p-4">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  Pending Approval
                </span>
              </td>
              <td className="p-4 text-slate-500">2026-08-23 14:32</td>
              <td className="p-4">
                <button className="text-indigo-600 hover:text-indigo-800 font-semibold">View Detail</button>
              </td>
            </tr>
            <tr>
              <td className="p-4 font-mono font-bold text-slate-900">#CERT-881</td>
              <td className="p-4">Bonafide Certificate</td>
              <td className="p-4">Passport Application</td>
              <td className="p-4">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Completed
                </span>
              </td>
              <td className="p-4 text-slate-500">2026-08-22 10:15</td>
              <td className="p-4">
                <button className="text-emerald-600 hover:text-emerald-800 font-semibold">Download PDF</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
