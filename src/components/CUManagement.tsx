import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSearchPrintTajmi } from "../hooks/useSearchPrintTajmi";
import { usePrintTajmiByCart } from "../hooks/usePrintTajmiByCart";
import ProductionPlanRowForm from "./ui/ProductionPlanRowForm";
import type {
  ICUManagementFormProps,
  ISubProductionPlanListItem,
} from "../types/type";

export default function CUManagement() {
  const { control, setValue, watch } = useForm<ICUManagementFormProps>();
  const selectedPlan = watch("productionPlanNumber");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showMachineDropdown, setShowMachineDropdown] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | undefined>(
    undefined
  );
  const [selectedMachine, setSelectedMachine] = useState<string | undefined>(
    undefined
  );

  const {
    searchResults,
    isLoading: searchLoading,
    handleSearch,
  } = useSearchPrintTajmi();

  const { planDetails, isLoading: planLoading } =
    usePrintTajmiByCart(selectedPlan);

  const uniqueStages = useMemo(() => {
    if (!planDetails) return [];
    const stage = planDetails.marhale;
    if (!stage || stage.trim().length === 0) return [];
    return [stage];
  }, [planDetails]);

  const availableMachines = useMemo(() => {
    if (!selectedStage || !planDetails) return [];
    const machine = planDetails.dasatghah;
    if (!machine || machine.trim().length === 0) return [];
    return [machine];
  }, [planDetails, selectedStage]);

  const filteredPlanDetails = useMemo(() => {
    if (!planDetails) return [];
    if (!selectedStage) return [];
    if (!selectedMachine) return [];

    if (
      planDetails.marhale !== selectedStage ||
      planDetails.dasatghah !== selectedMachine
    ) {
      return [];
    }

    const mappedItem: ISubProductionPlanListItem = {
      FileSystemObjectType: planDetails.FileSystemObjectType,
      Priority: "",
      Id: planDetails.Id,
      ContentTypeId: planDetails.ContentTypeId,
      Title: planDetails.Title,
      meghdartoliddaremroz: Number(planDetails.meghdartolid) || 0,
      meghdarkolesefaresh: Number(planDetails.meghdar) || 0,
      shomareradiffactor: planDetails.radiffactor || "",
      namedastghah: planDetails.dasatghah || "",
      namemarhale: planDetails.marhale || "",
      shomarebarnamerizi: planDetails.barnamerizi?.toString() || "",
      nameoperator: null,
      namemoshtari: planDetails.moshtari || "",
      size: planDetails.sizeghale || "",
      tarhetolid: "",
      vijegihayekhas: null,
      productionplanid: null,
      codemahsol: planDetails.codemahsol || "",
      sizeghaleb: "",
      toltabmax: null,
      toltabmin: null,
      jahattab: null,
      mahsoletolidi: "",
      tozihat: planDetails.tojihat || "",
      tarikhbarnamerizi: planDetails.barnamerizi?.toString() || "",
      barnameriziaztarike: "",
      barnamerizitatarikhe: "",
      minghotrershte: null,
      maxghotrershte: null,
      tedadreshteshte: null,
      mintoltabmarkaz: null,
      maxtoltabmarkaz: null,
      chidemanreshtelayeha: null,
      sizenazel: "",
      minghotreayeghshode: null,
      maxghotreayeghshode: null,
      rangbandi: planDetails.rang || "",
      zekhamatmotevaset: "",
      zekhamatnoghtei: "",
      ghotremaftolfoladi: null,
      tedadmaftolfoladi: null,
      poshesh: null,
      arzenavar: null,
      tedadarmor: null,
      rangrokesh: null,
      zaribtab: null,
      arzenavarmailar: null,
      zekhamatnavarmailar: null,
      arzenavaralminiom: null,
      zekhamatenavaralminiom: null,
      minrotobat: null,
      zamanotaghbokhar: null,
      sizesimert: null,
      mindama: null,
      idproductionPlanproductgroup1: 0,
      shomareverjen: 0,
      tolidvaghei: null,
      diff: planDetails.def || 0,
      estefademeghdar: 0,
      estefadedar: null,
      akharinmazadtolid: 0,
      meghdareestefadeshodeazdigharmaz: null,
      akharin_gerefteshodeazmaza: null,
      typesefaresh: planDetails.rang || "",
      typename: planDetails.codemahsol || "",
      typeertorhadi: null,
      shomaremarhale: planDetails.shomaremarahel || "",
      carttolid: planDetails.payantolid || false,
      shomarecart: planDetails.Title || "",
      matnechap: "",
      mavadbari: false,
      shomarebarnamemavad: null,
      tozihattolid: null,
      OData_takara: 0,
      typekeshesh: planDetails.typekeshesh || null,
      OData_halate: null,
      idprint: null,
      OData_moghavemat: null,
      akharinmarhale: planDetails.akharinmarhale || false,
      OData_tas: null,
      toltabmax2: null,
      toltabmax3: null,
      toltabmin2: null,
      toltabmin3: null,
      jahattab2: null,
      jahattab3: null,
      jahattabm: null,
      chidemanreshtelayeha2: null,
      chidemanreshtelayeha3: null,
      chidemanreshtelayeham: null,
      OData_perkar1: 0,
      OData_perkar2: null,
      bastebandi: null,
      yyyyyy: null,
      ID: planDetails.ID,
      Modified: planDetails.Modified,
      Created: planDetails.Created,
      AuthorId: planDetails.AuthorId,
      EditorId: planDetails.EditorId,
      OData__UIVersionString: planDetails.OData__UIVersionString,
      Attachments: planDetails.Attachments,
      GUID: planDetails.GUID,
    };

    return [mappedItem];
  }, [planDetails, selectedStage, selectedMachine]);

  const handleCartSelect = (cartNumber: string) => {
    setValue("productionPlanNumber", cartNumber);
    setShowSuggestions(false);
    setSelectedStage(undefined);
    setSelectedMachine(undefined);
    setShowStageDropdown(false);
    setShowMachineDropdown(false);
  };

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setSelectedMachine(undefined);
    setShowStageDropdown(false);
    setShowMachineDropdown(false);
  };

  const handleMachineChange = (machine: string) => {
    setSelectedMachine(machine);
    setShowMachineDropdown(false);
  };

  return (
    <div className="space-y-4 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center relative gap-8">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          bgcolor="#1e7677"
          width="fit-content"
          paddingBlock={1}
          paddingInline={3}
          borderRadius={4}
        >
          <span className="text-xl font-medium text-white">
            فرم ثبت مس مصرفی بر اساس شماره برنامه
          </span>
        </Stack>

        <div className="flex items-center justify-start gap-3">
          <label htmlFor="productionPlanNumber" className="min-w-[150px]">
            شماره برنامه را وارد کنید:
          </label>
          <div className="relative">
            <Controller
              name="productionPlanNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="شماره برنامه را وارد کنید..."
                  className="w-[250px]"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleSearch(e.target.value);
                    setShowSuggestions(e.target.value.length >= 2);
                  }}
                  onFocus={() => {
                    if (field.value && field.value.length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
              )}
            />

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e7677]"></div>
                    در حال جستجو...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((plan, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCartSelect(plan)}
                    >
                      {plan}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    شماره برنامه‌ای یافت نشد
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <div className="space-y-4">
          {planLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 bg-transparent border border-[#1e7677] rounded-lg px-6 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e7677]"></div>
                <span className="text-[#1e7677] font-medium">
                  در حال بارگذاری جزئیات برنامه {selectedPlan}
                </span>
              </div>
            </div>
          ) : planDetails ? (
            <div className="w-full flex flex-col items-center justify-center gap-5 mt-1">
              <div className="flex items-center justify-start gap-3">
                <label htmlFor="stage-select" className="min-w-[150px]">
                  مرحله را انتخاب کنید:
                </label>
                {uniqueStages.length > 0 ? (
                  <div className="relative">
                    <div
                      onClick={() => setShowStageDropdown(!showStageDropdown)}
                      onBlur={() =>
                        setTimeout(() => setShowStageDropdown(false), 200)
                      }
                      tabIndex={0}
                      className="w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
                    >
                      <span className={selectedStage ? "" : "text-gray-500"}>
                        {selectedStage || "مرحله را انتخاب کنید..."}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          showStageDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {showStageDropdown && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {uniqueStages.map((stage, index) => (
                          <div
                            key={`${stage}-${index}`}
                            className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              selectedStage === stage
                                ? "bg-[#1e7677] text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleStageChange(stage)}
                          >
                            {stage}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[250px] px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-md bg-gray-50">
                    هیچ مرحله‌ای یافت نشد
                  </div>
                )}
              </div>

              {selectedStage && (
                <div className="flex items-center justify-start gap-3">
                  <label htmlFor="machine-select" className="min-w-[150px]">
                    دستگاه را انتخاب کنید:
                  </label>
                  <div className="relative">
                    <div
                      onClick={() =>
                        setShowMachineDropdown(!showMachineDropdown)
                      }
                      onBlur={() =>
                        setTimeout(() => setShowMachineDropdown(false), 200)
                      }
                      tabIndex={0}
                      className="w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
                    >
                      <span className={selectedMachine ? "" : "text-gray-500"}>
                        {selectedMachine || "دستگاه را انتخاب کنید..."}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          showMachineDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {showMachineDropdown && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {availableMachines.map((machine, index) => (
                          <div
                            key={`${machine}-${index}`}
                            className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              selectedMachine === machine
                                ? "bg-[#1e7677] text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleMachineChange(machine)}
                          >
                            {machine}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedStage && selectedMachine ? (
                filteredPlanDetails.length > 0 ? (
                  filteredPlanDetails.map((planItem, index) => (
                    <ProductionPlanRowForm
                      key={index}
                      index={index}
                      planItem={planItem}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-4">
                      <span className="text-yellow-700 font-medium">
                        هیچ ردیفی برای مرحله "{selectedStage}" و دستگاه "
                        {selectedMachine}" یافت نشد
                      </span>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
                    <span className="text-blue-700 font-medium">
                      لطفاً مرحله و دستگاه را انتخاب کنید
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-4">
                <span className="text-yellow-700 font-medium">
                  هیچ ردیفی برای برنامه {selectedPlan} یافت نشد
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
