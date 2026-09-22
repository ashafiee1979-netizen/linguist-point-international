// Shared control styling. Every input, select and textarea on the site pulls
// from here so heights, radii, borders and focus rings stay identical instead
// of drifting per component.

/** Base look shared by every text-like control. */
const controlBase =
  "w-full rounded-xl border border-slate-300 bg-white text-slate-900 text-sm " +
  "placeholder:text-slate-400 shadow-xs outline-none transition-all duration-150 " +
  "hover:border-slate-400 " +
  "focus:border-[#173d40] focus:ring-4 focus:ring-[#173d40]/10 " +
  "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed";

/** Standard control height — comfortably above the 44px touch target. */
export const CONTROL_HEIGHT = "h-12";

export const inputClass = `${controlBase} ${CONTROL_HEIGHT} px-3.5`;

export const textareaClass = `${controlBase} px-3.5 py-3 resize-y min-h-[88px]`;

/**
 * Selects render their own chevron via the Select component, so they reserve
 * room on the right and hide the native arrow.
 */
export const selectClass = `${controlBase} ${CONTROL_HEIGHT} pl-3.5 pr-10 appearance-none bg-none cursor-pointer font-medium`;

/** Field label, used above every control. */
export const labelClass = "block text-sm font-bold text-slate-700 mb-2";

/** Same treatment for a select that is still showing its placeholder. */
export const selectPlaceholderClass = "text-slate-400";
