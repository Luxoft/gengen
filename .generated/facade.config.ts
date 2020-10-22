import { Facade } from './facade';

export default new Set([
    Facade.StartupService.GetStartupInfo,
    Facade.EmployeeSearchService.Search,
    Facade.EmployeeSearchService.SearchPassportManagers,

    Facade.FinancialBusinessUnitService.GetSearchFbusByFbuFilter,
    Facade.FinancialBusinessUnitService.GetSearchFbusByProgramFilter,

    Facade.ActivityService.GetSearchActivitiesByActivityFilter,

    Facade.MethodologyService.GetSearchMethodologiesByMethodologyFilter,

    Facade.EngagementModelService.GetSearchEngagementModels,

    Facade.QualityApproachService.GetSearchQualityApproachsByQualityApproachFilter,

    Facade.CustomerSatisfactionSurveyService.GetCssModelRichDTOsByPassportId,
    Facade.CustomerSatisfactionSurveyService.GetQuestionAreaRatesByPassportId,

    Facade.SeProjectService.GetSearchSeProjectsBySeProjectFilter,

    Facade.TeamService.GetEmployeesByLocation,
    Facade.TeamService.GetEmployeesByRole,
    Facade.TeamService.GetTeamInfo,

    Facade.LdsService.GetRagReport,
    Facade.LdsService.GetSearchTierReportsByTierReportFilter,
    Facade.LdsService.GetTierReportOverview,

    Facade.TasksService.ExecuteTask,
    Facade.TasksService.GetTasks,
    Facade.TasksService.UpdateTask,

    Facade.SkillService.GetSearchSkillsBySkillFilter,

    Facade.CaseStudyService.GetCaseStudyOverview,
    Facade.CaseStudyService.UpdateCaseStudy,
    Facade.CaseStudyService.CreateCaseStudy,

    Facade.CaseStudyAttachmentService.GetCaseStudyAttachmentViewsByCaseStudyAttachmentFilter,
    Facade.CaseStudyAttachmentService.RemoveCaseStudyAttachment,

    Facade.PassportService.Search,
    Facade.PassportService.GetFilterData,
    Facade.PassportService.Archive,
    Facade.PassportService.CanBeArchived,
    Facade.PassportService.GetPassportSkills,
    Facade.PassportService.GetPassportProjectLdsId,
    Facade.PassportService.GetLuxoftManagement,
    Facade.PassportService.GetCustomerManagement,
    Facade.PassportService.CreatePassport,
    Facade.PassportService.GetPassportOverview,
    Facade.PassportService.UpdatePassport,
    Facade.PassportService.UpdatePassportProgram,

    Facade.DashboardService.GetPassportStatuses,
    Facade.DashboardService.GetProgramCoverage,
    Facade.DashboardService.GetSkillUsage,
    Facade.DashboardService.GetRagStatuses,
    Facade.DashboardService.GetRagTotalInfo,
    Facade.DashboardService.GetTasks,

    Facade.PermissionService.GetOverviewOperations,
    Facade.PermissionService.GetStartupOperations,

    Facade.StatisticsService.TrackEvent,

    Facade.InternalPassportService.UpdateSectionItemStatuses,
    Facade.InternalPassportService.ChangeManagementPlan
]);
