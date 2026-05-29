export const formatDate = (value?: string | Date) => {
  if (!value) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const normalizePlot = (plot: any = {}, index = 0) => {
  const unitId = plot.id ?? plot.unitId ?? plot.UnitId ?? plot.plotId ?? plot.PlotId ?? index + 1;
  const unitName = plot.unitName ?? plot.UnitName ?? plot.plotNo ?? plot.PlotNo ?? plot.number ?? plot.name;

  return {
    id: String(unitId),
    unitId,
    ownerId: plot.ownerId ?? plot.OwnerId,
    plotNo: String(unitName ?? index + 1),
    type: String(plot.type ?? plot.Type ?? 'Plot'),
    area: String(plot.area ?? plot.Area ?? ''),
    societyId: plot.societyId ?? plot.SocietyId,
    societyName: plot.societyName ?? plot.SocietyName ?? 'Home Orbit Society',
    pendingDue: Number(plot.pendingDue ?? plot.pendingAmount ?? 0),
  };
};

export const normalizeFund = (fund: any = {}) => {
  if (typeof fund === 'number' || typeof fund === 'string') {
    return {
      totalBalance: Number(fund || 0),
      collected: 0,
      spent: 0,
      expenses: [],
    };
  }

  const collected = Number(fund.collected ?? fund.totalCollected ?? 0);
  const spent = Number(fund.spent ?? fund.totalSpent ?? 0);
  return {
    totalBalance: Number(fund.totalBalance ?? fund.balance ?? collected - spent),
    collected,
    spent,
    expenses: fund.expenses ?? [],
  };
};

export const normalizeSociety = (society: any = {}, index = 0) => ({
  id: String(society.id ?? society.societyId ?? index + 1),
  name: String(society.name ?? society.societyName ?? 'Society'),
  city: String(society.city ?? society.location ?? ''),
  plots: Number(society.plots ?? society.plotCount ?? 0),
});

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
