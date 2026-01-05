import type { IReelsActionsComponentProps } from "../../types/type";

export default function ReelsActionsComponent({
  index,
  onEdit,
  onSave,
  onDelete,
  isEditing = false,
}: IReelsActionsComponentProps) {
  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div
          onClick={() => onSave(index)}
          className="px-3 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 duration-300 transition-colors flex items-center justify-center"
          title="ثبت"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      ) : (
        <div
          onClick={() => onEdit(index)}
          className="px-3 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 duration-300 transition-colors flex items-center justify-center"
          title="ویرایش"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      )}

      <div
        onClick={() => onDelete(index)}
        className="px-3 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-700 duration-300 transition-colors flex items-center justify-center"
        title="حذف"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}
