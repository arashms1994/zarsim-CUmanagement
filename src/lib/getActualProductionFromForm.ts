/**
 * دریافت مقدار actualProduction از فرم
 * @param control - کنترل فرم react-hook-form
 * @param actualProductionField - نام فیلد actualProduction
 * @param productionValues - مقادیر محاسبه شده از productionValues
 * @returns مقدار actualProduction یا empty string
 */
export function getActualProductionFromForm(
  control: any,
  actualProductionField: string,
  productionValues: Record<string, string>
): string {
  const watchValue = control.watch
    ? control.watch(actualProductionField)
    : undefined;
  const formValues = control._formValues || {};
  
  return (
    watchValue ||
    formValues[actualProductionField] ||
    productionValues[actualProductionField] ||
    ""
  );
}

