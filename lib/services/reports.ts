/** Stage 2 interface — advanced analytics are deferred. */
export class ReportService {
  isConfigured() {
    return false;
  }
}

export const reportService = new ReportService();
