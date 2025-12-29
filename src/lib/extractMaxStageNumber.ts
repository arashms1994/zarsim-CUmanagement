export function extractMaxStageNumber(
  shomaremarhale: string | null | undefined
): number | null {
  if (!shomaremarhale || !shomaremarhale.trim()) {
    return null;
  }

  const stageString = shomaremarhale.trim();

  if (stageString.includes(";")) {
    const stageNumbers = stageString
      .split(";")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .map((s: string) => parseFloat(s))
      .filter((n: number) => !isNaN(n));

    return stageNumbers.length > 0 ? Math.max(...stageNumbers) : null;
  } else {
    const stageNumber = parseFloat(stageString);
    return !isNaN(stageNumber) ? stageNumber : null;
  }
}
