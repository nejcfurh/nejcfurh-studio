import { BsLightningCharge } from 'react-icons/bs';
import { IoIosCheckmark } from 'react-icons/io';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { MdInsights } from 'react-icons/md';

const KeyInsights = ({ summary }: { summary: Record<string, string> }) => {
  return (
    <div className="rounded-xl border border-amber-100 bg-linear-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="rounded-full bg-amber-500 p-2 shadow-sm">
          <MdInsights className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
      </div>

      <div className="space-y-4">
        {/* OVERALL EXPERIENCE */}
        {summary.overall_experience && (
          <div className="group rounded-xl border border-yellow-200 bg-linear-to-r from-white to-amber-50 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500 shadow-sm">
                <MdInsights className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-yellow-900">
                  Overall Experience
                </h4>
                <p className="leading-relaxed text-yellow-800">
                  {summary.overall_experience}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN PRAISE */}
        {summary.main_praise && (
          <div className="group rounded-xl border border-green-200 bg-linear-to-r from-green-50 to-emerald-50 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-sm">
                <IoIosCheckmark className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                  Main Praise
                  <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs">
                    Strength
                  </span>
                </h4>
                <p className="leading-relaxed text-green-800">
                  {summary.main_praise}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN COMPLAINT */}
        {summary.main_complaint && (
          <div className="group rounded-xl border border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 shadow-sm">
                <IoAlertCircleOutline className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-900">
                  Main Complaint
                  <span className="rounded-full bg-red-200 px-2 py-0.5 text-xs">
                    Weakness
                  </span>
                </h4>
                <p className="leading-relaxed text-red-800">
                  {summary.main_complaint}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS RECOMMENDATION */}
        <div className="group rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 shadow-sm">
              <BsLightningCharge className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                Business Recommendation
                <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs">
                  Action
                </span>
              </h4>
              <p className="leading-relaxed text-blue-800">
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
