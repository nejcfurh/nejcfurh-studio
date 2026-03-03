import { BsLightningCharge } from 'react-icons/bs';
import { IoIosCheckmark } from 'react-icons/io';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { MdInsights } from 'react-icons/md';

const KeyInsights = ({ summary }: { summary: Record<string, string> }) => {
  return (
    <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border border-amber-100">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="p-2 bg-amber-500 rounded-full shadow-sm">
          <MdInsights className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
      </div>

      <div className="space-y-4">
        {/* OVERALL EXPERIENCE */}
        {summary.overall_experience && (
          <div className="group p-5 bg-linear-to-r from-white to-amber-50 border border-yellow-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                <MdInsights className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  Overall Experience
                </h4>
                <p className="text-yellow-800 leading-relaxed">
                  {summary.overall_experience}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN PRAISE */}
        {summary.main_praise && (
          <div className="group p-5 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                <IoIosCheckmark className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  Main Praise
                  <span className="text-xs px-2 py-0.5 bg-green-200 rounded-full">
                    Strength
                  </span>
                </h4>
                <p className="text-green-800 leading-relaxed">
                  {summary.main_praise}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN COMPLAINT */}
        {summary.main_complaint && (
          <div className="group p-5 bg-linear-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                <IoAlertCircleOutline className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  Main Complaint
                  <span className="text-xs px-2 py-0.5 bg-red-200 rounded-full">
                    Weakness
                  </span>
                </h4>
                <p className="text-red-800 leading-relaxed">
                  {summary.main_complaint}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS RECOMMENDATION */}
        <div className="group p-5 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
              <BsLightningCharge className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                Business Recommendation
                <span className="text-xs px-2 py-0.5 bg-blue-200 rounded-full">
                  Action
                </span>
              </h4>
              <p className="text-blue-800 leading-relaxed">
                {summary.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyInsights;
