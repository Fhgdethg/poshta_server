class ReportService {
  generateReportID(allReportIDs: number[]): number {
    return allReportIDs.length ? Math.max(...allReportIDs) + 1 : 1;
  }
}

export default new ReportService();
