export class Facade {
  public static Service = {
    Authentication: '/Authentication'
  };

  public static ActivityService = {
    GetSearchActivitiesByActivityFilter:
      'Activity/GetSearchActivitiesByActivityFilter'
  };

  public static CaseStudyService = {
    CreateCaseStudy: 'CaseStudy/CreateCaseStudy',

    GetCaseStudyOverview: 'CaseStudy/GetCaseStudyOverview',

    GetSearchCaseStudiesByPassportFilter:
      'CaseStudy/GetSearchCaseStudiesByPassportFilter',

    UpdateCaseStudy: 'CaseStudy/UpdateCaseStudy'
  };

  public static CaseStudyAttachmentService = {
    Download: 'CaseStudyAttachment/Download',

    GetCaseStudyAttachmentViewsByCaseStudyAttachmentFilter:
      'CaseStudyAttachment/GetCaseStudyAttachmentViewsByCaseStudyAttachmentFilter',

    RemoveCaseStudyAttachment: 'CaseStudyAttachment/RemoveCaseStudyAttachment',

    Upload: 'CaseStudyAttachment/Upload'
  };

  public static CustomerSatisfactionSurveyService = {
    GetCssModelRichDTOsByPassportId:
      'CustomerSatisfactionSurvey/GetCssModelRichDTOsByPassportId',

    GetQuestionAreaRatesByPassportId:
      'CustomerSatisfactionSurvey/GetQuestionAreaRatesByPassportId'
  };

  public static DashboardService = {
    GetPassportStatuses: 'Dashboard/GetPassportStatuses',

    GetProgramCoverage: 'Dashboard/GetProgramCoverage',

    GetRagStatuses: 'Dashboard/GetRagStatuses',

    GetRagTotalInfo: 'Dashboard/GetRagTotalInfo',

    GetSkillUsage: 'Dashboard/GetSkillUsage',

    GetTasks: 'Dashboard/GetTasks'
  };

  public static EmployeeSearchService = {
    Search: 'EmployeeSearch/Search',

    SearchPassportManagers: 'EmployeeSearch/SearchPassportManagers',

    SearchTaskAssignees: 'EmployeeSearch/SearchTaskAssignees'
  };

  public static EngagementModelService = {
    GetSearchEngagementModels: 'EngagementModel/GetSearchEngagementModels'
  };

  public static FinancialBusinessUnitService = {
    GetSearchFbusByFbuFilter: 'FinancialBusinessUnit/GetSearchFbusByFbuFilter',

    GetSearchFbusByProgramFilter:
      'FinancialBusinessUnit/GetSearchFbusByProgramFilter',

    GetSearchFbusForPassportCreationByFbuFilter:
      'FinancialBusinessUnit/GetSearchFbusForPassportCreationByFbuFilter'
  };

  public static InternalPassportService = {
    ChangeManagementPlan: 'InternalPassport/ChangeManagementPlan',

    GetInternalPassportOverview: 'InternalPassport/GetInternalPassportOverview',

    UpdateInternalPassport: 'InternalPassport/UpdateInternalPassport',

    UpdateSection: 'InternalPassport/UpdateSection',

    UpdateSectionItemStatuses: 'InternalPassport/UpdateSectionItemStatuses'
  };

  public static LdsService = {
    GetRagReport: 'Lds/GetRagReport',

    GetSearchTierReportsByTierReportFilter:
      'Lds/GetSearchTierReportsByTierReportFilter',

    GetTierReportOverview: 'Lds/GetTierReportOverview'
  };

  public static MethodologyService = {
    GetSearchMethodologiesByMethodologyFilter:
      'Methodology/GetSearchMethodologiesByMethodologyFilter'
  };

  public static PassportService = {
    Archive: 'Passport/Archive',

    CanBeArchived: 'Passport/CanBeArchived',

    CreatePassport: 'Passport/CreatePassport',

    GetCustomerManagement: 'Passport/GetCustomerManagement',

    GetFilterData: 'Passport/GetFilterData',

    GetLuxoftManagement: 'Passport/GetLuxoftManagement',

    GetPassportOverview: 'Passport/GetPassportOverview',

    GetPassportProjectLdsId: 'Passport/GetPassportProjectLdsId',

    GetPassportSkills: 'Passport/GetPassportSkills',

    Search: 'Passport/Search',

    UpdatePassport: 'Passport/UpdatePassport',

    UpdatePassportProgram: 'Passport/UpdatePassportProgram'
  };

  public static PermissionService = {
    GetOverviewOperations: 'Permission/GetOverviewOperations',

    GetStartupOperations: 'Permission/GetStartupOperations'
  };

  public static PhotoService = {
    id: 'Photo/id'
  };

  public static PostmortemService = {
    GetPostmortemOverview: 'Postmortem/GetPostmortemOverview',

    GetSearchPostmortemsByPassportFilter:
      'Postmortem/GetSearchPostmortemsByPassportFilter',

    UpdatePostmortem: 'Postmortem/UpdatePostmortem'
  };

  public static QualityApproachService = {
    GetSearchQualityApproachsByQualityApproachFilter:
      'QualityApproach/GetSearchQualityApproachsByQualityApproachFilter'
  };

  public static ReportsService = {
    DownloadPassportSearchReport: 'Reports/DownloadPassportSearchReport',

    DownloadPostmortemReport: 'Reports/DownloadPostmortemReport'
  };

  public static SeProjectService = {
    GetSearchSeProjectsBySeProjectFilter:
      'SeProject/GetSearchSeProjectsBySeProjectFilter'
  };

  public static SkillService = {
    GetSearchSkillsBySkillFilter: 'Skill/GetSearchSkillsBySkillFilter'
  };

  public static StartupService = {
    GetStartupInfo: 'Startup/GetStartupInfo'
  };

  public static StatisticsService = {
    TrackEvent: 'Statistics/TrackEvent'
  };

  public static TasksService = {
    ExecuteTask: 'Tasks/ExecuteTask',

    GetTasks: 'Tasks/GetTasks',

    UpdateTask: 'Tasks/UpdateTask'
  };

  public static TeamService = {
    GetEmployeesByLocation: 'Team/GetEmployeesByLocation',

    GetEmployeesByRole: 'Team/GetEmployeesByRole',

    GetTeamInfo: 'Team/GetTeamInfo'
  };
}
