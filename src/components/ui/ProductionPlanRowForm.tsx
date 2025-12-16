import type { IProductionPlanRowFormProps } from "../../types/type";

export default function ProductionPlanRowForm({
  planItem,
}: IProductionPlanRowFormProps) {
  // const { control, handleSubmit, setValue } = useForm<ICUManagementFormProps>({
  //   defaultValues: {
  //     productionPlanNumber: planItem.shpmarebarname,
  //     materialCategories: planItem.dastemavadi,
  //     materialName: planItem.rizmavad,
  //     supplier: planItem.tamin,
  //     selectedMachine: planItem.dastghah,
  //     materialWeight: "",
  //     responsible: "",
  //     materialExitDate: getPersianDate(),
  //   },
  // });

  // const [loading, setLoading] = useState(false);

  // const onSubmit = async (data: ICUManagementFormProps) => {
  //   try {
  //     setLoading(true);

  //     if (!customOnSubmit) {
  //       toast.error("تابع ارسال تعریف نشده است");
  //       return;
  //     }

  //     const result = await customOnSubmit(data, planItem, index);

  //     if (result.success) {
  //       toast.success(result.message);
  //       setValue("responsible", "");
  //       setValue("materialWeight", "");
  //       setValue("materialExitDate", getPersianDate());
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error("خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="w-full p-5 gap-2 flex justify-between items-center flex-wrap rounded-[4px] border-2 shadow border-[#1e7677] relative">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="bg-[#1e7677] text-center px-3 py-2 rounded-lg">
          <span className="text-lg font-normal text-white">
            جزئیات کارت تولید
          </span>
        </div>
      </div>

      <form className="w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">مرحله:</label>
            <span className="text-lg font-normal">{planItem.marhale}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">دستگاه:</label>
            <span className="text-lg font-normal">{planItem.dasatghah}</span>
          </div>

          {/* <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              دسته بندی محصول:
            </label>
            <span className="text-lg font-normal">{planItem.typename}</span>
          </div> */}

          {/* <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">نوع محصول:</label>
            <span className="text-lg font-normal">{planItem.typesefaresh}</span>
          </div> */}

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">محصول:</label>
            <span className="text-lg font-normal">{planItem.codemahsol}</span>
          </div>

          {/* <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              تاریخ برنامه ریزی:
            </label>
            <span className="text-lg font-normal">
              {planItem.tarikhbarnamerizi}
            </span>
          </div>*/}
        </div> 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              مقدار برنامه ریزی شده:
            </label>
            <span className="text-lg font-normal">
              {planItem.barnamerizi}
            </span>
          </div>

          {/* <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">مقدار سفارش:</label>
            <span className="text-lg font-normal">
              {planItem.meghdarkolesefaresh}
            </span>
          </div> */}

          {/* <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              تاریخ خروج مواد:
            </label>
            <Controller
              name="materialExitDate"
              control={control}
              render={({ field }) => (
                <Input {...field} className="w-[250px]" readOnly />
              )}
            />
          </div> */}

          {/* <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              وزن مواد (کیلوگرم):
            </label>
            <Controller
              name="materialWeight"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="string"
                  placeholder="مثلاً 50"
                  className="w-[250px]"
                />
              )}
            />
          </div> */}

          {/* <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              شخص تحویل‌گیرنده:
            </label>
            <div className="relative">
              <Controller
                name="responsible"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="جستجو تحویل‌گیرنده..."
                    className="w-[250px]"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handlePersonnelSearch(e.target.value);
                      setShowPersonnelSuggestions(true);
                    }}
                    onFocus={() => {
                      setShowPersonnelSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowPersonnelSuggestions(false), 200);
                    }}
                  />
                )}
              />

              {showPersonnelSuggestions && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {personnelLoading ? (
                    <SkeletonSearchSuggestion count={3} />
                  ) : personnelResults.length > 0 ? (
                    personnelResults.map((personnel) => (
                      <div
                        key={personnel.ID}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setValue("responsible", personnel.Title);
                          setShowPersonnelSuggestions(false);
                        }}
                      >
                        {personnel.Title}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      تحویل‌گیرنده‌ای یافت نشد
                    </div>
                  )}
                </div>
              )}
            </div>
          </div> */}
        </div>

        {/* <div className="flex justify-center mt-6">
          <div
            onClick={!loading ? handleSubmit(onSubmit) : undefined}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1e7677] hover:bg-[#165556] text-white cursor-pointer"
            }`}
          >
            {loading ? "در حال ارسال..." : `ثبت اطلاعات`}
          </div> */}
      </form>
    </div>
  );
}
