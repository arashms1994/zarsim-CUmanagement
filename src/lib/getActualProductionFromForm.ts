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
