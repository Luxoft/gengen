import { Guid } from './Guid';
import { toDateIn, toDateOut } from './date-converters';
// #region Enums

export enum ArchitectureSolution {
  Implemented = 1,

  NotImplemented = 2,

  HaveNoIdea = 3
}

export enum ClientSegmentation {
  Oem = 1,

  Tier1 = 2,

  Tier2 = 3,

  Partner = 4,

  Other = 5
}

export enum CommandType {
  CompleteAfterCreationReview = 1,

  CompleteActivate = 2,

  RejectActivate = 3,

  CompletePmReview = 4,

  CompleteFillInCaseStudy = 5,

  CompleteConfirmCaseStudy = 6,

  RejectConfirmCaseStudy = 7,

  CompleteVerifyCaseStudy = 8,

  RejectVerifyCaseStudy = 9,

  CompleteArchive = 10,

  RejectArchive = 11,

  CompleteFillInPostmortem = 12,

  CompleteConfirmPostmortem = 13,

  RejectConfirmPostmortem = 14,

  CompleteVerifyPostmortem = 15,

  RejectVerifyPostmortem = 16,

  CompleteEngagementModelChanging = 17
}

export enum EmployeeStatus {
  Candidate = 0,

  Active = 1,

  EmployeeOnProbationPeriod = 2,

  OnTermination = 3,

  Canceled = -2,

  Terminated = -1
}

export enum FunctionalSafety {
  NotApplicable = 0,

  A = 1,

  B = 2,

  C = 3,

  D = 4
}

export enum ManagementPlanType {
  Mini = 0,

  Standard = 1,

  NotApplicable = 2
}

export enum PassportStatus {
  Draft = 0,

  InfoReview = 1,

  PmReview = 2,

  Active = 3,

  Archived = 4,

  Postmortem = 5
}

export enum PricingModel {
  TimeAndMaterials = 0,

  FixedCapacity = 1,

  FixedPrice = 2,

  Royalty = 3,

  None = 4
}

export enum ProjectComplexity {
  Normal = 0,

  Moderate = 1,

  Hard = 2
}

export enum ProjectPassportSecurityOperationCode {
  None = 0,

  SystemIntegration = 1,

  PassportCreate = 2,

  PassportRead = 3,

  PassportWrite = 4,

  PassportWriteDqms = 5,

  PassportWorkflow = 6,

  PassportWorkflowInfoReviewActive = 7,

  PassportWorkflowInfoReviewPmReview = 8,

  PassportWorkflowActivePmReview = 9,

  PassportWorkflowActiveArchive = 10,

  CaseStudyCreate = 11,

  CaseStudyWriteSalesData = 12,

  CaseStudyWriteOnDraft = 13,

  CaseStudyWriteOnDqmsConfirm = 14,

  CaseStudyWriteOnProgramConfirm = 15,

  CaseStudyWorkflowDraftPgmConfirm = 16,

  CaseStudyWorkflowFromPgmConfirm = 17,

  CaseStudyWorkflowFromDqmsConfirm = 18,

  PostmortemRead = 19,

  PostmortemWrite = 20,

  PostmortemWriteProgram = 21,

  PostmortemWriteDqms = 22,

  PostmortemWorkflowDraftPgmConfirm = 23,

  PostmortemWorkflowFromPgmConfirm = 24,

  PostmortemWorkflowFromDqmsConfirm = 25,

  PassportReadComplexity = 26,

  PassportWriteComplexity = 27,

  InternalPassportRead = 28,

  InternalPassportWrite = 29,

  ShowDqmsFilter = 30,

  PassportReadManagementInfo = 31
}

export enum ProjectStatus {
  Starting = 0,

  Active = 1,

  OnHold = 2,

  Closing = 3,

  Closed = 4
}

export enum RagStatus {
  Unavailable = 0,

  Green = 1,

  Amber = 2,

  Red = 3
}

export enum TaskType {
  PassportAfterCreationReview = 1,

  PassportActivate = 2,

  PassportPmReview = 3,

  CaseStudyFillIn = 4,

  CaseStudyConfirm = 5,

  CaseStudyVerify = 6,

  PassportArchive = 7,

  PostmortemFillIn = 8,

  PostmortemConfirm = 9,

  PostmortemVerify = 10,

  PassportEngagementModelChanging = 11
}

export enum TierForecast {
  Stable = 1,

  Positive = 2,

  Negative = 3,

  Evolving = 4
}

export enum TierStatus {
  Unavailable = 0,

  One = 1,

  Two = 2,

  Three = 3,

  Four = 4
}

// #endregion
// #region Models
export class ActivityFilterStrictDTO {
  private __activityFilterStrictDTO: string;

  public static toDTO(
    model: Partial<ActivityFilterStrictDTO>
  ): IActivityFilterStrictDTO {
    return {};
  }

  public static fromDTO(
    dto: IActivityFilterStrictDTO
  ): ActivityFilterStrictDTO {
    const result = new ActivityFilterStrictDTO();

    return result;
  }
}

export class ActivityIdentityDTO {
  public id: Guid = undefined;

  private __activityIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IActivityIdentityDTO {
    return { id: id.toString() };
  }
}

export class AllocationModel {
  public seProject: string = undefined;

  public workloadPercent: number = undefined;

  public endDate: Date = undefined;

  private __allocationModel: string;

  public static toDTO(model: Partial<AllocationModel>): IAllocationModel {
    return {
      seProject: model.seProject,
      workloadPercent: model.workloadPercent,
      endDate: toDateOut(model.endDate)
    };
  }

  public static fromDTO(dto: IAllocationModel): AllocationModel {
    const result = new AllocationModel();

    result.seProject = dto.seProject;
    result.workloadPercent = dto.workloadPercent;
    result.endDate = toDateIn(dto.endDate);

    return result;
  }
}

export class CaseStudyAttachmentFilterStrictDTO {
  public caseStudy: CaseStudyIdentityDTO = undefined;

  private __caseStudyAttachmentFilterStrictDTO: string;

  public static toDTO(
    model: Partial<CaseStudyAttachmentFilterStrictDTO>
  ): ICaseStudyAttachmentFilterStrictDTO {
    return {
      caseStudy: model.caseStudy
        ? CaseStudyIdentityDTO.toDTO(model.caseStudy.id)
        : undefined
    };
  }

  public static fromDTO(
    dto: ICaseStudyAttachmentFilterStrictDTO
  ): CaseStudyAttachmentFilterStrictDTO {
    const result = new CaseStudyAttachmentFilterStrictDTO();

    result.caseStudy = dto.caseStudy
      ? new CaseStudyIdentityDTO(dto.caseStudy.id)
      : undefined;

    return result;
  }
}

export class CaseStudyAttachmentIdentityDTO {
  public id: Guid = undefined;

  private __caseStudyAttachmentIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ICaseStudyAttachmentIdentityDTO {
    return { id: id.toString() };
  }
}

export class CaseStudyAttachmentViewProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __caseStudyAttachmentViewProjectionDTO: string;

  public static toDTO(
    model: Partial<CaseStudyAttachmentViewProjectionDTO>
  ): ICaseStudyAttachmentViewProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ICaseStudyAttachmentViewProjectionDTO
  ): CaseStudyAttachmentViewProjectionDTO {
    const result = new CaseStudyAttachmentViewProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class CaseStudyIdentityDTO {
  public id: Guid = undefined;

  private __caseStudyIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ICaseStudyIdentityDTO {
    return { id: id.toString() };
  }
}

export class CaseStudyOverviewProjectionDTO {
  public archSolution: ArchitectureSolution = undefined;

  public archSolutionDescription: string = undefined;

  public businessGoal: string = undefined;

  public clientSegmentation: ClientSegmentation = undefined;

  public customer: string = undefined;

  public customerFeedback: string = undefined;

  public customerLocation: string = undefined;

  public customerRole: string = undefined;

  public executiveSummary: string = undefined;

  public luxoftSolutions: string = undefined;

  public resultAndAchievements: string = undefined;

  public id: Guid = undefined;

  private __caseStudyOverviewProjectionDTO: string;

  public static toDTO(
    model: Partial<CaseStudyOverviewProjectionDTO>
  ): ICaseStudyOverviewProjectionDTO {
    return {
      archSolution: model.archSolution,
      archSolutionDescription: model.archSolutionDescription,
      businessGoal: model.businessGoal,
      clientSegmentation: model.clientSegmentation,
      customer: model.customer,
      customerFeedback: model.customerFeedback,
      customerLocation: model.customerLocation,
      customerRole: model.customerRole,
      executiveSummary: model.executiveSummary,
      luxoftSolutions: model.luxoftSolutions,
      resultAndAchievements: model.resultAndAchievements,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ICaseStudyOverviewProjectionDTO
  ): CaseStudyOverviewProjectionDTO {
    const result = new CaseStudyOverviewProjectionDTO();

    result.archSolution = dto.archSolution;
    result.archSolutionDescription = dto.archSolutionDescription;
    result.businessGoal = dto.businessGoal;
    result.clientSegmentation = dto.clientSegmentation;
    result.customer = dto.customer;
    result.customerFeedback = dto.customerFeedback;
    result.customerLocation = dto.customerLocation;
    result.customerRole = dto.customerRole;
    result.executiveSummary = dto.executiveSummary;
    result.luxoftSolutions = dto.luxoftSolutions;
    result.resultAndAchievements = dto.resultAndAchievements;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class CaseStudyUpdateModelStrictDto {
  public caseStudy: CaseStudyIdentityDTO = undefined;

  public executiveSummary: OptionalString = undefined;

  public clientSegmentation: OptionalNullableClientSegmentation = undefined;

  public businessGoal: OptionalString = undefined;

  public luxoftSolutions: OptionalString = undefined;

  public resultAndAchievements: OptionalString = undefined;

  public customer: OptionalString = undefined;

  public customerLocation: OptionalString = undefined;

  public customerRole: OptionalString = undefined;

  public customerFeedback: OptionalString = undefined;

  public archSolution: OptionalNullableArchitectureSolution = undefined;

  public archSolutionDescription: OptionalString = undefined;

  private __caseStudyUpdateModelStrictDto: string;

  public static toDTO(
    model: Partial<CaseStudyUpdateModelStrictDto>
  ): ICaseStudyUpdateModelStrictDto {
    return {
      caseStudy: model.caseStudy
        ? CaseStudyIdentityDTO.toDTO(model.caseStudy.id)
        : undefined,
      executiveSummary: model.executiveSummary
        ? OptionalString.toDTO(model.executiveSummary)
        : undefined,
      clientSegmentation: model.clientSegmentation
        ? OptionalNullableClientSegmentation.toDTO(model.clientSegmentation)
        : undefined,
      businessGoal: model.businessGoal
        ? OptionalString.toDTO(model.businessGoal)
        : undefined,
      luxoftSolutions: model.luxoftSolutions
        ? OptionalString.toDTO(model.luxoftSolutions)
        : undefined,
      resultAndAchievements: model.resultAndAchievements
        ? OptionalString.toDTO(model.resultAndAchievements)
        : undefined,
      customer: model.customer
        ? OptionalString.toDTO(model.customer)
        : undefined,
      customerLocation: model.customerLocation
        ? OptionalString.toDTO(model.customerLocation)
        : undefined,
      customerRole: model.customerRole
        ? OptionalString.toDTO(model.customerRole)
        : undefined,
      customerFeedback: model.customerFeedback
        ? OptionalString.toDTO(model.customerFeedback)
        : undefined,
      archSolution: model.archSolution
        ? OptionalNullableArchitectureSolution.toDTO(model.archSolution)
        : undefined,
      archSolutionDescription: model.archSolutionDescription
        ? OptionalString.toDTO(model.archSolutionDescription)
        : undefined
    };
  }

  public static fromDTO(
    dto: ICaseStudyUpdateModelStrictDto
  ): CaseStudyUpdateModelStrictDto {
    const result = new CaseStudyUpdateModelStrictDto();

    result.caseStudy = dto.caseStudy
      ? new CaseStudyIdentityDTO(dto.caseStudy.id)
      : undefined;
    result.executiveSummary = dto.executiveSummary
      ? OptionalString.fromDTO(dto.executiveSummary)
      : undefined;
    result.clientSegmentation = dto.clientSegmentation
      ? OptionalNullableClientSegmentation.fromDTO(dto.clientSegmentation)
      : undefined;
    result.businessGoal = dto.businessGoal
      ? OptionalString.fromDTO(dto.businessGoal)
      : undefined;
    result.luxoftSolutions = dto.luxoftSolutions
      ? OptionalString.fromDTO(dto.luxoftSolutions)
      : undefined;
    result.resultAndAchievements = dto.resultAndAchievements
      ? OptionalString.fromDTO(dto.resultAndAchievements)
      : undefined;
    result.customer = dto.customer
      ? OptionalString.fromDTO(dto.customer)
      : undefined;
    result.customerLocation = dto.customerLocation
      ? OptionalString.fromDTO(dto.customerLocation)
      : undefined;
    result.customerRole = dto.customerRole
      ? OptionalString.fromDTO(dto.customerRole)
      : undefined;
    result.customerFeedback = dto.customerFeedback
      ? OptionalString.fromDTO(dto.customerFeedback)
      : undefined;
    result.archSolution = dto.archSolution
      ? OptionalNullableArchitectureSolution.fromDTO(dto.archSolution)
      : undefined;
    result.archSolutionDescription = dto.archSolutionDescription
      ? OptionalString.fromDTO(dto.archSolutionDescription)
      : undefined;

    return result;
  }
}

export class CommandModel {
  public type: CommandType = undefined;

  public name: string = undefined;

  public commentIsRequired: boolean = undefined;

  private __commandModel: string;

  public static toDTO(model: Partial<CommandModel>): ICommandModel {
    return {
      type: model.type,
      name: model.name,
      commentIsRequired: model.commentIsRequired
    };
  }

  public static fromDTO(dto: ICommandModel): CommandModel {
    const result = new CommandModel();

    result.type = dto.type;
    result.name = dto.name;
    result.commentIsRequired = dto.commentIsRequired;

    return result;
  }
}

export class CssModelRichDTO {
  public rates: CssSurveyModelRichDTO[] = undefined;

  public customer: string = undefined;

  private __cssModelRichDTO: string;

  public static toDTO(model: Partial<CssModelRichDTO>): ICssModelRichDTO {
    return {
      rates: model.rates
        ? model.rates.map(x => CssSurveyModelRichDTO.toDTO(x))
        : undefined,
      customer: model.customer
    };
  }

  public static fromDTO(dto: ICssModelRichDTO): CssModelRichDTO {
    const result = new CssModelRichDTO();

    result.rates = dto.rates
      ? dto.rates.map(x => CssSurveyModelRichDTO.fromDTO(x))
      : [];
    result.customer = dto.customer;

    return result;
  }
}

export class CssSurveyModelRichDTO {
  public averageRate: number = undefined;

  public comment: string = undefined;

  public commentDate: Date = undefined;

  public date: Date = undefined;

  public id: Guid = undefined;

  private __cssSurveyModelRichDTO: string;

  public static toDTO(
    model: Partial<CssSurveyModelRichDTO>
  ): ICssSurveyModelRichDTO {
    return {
      averageRate: model.averageRate,
      comment: model.comment,
      commentDate: toDateOut(model.commentDate),
      date: toDateOut(model.date),
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(dto: ICssSurveyModelRichDTO): CssSurveyModelRichDTO {
    const result = new CssSurveyModelRichDTO();

    result.averageRate = dto.averageRate;
    result.comment = dto.comment;
    result.commentDate = toDateIn(dto.commentDate);
    result.date = toDateIn(dto.date);
    result.id = new Guid(dto.id);

    return result;
  }
}

export class CustomerManagementProjectionDTO {
  public clientName: string = undefined;

  public customerKeyPeople: string[] = undefined;

  public hasLdsProject: boolean = undefined;

  public projectCustomerProjectManager: string = undefined;

  public projectLdsProjectId: Guid = undefined;

  public id: Guid = undefined;

  private __customerManagementProjectionDTO: string;

  public static toDTO(
    model: Partial<CustomerManagementProjectionDTO>
  ): ICustomerManagementProjectionDTO {
    return {
      clientName: model.clientName,
      customerKeyPeople: model.customerKeyPeople,
      hasLdsProject: model.hasLdsProject,
      projectCustomerProjectManager: model.projectCustomerProjectManager,
      projectLdsProjectId: model.projectLdsProjectId
        ? model.projectLdsProjectId.toString()
        : Guid.empty.toString(),
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ICustomerManagementProjectionDTO
  ): CustomerManagementProjectionDTO {
    const result = new CustomerManagementProjectionDTO();

    result.clientName = dto.clientName;
    result.customerKeyPeople = dto.customerKeyPeople;
    result.hasLdsProject = dto.hasLdsProject;
    result.projectCustomerProjectManager = dto.projectCustomerProjectManager;
    result.projectLdsProjectId = new Guid(dto.projectLdsProjectId);
    result.id = new Guid(dto.id);

    return result;
  }
}

export class EmployeeByLocationModel {
  public roleName: string = undefined;

  public active: boolean = undefined;

  public totalWorkloadPercent: number = undefined;

  public allocations: AllocationModel[] = undefined;

  public id: Guid = undefined;

  public name: string = undefined;

  private __employeeByLocationModel: string;

  public static toDTO(
    model: Partial<EmployeeByLocationModel>
  ): IEmployeeByLocationModel {
    return {
      roleName: model.roleName,
      active: model.active,
      totalWorkloadPercent: model.totalWorkloadPercent,
      allocations: model.allocations
        ? model.allocations.map(x => AllocationModel.toDTO(x))
        : undefined,
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name
    };
  }

  public static fromDTO(
    dto: IEmployeeByLocationModel
  ): EmployeeByLocationModel {
    const result = new EmployeeByLocationModel();

    result.roleName = dto.roleName;
    result.active = dto.active;
    result.totalWorkloadPercent = dto.totalWorkloadPercent;
    result.allocations = dto.allocations
      ? dto.allocations.map(x => AllocationModel.fromDTO(x))
      : [];
    result.id = new Guid(dto.id);
    result.name = dto.name;

    return result;
  }
}

export class EmployeeByRoleModelRichDTO {
  public allocations: AllocationModel[] = undefined;

  public active: boolean = undefined;

  public country: string = undefined;

  public id: Guid = undefined;

  public location: string = undefined;

  public name: string = undefined;

  public totalWorkloadPercent: number = undefined;

  private __employeeByRoleModelRichDTO: string;

  public static toDTO(
    model: Partial<EmployeeByRoleModelRichDTO>
  ): IEmployeeByRoleModelRichDTO {
    return {
      allocations: model.allocations
        ? model.allocations.map(x => AllocationModel.toDTO(x))
        : undefined,
      active: model.active,
      country: model.country,
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      location: model.location,
      name: model.name,
      totalWorkloadPercent: model.totalWorkloadPercent
    };
  }

  public static fromDTO(
    dto: IEmployeeByRoleModelRichDTO
  ): EmployeeByRoleModelRichDTO {
    const result = new EmployeeByRoleModelRichDTO();

    result.allocations = dto.allocations
      ? dto.allocations.map(x => AllocationModel.fromDTO(x))
      : [];
    result.active = dto.active;
    result.country = dto.country;
    result.id = new Guid(dto.id);
    result.location = dto.location;
    result.name = dto.name;
    result.totalWorkloadPercent = dto.totalWorkloadPercent;

    return result;
  }
}

export class EmployeeIdentityDTO {
  public id: Guid = undefined;

  private __employeeIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IEmployeeIdentityDTO {
    return { id: id.toString() };
  }
}

export class EmployeeModel {
  public id: Guid = undefined;

  public fullName: string = undefined;

  public active: boolean = undefined;

  public isCurrent: boolean = undefined;

  private __employeeModel: string;

  public static toDTO(model: Partial<EmployeeModel>): IEmployeeModel {
    return {
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      fullName: model.fullName,
      active: model.active,
      isCurrent: model.isCurrent
    };
  }

  public static fromDTO(dto: IEmployeeModel): EmployeeModel {
    const result = new EmployeeModel();

    result.id = new Guid(dto.id);
    result.fullName = dto.fullName;
    result.active = dto.active;
    result.isCurrent = dto.isCurrent;

    return result;
  }
}

export class EmployeeSimpleDTO {
  public email: string = undefined;

  public firstName: string = undefined;

  public fullName: string = undefined;

  public lastName: string = undefined;

  public login: string = undefined;

  public pin: number = undefined;

  public status: EmployeeStatus = undefined;

  public terminationDate: Date = undefined;

  public active: boolean = undefined;

  public createDate: Date = undefined;

  public createdBy: string = undefined;

  public modifiedBy: string = undefined;

  public modifyDate: Date = undefined;

  public version: number = undefined;

  public id: Guid = undefined;

  private __employeeSimpleDTO: string;

  public static toDTO(model: Partial<EmployeeSimpleDTO>): IEmployeeSimpleDTO {
    return {
      email: model.email,
      firstName: model.firstName,
      fullName: model.fullName,
      lastName: model.lastName,
      login: model.login,
      pin: model.pin,
      status: model.status,
      terminationDate: toDateOut(model.terminationDate),
      active: model.active,
      createDate: toDateOut(model.createDate),
      createdBy: model.createdBy,
      modifiedBy: model.modifiedBy,
      modifyDate: toDateOut(model.modifyDate),
      version: model.version,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(dto: IEmployeeSimpleDTO): EmployeeSimpleDTO {
    const result = new EmployeeSimpleDTO();

    result.email = dto.email;
    result.firstName = dto.firstName;
    result.fullName = dto.fullName;
    result.lastName = dto.lastName;
    result.login = dto.login;
    result.pin = dto.pin;
    result.status = dto.status;
    result.terminationDate = toDateIn(dto.terminationDate);
    result.active = dto.active;
    result.createDate = toDateIn(dto.createDate);
    result.createdBy = dto.createdBy;
    result.modifiedBy = dto.modifiedBy;
    result.modifyDate = toDateIn(dto.modifyDate);
    result.version = dto.version;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class EmployeeTaskDashboardModelRichDTO {
  public dueDate: Date = undefined;

  public passportId: Guid = undefined;

  public project: string = undefined;

  public startDate: Date = undefined;

  public taskName: string = undefined;

  public taskType: TaskType = undefined;

  private __employeeTaskDashboardModelRichDTO: string;

  public static toDTO(
    model: Partial<EmployeeTaskDashboardModelRichDTO>
  ): IEmployeeTaskDashboardModelRichDTO {
    return {
      dueDate: toDateOut(model.dueDate),
      passportId: model.passportId
        ? model.passportId.toString()
        : Guid.empty.toString(),
      project: model.project,
      startDate: toDateOut(model.startDate),
      taskName: model.taskName,
      taskType: model.taskType
    };
  }

  public static fromDTO(
    dto: IEmployeeTaskDashboardModelRichDTO
  ): EmployeeTaskDashboardModelRichDTO {
    const result = new EmployeeTaskDashboardModelRichDTO();

    result.dueDate = toDateIn(dto.dueDate);
    result.passportId = new Guid(dto.passportId);
    result.project = dto.project;
    result.startDate = toDateIn(dto.startDate);
    result.taskName = dto.taskName;
    result.taskType = dto.taskType;

    return result;
  }
}

export class EngagementModelIdentityDTO {
  public id: Guid = undefined;

  private __engagementModelIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IEngagementModelIdentityDTO {
    return { id: id.toString() };
  }
}

export class FbuFilterStrictDTO {
  public name: string = undefined;

  private __fbuFilterStrictDTO: string;

  public static toDTO(model: Partial<FbuFilterStrictDTO>): IFbuFilterStrictDTO {
    return {
      name: model.name
    };
  }

  public static fromDTO(dto: IFbuFilterStrictDTO): FbuFilterStrictDTO {
    const result = new FbuFilterStrictDTO();

    result.name = dto.name;

    return result;
  }
}

export class FbuProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __fbuProjectionDTO: string;

  public static toDTO(model: Partial<FbuProjectionDTO>): IFbuProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(dto: IFbuProjectionDTO): FbuProjectionDTO {
    const result = new FbuProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class FinancialBusinessUnitIdentityDTO {
  public id: Guid = undefined;

  private __financialBusinessUnitIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IFinancialBusinessUnitIdentityDTO {
    return { id: id.toString() };
  }
}

export class FunctionalSafetyEmployeeProjectionDTO {
  public active: boolean = undefined;

  public fullName: string = undefined;

  public id: Guid = undefined;

  private __functionalSafetyEmployeeProjectionDTO: string;

  public static toDTO(
    model: Partial<FunctionalSafetyEmployeeProjectionDTO>
  ): IFunctionalSafetyEmployeeProjectionDTO {
    return {
      active: model.active,
      fullName: model.fullName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IFunctionalSafetyEmployeeProjectionDTO
  ): FunctionalSafetyEmployeeProjectionDTO {
    const result = new FunctionalSafetyEmployeeProjectionDTO();

    result.active = dto.active;
    result.fullName = dto.fullName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class GetTierReportModelStrictDTO {
  public passport: PassportIdentityDTO = undefined;

  public tierReport: TierReportIdentityDTO = undefined;

  private __getTierReportModelStrictDTO: string;

  public static toDTO(
    model: Partial<GetTierReportModelStrictDTO>
  ): IGetTierReportModelStrictDTO {
    return {
      passport: model.passport
        ? PassportIdentityDTO.toDTO(model.passport.id)
        : undefined,
      tierReport: model.tierReport
        ? TierReportIdentityDTO.toDTO(model.tierReport.id)
        : undefined
    };
  }

  public static fromDTO(
    dto: IGetTierReportModelStrictDTO
  ): GetTierReportModelStrictDTO {
    const result = new GetTierReportModelStrictDTO();

    result.passport = dto.passport
      ? new PassportIdentityDTO(dto.passport.id)
      : undefined;
    result.tierReport = dto.tierReport
      ? new TierReportIdentityDTO(dto.tierReport.id)
      : undefined;

    return result;
  }
}

export class InitDto {
  public version: string = undefined;

  public id: Guid = undefined;

  public name: string = undefined;

  public login: string = undefined;

  private __initDto: string;

  public static toDTO(model: Partial<InitDto>): IInitDto {
    return {
      version: model.version,
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name,
      login: model.login
    };
  }

  public static fromDTO(dto: IInitDto): InitDto {
    const result = new InitDto();

    result.version = dto.version;
    result.id = new Guid(dto.id);
    result.name = dto.name;
    result.login = dto.login;

    return result;
  }
}

export class InternalPassportIdentityDTO {
  public id: Guid = undefined;

  private __internalPassportIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IInternalPassportIdentityDTO {
    return { id: id.toString() };
  }
}

export class InternalPassportSectionItemIdentityDTO {
  public id: Guid = undefined;

  private __internalPassportSectionItemIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IInternalPassportSectionItemIdentityDTO {
    return { id: id.toString() };
  }
}

export class InternalPassportSectionItemUpdateStrictDto {
  public sectionItem: InternalPassportSectionItemIdentityDTO = undefined;

  public status: RagStatus = undefined;

  private __internalPassportSectionItemUpdateStrictDto: string;

  public static toDTO(
    model: Partial<InternalPassportSectionItemUpdateStrictDto>
  ): IInternalPassportSectionItemUpdateStrictDto {
    return {
      sectionItem: model.sectionItem
        ? InternalPassportSectionItemIdentityDTO.toDTO(model.sectionItem.id)
        : undefined,
      status: model.status
    };
  }

  public static fromDTO(
    dto: IInternalPassportSectionItemUpdateStrictDto
  ): InternalPassportSectionItemUpdateStrictDto {
    const result = new InternalPassportSectionItemUpdateStrictDto();

    result.sectionItem = dto.sectionItem
      ? new InternalPassportSectionItemIdentityDTO(dto.sectionItem.id)
      : undefined;
    result.status = dto.status;

    return result;
  }
}

export class LdsDashboardCriticalFilterModelRichDTO {
  public count: number = undefined;

  public status: RagStatus = undefined;

  private __ldsDashboardCriticalFilterModelRichDTO: string;

  public static toDTO(
    model: Partial<LdsDashboardCriticalFilterModelRichDTO>
  ): ILdsDashboardCriticalFilterModelRichDTO {
    return {
      count: model.count,
      status: model.status
    };
  }

  public static fromDTO(
    dto: ILdsDashboardCriticalFilterModelRichDTO
  ): LdsDashboardCriticalFilterModelRichDTO {
    const result = new LdsDashboardCriticalFilterModelRichDTO();

    result.count = dto.count;
    result.status = dto.status;

    return result;
  }
}

export class LdsDashboardFilterModelStrictDTO {
  public ragStatus: RagStatus = undefined;

  public skip: number = undefined;

  public take: number = undefined;

  private __ldsDashboardFilterModelStrictDTO: string;

  public static toDTO(
    model: Partial<LdsDashboardFilterModelStrictDTO>
  ): ILdsDashboardFilterModelStrictDTO {
    return {
      ragStatus: model.ragStatus,
      skip: model.skip,
      take: model.take
    };
  }

  public static fromDTO(
    dto: ILdsDashboardFilterModelStrictDTO
  ): LdsDashboardFilterModelStrictDTO {
    const result = new LdsDashboardFilterModelStrictDTO();

    result.ragStatus = dto.ragStatus;
    result.skip = dto.skip;
    result.take = dto.take;

    return result;
  }
}

export class LdsDashboardTotalInfoModelRichDTO {
  public criticalFilters: LdsDashboardCriticalFilterModelRichDTO[] = undefined;

  public totalCount: number = undefined;

  private __ldsDashboardTotalInfoModelRichDTO: string;

  public static toDTO(
    model: Partial<LdsDashboardTotalInfoModelRichDTO>
  ): ILdsDashboardTotalInfoModelRichDTO {
    return {
      criticalFilters: model.criticalFilters
        ? model.criticalFilters.map(x =>
            LdsDashboardCriticalFilterModelRichDTO.toDTO(x)
          )
        : undefined,
      totalCount: model.totalCount
    };
  }

  public static fromDTO(
    dto: ILdsDashboardTotalInfoModelRichDTO
  ): LdsDashboardTotalInfoModelRichDTO {
    const result = new LdsDashboardTotalInfoModelRichDTO();

    result.criticalFilters = dto.criticalFilters
      ? dto.criticalFilters.map(x =>
          LdsDashboardCriticalFilterModelRichDTO.fromDTO(x)
        )
      : [];
    result.totalCount = dto.totalCount;

    return result;
  }
}

export class LocationIdentityDTO {
  public id: Guid = undefined;

  private __locationIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ILocationIdentityDTO {
    return { id: id.toString() };
  }
}

export class LocationModelRichDTO {
  public count: number = undefined;

  public countryName: string = undefined;

  public hasProjectManager: boolean = undefined;

  public id: Guid = undefined;

  public name: string = undefined;

  private __locationModelRichDTO: string;

  public static toDTO(
    model: Partial<LocationModelRichDTO>
  ): ILocationModelRichDTO {
    return {
      count: model.count,
      countryName: model.countryName,
      hasProjectManager: model.hasProjectManager,
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name
    };
  }

  public static fromDTO(dto: ILocationModelRichDTO): LocationModelRichDTO {
    const result = new LocationModelRichDTO();

    result.count = dto.count;
    result.countryName = dto.countryName;
    result.hasProjectManager = dto.hasProjectManager;
    result.id = new Guid(dto.id);
    result.name = dto.name;

    return result;
  }
}

export class LuxoftManagementEmployeeProjectionDTO {
  public active: boolean = undefined;

  public fullName: string = undefined;

  public id: Guid = undefined;

  private __luxoftManagementEmployeeProjectionDTO: string;

  public static toDTO(
    model: Partial<LuxoftManagementEmployeeProjectionDTO>
  ): ILuxoftManagementEmployeeProjectionDTO {
    return {
      active: model.active,
      fullName: model.fullName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ILuxoftManagementEmployeeProjectionDTO
  ): LuxoftManagementEmployeeProjectionDTO {
    const result = new LuxoftManagementEmployeeProjectionDTO();

    result.active = dto.active;
    result.fullName = dto.fullName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class LuxoftManagementProjectionDTO {
  public accountManager: LuxoftManagementEmployeeProjectionDTO = undefined;

  public deliveryMaturityConsultant: LuxoftManagementEmployeeProjectionDTO = undefined;

  public programManager: LuxoftManagementEmployeeProjectionDTO = undefined;

  public projectManager: LuxoftManagementEmployeeProjectionDTO = undefined;

  public id: Guid = undefined;

  private __luxoftManagementProjectionDTO: string;

  public static toDTO(
    model: Partial<LuxoftManagementProjectionDTO>
  ): ILuxoftManagementProjectionDTO {
    return {
      accountManager: model.accountManager
        ? LuxoftManagementEmployeeProjectionDTO.toDTO(model.accountManager)
        : undefined,
      deliveryMaturityConsultant: model.deliveryMaturityConsultant
        ? LuxoftManagementEmployeeProjectionDTO.toDTO(
            model.deliveryMaturityConsultant
          )
        : undefined,
      programManager: model.programManager
        ? LuxoftManagementEmployeeProjectionDTO.toDTO(model.programManager)
        : undefined,
      projectManager: model.projectManager
        ? LuxoftManagementEmployeeProjectionDTO.toDTO(model.projectManager)
        : undefined,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ILuxoftManagementProjectionDTO
  ): LuxoftManagementProjectionDTO {
    const result = new LuxoftManagementProjectionDTO();

    result.accountManager = dto.accountManager
      ? LuxoftManagementEmployeeProjectionDTO.fromDTO(dto.accountManager)
      : undefined;
    result.deliveryMaturityConsultant = dto.deliveryMaturityConsultant
      ? LuxoftManagementEmployeeProjectionDTO.fromDTO(
          dto.deliveryMaturityConsultant
        )
      : undefined;
    result.programManager = dto.programManager
      ? LuxoftManagementEmployeeProjectionDTO.fromDTO(dto.programManager)
      : undefined;
    result.projectManager = dto.projectManager
      ? LuxoftManagementEmployeeProjectionDTO.fromDTO(dto.projectManager)
      : undefined;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class MethodologyFilterStrictDTO {
  private __methodologyFilterStrictDTO: string;

  public static toDTO(
    model: Partial<MethodologyFilterStrictDTO>
  ): IMethodologyFilterStrictDTO {
    return {};
  }

  public static fromDTO(
    dto: IMethodologyFilterStrictDTO
  ): MethodologyFilterStrictDTO {
    const result = new MethodologyFilterStrictDTO();

    return result;
  }
}

export class MethodologyIdentityDTO {
  public id: Guid = undefined;

  private __methodologyIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IMethodologyIdentityDTO {
    return { id: id.toString() };
  }
}

export class OptionalActivityIdentityDTOArray {
  public value: ActivityIdentityDTO[] = undefined;

  private __optionalActivityIdentityDTOArray: string;

  public static toDTO(
    model: Partial<OptionalActivityIdentityDTOArray>
  ): IOptionalActivityIdentityDTOArray {
    return {
      value: model.value
        ? model.value.map(x => ActivityIdentityDTO.toDTO(x.id))
        : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalActivityIdentityDTOArray
  ): OptionalActivityIdentityDTOArray {
    const result = new OptionalActivityIdentityDTOArray();

    result.value = dto.value
      ? dto.value.map(x => new ActivityIdentityDTO(x.id))
      : [];

    return result;
  }
}

export class OptionalDateTime {
  public value: Date = undefined;

  private __optionalDateTime: string;

  public static toDTO(model: Partial<OptionalDateTime>): IOptionalDateTime {
    return {
      value: toDateOut(model.value)
    };
  }

  public static fromDTO(dto: IOptionalDateTime): OptionalDateTime {
    const result = new OptionalDateTime();

    result.value = toDateIn(dto.value);

    return result;
  }
}

export class OptionalEmployeeIdentityDTO {
  public value: EmployeeIdentityDTO = undefined;

  private __optionalEmployeeIdentityDTO: string;

  public static toDTO(
    model: Partial<OptionalEmployeeIdentityDTO>
  ): IOptionalEmployeeIdentityDTO {
    return {
      value: model.value ? EmployeeIdentityDTO.toDTO(model.value.id) : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalEmployeeIdentityDTO
  ): OptionalEmployeeIdentityDTO {
    const result = new OptionalEmployeeIdentityDTO();

    result.value = dto.value
      ? new EmployeeIdentityDTO(dto.value.id)
      : undefined;

    return result;
  }
}

export class OptionalEngagementModelIdentityDTO {
  public value: EngagementModelIdentityDTO = undefined;

  private __optionalEngagementModelIdentityDTO: string;

  public static toDTO(
    model: Partial<OptionalEngagementModelIdentityDTO>
  ): IOptionalEngagementModelIdentityDTO {
    return {
      value: model.value
        ? EngagementModelIdentityDTO.toDTO(model.value.id)
        : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalEngagementModelIdentityDTO
  ): OptionalEngagementModelIdentityDTO {
    const result = new OptionalEngagementModelIdentityDTO();

    result.value = dto.value
      ? new EngagementModelIdentityDTO(dto.value.id)
      : undefined;

    return result;
  }
}

export class OptionalMethodologyIdentityDTOArray {
  public value: MethodologyIdentityDTO[] = undefined;

  private __optionalMethodologyIdentityDTOArray: string;

  public static toDTO(
    model: Partial<OptionalMethodologyIdentityDTOArray>
  ): IOptionalMethodologyIdentityDTOArray {
    return {
      value: model.value
        ? model.value.map(x => MethodologyIdentityDTO.toDTO(x.id))
        : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalMethodologyIdentityDTOArray
  ): OptionalMethodologyIdentityDTOArray {
    const result = new OptionalMethodologyIdentityDTOArray();

    result.value = dto.value
      ? dto.value.map(x => new MethodologyIdentityDTO(x.id))
      : [];

    return result;
  }
}

export class OptionalNullableArchitectureSolution {
  public value: ArchitectureSolution = undefined;

  private __optionalNullableArchitectureSolution: string;

  public static toDTO(
    model: Partial<OptionalNullableArchitectureSolution>
  ): IOptionalNullableArchitectureSolution {
    return {
      value: model.value
    };
  }

  public static fromDTO(
    dto: IOptionalNullableArchitectureSolution
  ): OptionalNullableArchitectureSolution {
    const result = new OptionalNullableArchitectureSolution();

    result.value = dto.value;

    return result;
  }
}

export class OptionalNullableClientSegmentation {
  public value: ClientSegmentation = undefined;

  private __optionalNullableClientSegmentation: string;

  public static toDTO(
    model: Partial<OptionalNullableClientSegmentation>
  ): IOptionalNullableClientSegmentation {
    return {
      value: model.value
    };
  }

  public static fromDTO(
    dto: IOptionalNullableClientSegmentation
  ): OptionalNullableClientSegmentation {
    const result = new OptionalNullableClientSegmentation();

    result.value = dto.value;

    return result;
  }
}

export class OptionalNullableDateTime {
  public value: Date = undefined;

  private __optionalNullableDateTime: string;

  public static toDTO(
    model: Partial<OptionalNullableDateTime>
  ): IOptionalNullableDateTime {
    return {
      value: toDateOut(model.value)
    };
  }

  public static fromDTO(
    dto: IOptionalNullableDateTime
  ): OptionalNullableDateTime {
    const result = new OptionalNullableDateTime();

    result.value = toDateIn(dto.value);

    return result;
  }
}

export class OptionalNullableFunctionalSafety {
  public value: FunctionalSafety = undefined;

  private __optionalNullableFunctionalSafety: string;

  public static toDTO(
    model: Partial<OptionalNullableFunctionalSafety>
  ): IOptionalNullableFunctionalSafety {
    return {
      value: model.value
    };
  }

  public static fromDTO(
    dto: IOptionalNullableFunctionalSafety
  ): OptionalNullableFunctionalSafety {
    const result = new OptionalNullableFunctionalSafety();

    result.value = dto.value;

    return result;
  }
}

export class OptionalNullableGuid {
  public value: Guid = undefined;

  private __optionalNullableGuid: string;

  public static toDTO(
    model: Partial<OptionalNullableGuid>
  ): IOptionalNullableGuid {
    return {
      value: model.value ? model.value.toString() : undefined
    };
  }

  public static fromDTO(dto: IOptionalNullableGuid): OptionalNullableGuid {
    const result = new OptionalNullableGuid();

    result.value = dto.value ? new Guid(dto.value) : undefined;

    return result;
  }
}

export class OptionalNullablePricingModel {
  public value: PricingModel = undefined;

  private __optionalNullablePricingModel: string;

  public static toDTO(
    model: Partial<OptionalNullablePricingModel>
  ): IOptionalNullablePricingModel {
    return {
      value: model.value
    };
  }

  public static fromDTO(
    dto: IOptionalNullablePricingModel
  ): OptionalNullablePricingModel {
    const result = new OptionalNullablePricingModel();

    result.value = dto.value;

    return result;
  }
}

export class OptionalProjectComplexity {
  public value: ProjectComplexity = undefined;

  private __optionalProjectComplexity: string;

  public static toDTO(
    model: Partial<OptionalProjectComplexity>
  ): IOptionalProjectComplexity {
    return {
      value: model.value
    };
  }

  public static fromDTO(
    dto: IOptionalProjectComplexity
  ): OptionalProjectComplexity {
    const result = new OptionalProjectComplexity();

    result.value = dto.value;

    return result;
  }
}

export class OptionalProjectStatus {
  public value: ProjectStatus = undefined;

  private __optionalProjectStatus: string;

  public static toDTO(
    model: Partial<OptionalProjectStatus>
  ): IOptionalProjectStatus {
    return {
      value: model.value
    };
  }

  public static fromDTO(dto: IOptionalProjectStatus): OptionalProjectStatus {
    const result = new OptionalProjectStatus();

    result.value = dto.value;

    return result;
  }
}

export class OptionalQualityApproachIdentityDTOArray {
  public value: QualityApproachIdentityDTO[] = undefined;

  private __optionalQualityApproachIdentityDTOArray: string;

  public static toDTO(
    model: Partial<OptionalQualityApproachIdentityDTOArray>
  ): IOptionalQualityApproachIdentityDTOArray {
    return {
      value: model.value
        ? model.value.map(x => QualityApproachIdentityDTO.toDTO(x.id))
        : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalQualityApproachIdentityDTOArray
  ): OptionalQualityApproachIdentityDTOArray {
    const result = new OptionalQualityApproachIdentityDTOArray();

    result.value = dto.value
      ? dto.value.map(x => new QualityApproachIdentityDTO(x.id))
      : [];

    return result;
  }
}

export class OptionalSeProjectIdentityDTOArray {
  public value: SeProjectIdentityDTO[] = undefined;

  private __optionalSeProjectIdentityDTOArray: string;

  public static toDTO(
    model: Partial<OptionalSeProjectIdentityDTOArray>
  ): IOptionalSeProjectIdentityDTOArray {
    return {
      value: model.value
        ? model.value.map(x => SeProjectIdentityDTO.toDTO(x.id))
        : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalSeProjectIdentityDTOArray
  ): OptionalSeProjectIdentityDTOArray {
    const result = new OptionalSeProjectIdentityDTOArray();

    result.value = dto.value
      ? dto.value.map(x => new SeProjectIdentityDTO(x.id))
      : [];

    return result;
  }
}

export class OptionalSkillIdentityDTOArray {
  public value: SkillIdentityDTO[] = undefined;

  private __optionalSkillIdentityDTOArray: string;

  public static toDTO(
    model: Partial<OptionalSkillIdentityDTOArray>
  ): IOptionalSkillIdentityDTOArray {
    return {
      value: model.value
        ? model.value.map(x => SkillIdentityDTO.toDTO(x.id))
        : undefined
    };
  }

  public static fromDTO(
    dto: IOptionalSkillIdentityDTOArray
  ): OptionalSkillIdentityDTOArray {
    const result = new OptionalSkillIdentityDTOArray();

    result.value = dto.value
      ? dto.value.map(x => new SkillIdentityDTO(x.id))
      : [];

    return result;
  }
}

export class OptionalString {
  public value: string = undefined;

  private __optionalString: string;

  public static toDTO(model: Partial<OptionalString>): IOptionalString {
    return {
      value: model.value
    };
  }

  public static fromDTO(dto: IOptionalString): OptionalString {
    const result = new OptionalString();

    result.value = dto.value;

    return result;
  }
}

export class PassportCardActivityProjectionDTO {
  public activityName: string = undefined;

  public id: Guid = undefined;

  private __passportCardActivityProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportCardActivityProjectionDTO>
  ): IPassportCardActivityProjectionDTO {
    return {
      activityName: model.activityName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportCardActivityProjectionDTO
  ): PassportCardActivityProjectionDTO {
    const result = new PassportCardActivityProjectionDTO();

    result.activityName = dto.activityName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportCardEmployeeProjectionDTO {
  public active: boolean = undefined;

  public fullName: string = undefined;

  public id: Guid = undefined;

  private __passportCardEmployeeProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportCardEmployeeProjectionDTO>
  ): IPassportCardEmployeeProjectionDTO {
    return {
      active: model.active,
      fullName: model.fullName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportCardEmployeeProjectionDTO
  ): PassportCardEmployeeProjectionDTO {
    const result = new PassportCardEmployeeProjectionDTO();

    result.active = dto.active;
    result.fullName = dto.fullName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportCardProjectionDTO {
  public caseStudyInProgress: boolean = undefined;

  public cssOverallLevel: number = undefined;

  public hasAccessToManagementInfo: boolean = undefined;

  public ldsCriticalStatus: RagStatus = undefined;

  public project: PassportCardProjectProjectionDTO = undefined;

  public status: PassportStatus = undefined;

  public teamLocations: string[] = undefined;

  public teamSize: number = undefined;

  public id: Guid = undefined;

  private __passportCardProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportCardProjectionDTO>
  ): IPassportCardProjectionDTO {
    return {
      caseStudyInProgress: model.caseStudyInProgress,
      cssOverallLevel: model.cssOverallLevel,
      hasAccessToManagementInfo: model.hasAccessToManagementInfo,
      ldsCriticalStatus: model.ldsCriticalStatus,
      project: model.project
        ? PassportCardProjectProjectionDTO.toDTO(model.project)
        : undefined,
      status: model.status,
      teamLocations: model.teamLocations,
      teamSize: model.teamSize,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportCardProjectionDTO
  ): PassportCardProjectionDTO {
    const result = new PassportCardProjectionDTO();

    result.caseStudyInProgress = dto.caseStudyInProgress;
    result.cssOverallLevel = dto.cssOverallLevel;
    result.hasAccessToManagementInfo = dto.hasAccessToManagementInfo;
    result.ldsCriticalStatus = dto.ldsCriticalStatus;
    result.project = dto.project
      ? PassportCardProjectProjectionDTO.fromDTO(dto.project)
      : undefined;
    result.status = dto.status;
    result.teamLocations = dto.teamLocations;
    result.teamSize = dto.teamSize;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportCardProjectProjectionDTO {
  public accountManager: PassportCardEmployeeProjectionDTO = undefined;

  public client: string = undefined;

  public closeDate: Date = undefined;

  public horizontal: string = undefined;

  public mainActivities: PassportCardActivityProjectionDTO[] = undefined;

  public name: string = undefined;

  public projectManager: PassportCardEmployeeProjectionDTO = undefined;

  public skills: PassportCardSkillProjectionDTO[] = undefined;

  public startDate: Date = undefined;

  public id: Guid = undefined;

  private __passportCardProjectProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportCardProjectProjectionDTO>
  ): IPassportCardProjectProjectionDTO {
    return {
      accountManager: model.accountManager
        ? PassportCardEmployeeProjectionDTO.toDTO(model.accountManager)
        : undefined,
      client: model.client,
      closeDate: toDateOut(model.closeDate),
      horizontal: model.horizontal,
      mainActivities: model.mainActivities
        ? model.mainActivities.map(x =>
            PassportCardActivityProjectionDTO.toDTO(x)
          )
        : undefined,
      name: model.name,
      projectManager: model.projectManager
        ? PassportCardEmployeeProjectionDTO.toDTO(model.projectManager)
        : undefined,
      skills: model.skills
        ? model.skills.map(x => PassportCardSkillProjectionDTO.toDTO(x))
        : undefined,
      startDate: toDateOut(model.startDate),
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportCardProjectProjectionDTO
  ): PassportCardProjectProjectionDTO {
    const result = new PassportCardProjectProjectionDTO();

    result.accountManager = dto.accountManager
      ? PassportCardEmployeeProjectionDTO.fromDTO(dto.accountManager)
      : undefined;
    result.client = dto.client;
    result.closeDate = toDateIn(dto.closeDate);
    result.horizontal = dto.horizontal;
    result.mainActivities = dto.mainActivities
      ? dto.mainActivities.map(x =>
          PassportCardActivityProjectionDTO.fromDTO(x)
        )
      : [];
    result.name = dto.name;
    result.projectManager = dto.projectManager
      ? PassportCardEmployeeProjectionDTO.fromDTO(dto.projectManager)
      : undefined;
    result.skills = dto.skills
      ? dto.skills.map(x => PassportCardSkillProjectionDTO.fromDTO(x))
      : [];
    result.startDate = toDateIn(dto.startDate);
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportCardSkillProjectionDTO {
  public skillName: string = undefined;

  public id: Guid = undefined;

  private __passportCardSkillProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportCardSkillProjectionDTO>
  ): IPassportCardSkillProjectionDTO {
    return {
      skillName: model.skillName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportCardSkillProjectionDTO
  ): PassportCardSkillProjectionDTO {
    const result = new PassportCardSkillProjectionDTO();

    result.skillName = dto.skillName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportCreateModelStrictDTO {
  public code: string = undefined;

  public name: string = undefined;

  public program: FinancialBusinessUnitIdentityDTO = undefined;

  public projectManager: EmployeeIdentityDTO = undefined;

  public startDate: Date = undefined;

  private __passportCreateModelStrictDTO: string;

  public static toDTO(
    model: Partial<PassportCreateModelStrictDTO>
  ): IPassportCreateModelStrictDTO {
    return {
      code: model.code,
      name: model.name,
      program: model.program
        ? FinancialBusinessUnitIdentityDTO.toDTO(model.program.id)
        : undefined,
      projectManager: model.projectManager
        ? EmployeeIdentityDTO.toDTO(model.projectManager.id)
        : undefined,
      startDate: toDateOut(model.startDate)
    };
  }

  public static fromDTO(
    dto: IPassportCreateModelStrictDTO
  ): PassportCreateModelStrictDTO {
    const result = new PassportCreateModelStrictDTO();

    result.code = dto.code;
    result.name = dto.name;
    result.program = dto.program
      ? new FinancialBusinessUnitIdentityDTO(dto.program.id)
      : undefined;
    result.projectManager = dto.projectManager
      ? new EmployeeIdentityDTO(dto.projectManager.id)
      : undefined;
    result.startDate = toDateIn(dto.startDate);

    return result;
  }
}

export class PassportFilterDataModelRichDTO {
  public countries: VisualObjectModelRichDTO[] = undefined;

  public engagementModels: VisualObjectModelRichDTO[] = undefined;

  public lobs: VisualObjectModelRichDTO[] = undefined;

  public mainActivity: VisualObjectModelRichDTO[] = undefined;

  public methodologies: VisualObjectModelRichDTO[] = undefined;

  public qualityApproaches: VisualObjectModelRichDTO[] = undefined;

  private __passportFilterDataModelRichDTO: string;

  public static toDTO(
    model: Partial<PassportFilterDataModelRichDTO>
  ): IPassportFilterDataModelRichDTO {
    return {
      countries: model.countries
        ? model.countries.map(x => VisualObjectModelRichDTO.toDTO(x))
        : undefined,
      engagementModels: model.engagementModels
        ? model.engagementModels.map(x => VisualObjectModelRichDTO.toDTO(x))
        : undefined,
      lobs: model.lobs
        ? model.lobs.map(x => VisualObjectModelRichDTO.toDTO(x))
        : undefined,
      mainActivity: model.mainActivity
        ? model.mainActivity.map(x => VisualObjectModelRichDTO.toDTO(x))
        : undefined,
      methodologies: model.methodologies
        ? model.methodologies.map(x => VisualObjectModelRichDTO.toDTO(x))
        : undefined,
      qualityApproaches: model.qualityApproaches
        ? model.qualityApproaches.map(x => VisualObjectModelRichDTO.toDTO(x))
        : undefined
    };
  }

  public static fromDTO(
    dto: IPassportFilterDataModelRichDTO
  ): PassportFilterDataModelRichDTO {
    const result = new PassportFilterDataModelRichDTO();

    result.countries = dto.countries
      ? dto.countries.map(x => VisualObjectModelRichDTO.fromDTO(x))
      : [];
    result.engagementModels = dto.engagementModels
      ? dto.engagementModels.map(x => VisualObjectModelRichDTO.fromDTO(x))
      : [];
    result.lobs = dto.lobs
      ? dto.lobs.map(x => VisualObjectModelRichDTO.fromDTO(x))
      : [];
    result.mainActivity = dto.mainActivity
      ? dto.mainActivity.map(x => VisualObjectModelRichDTO.fromDTO(x))
      : [];
    result.methodologies = dto.methodologies
      ? dto.methodologies.map(x => VisualObjectModelRichDTO.fromDTO(x))
      : [];
    result.qualityApproaches = dto.qualityApproaches
      ? dto.qualityApproaches.map(x => VisualObjectModelRichDTO.fromDTO(x))
      : [];

    return result;
  }
}

export class PassportFilterModelStrictDTO {
  public clientSegmentations: ClientSegmentation[] = undefined;

  public dqmsId: Guid = undefined;

  public endDateFilterModel: PeriodFilterModelStrictDTO = undefined;

  public engagementModels: Guid[] = undefined;

  public functionalSafeties: FunctionalSafety[] = undefined;

  public isCaseStudyExist: boolean = undefined;

  public lineOfBusinesses: Guid[] = undefined;

  public mainActivities: Guid[] = undefined;

  public methodologyModels: Guid[] = undefined;

  public passportStatuses: PassportStatus[] = undefined;

  public pricingModels: PricingModel[] = undefined;

  public projectStatuses: ProjectStatus[] = undefined;

  public qualityApproachModels: Guid[] = undefined;

  public startDateFilterModel: PeriodFilterModelStrictDTO = undefined;

  public teamLocations: Guid[] = undefined;

  public teamSize: TeamSizeFilterModelStrictDTO = undefined;

  private __passportFilterModelStrictDTO: string;

  public static toDTO(
    model: Partial<PassportFilterModelStrictDTO>
  ): IPassportFilterModelStrictDTO {
    return {
      clientSegmentations: model.clientSegmentations,
      dqmsId: model.dqmsId ? model.dqmsId.toString() : undefined,
      endDateFilterModel: model.endDateFilterModel
        ? PeriodFilterModelStrictDTO.toDTO(model.endDateFilterModel)
        : undefined,
      engagementModels: model.engagementModels
        ? model.engagementModels.map(x => x.toString())
        : undefined,
      functionalSafeties: model.functionalSafeties,
      isCaseStudyExist: model.isCaseStudyExist,
      lineOfBusinesses: model.lineOfBusinesses
        ? model.lineOfBusinesses.map(x => x.toString())
        : undefined,
      mainActivities: model.mainActivities
        ? model.mainActivities.map(x => x.toString())
        : undefined,
      methodologyModels: model.methodologyModels
        ? model.methodologyModels.map(x => x.toString())
        : undefined,
      passportStatuses: model.passportStatuses,
      pricingModels: model.pricingModels,
      projectStatuses: model.projectStatuses,
      qualityApproachModels: model.qualityApproachModels
        ? model.qualityApproachModels.map(x => x.toString())
        : undefined,
      startDateFilterModel: model.startDateFilterModel
        ? PeriodFilterModelStrictDTO.toDTO(model.startDateFilterModel)
        : undefined,
      teamLocations: model.teamLocations
        ? model.teamLocations.map(x => x.toString())
        : undefined,
      teamSize: model.teamSize
        ? TeamSizeFilterModelStrictDTO.toDTO(model.teamSize)
        : undefined
    };
  }

  public static fromDTO(
    dto: IPassportFilterModelStrictDTO
  ): PassportFilterModelStrictDTO {
    const result = new PassportFilterModelStrictDTO();

    result.clientSegmentations = dto.clientSegmentations;
    result.dqmsId = dto.dqmsId ? new Guid(dto.dqmsId) : undefined;
    result.endDateFilterModel = dto.endDateFilterModel
      ? PeriodFilterModelStrictDTO.fromDTO(dto.endDateFilterModel)
      : undefined;
    result.engagementModels = dto.engagementModels
      ? dto.engagementModels.map(x => new Guid(x))
      : [];
    result.functionalSafeties = dto.functionalSafeties;
    result.isCaseStudyExist = dto.isCaseStudyExist;
    result.lineOfBusinesses = dto.lineOfBusinesses
      ? dto.lineOfBusinesses.map(x => new Guid(x))
      : [];
    result.mainActivities = dto.mainActivities
      ? dto.mainActivities.map(x => new Guid(x))
      : [];
    result.methodologyModels = dto.methodologyModels
      ? dto.methodologyModels.map(x => new Guid(x))
      : [];
    result.passportStatuses = dto.passportStatuses;
    result.pricingModels = dto.pricingModels;
    result.projectStatuses = dto.projectStatuses;
    result.qualityApproachModels = dto.qualityApproachModels
      ? dto.qualityApproachModels.map(x => new Guid(x))
      : [];
    result.startDateFilterModel = dto.startDateFilterModel
      ? PeriodFilterModelStrictDTO.fromDTO(dto.startDateFilterModel)
      : undefined;
    result.teamLocations = dto.teamLocations
      ? dto.teamLocations.map(x => new Guid(x))
      : [];
    result.teamSize = dto.teamSize
      ? TeamSizeFilterModelStrictDTO.fromDTO(dto.teamSize)
      : undefined;

    return result;
  }
}

export class PassportFilterStrictDTO {
  public passport: PassportIdentityDTO = undefined;

  private __passportFilterStrictDTO: string;

  public static toDTO(
    model: Partial<PassportFilterStrictDTO>
  ): IPassportFilterStrictDTO {
    return {
      passport: model.passport
        ? PassportIdentityDTO.toDTO(model.passport.id)
        : undefined
    };
  }

  public static fromDTO(
    dto: IPassportFilterStrictDTO
  ): PassportFilterStrictDTO {
    const result = new PassportFilterStrictDTO();

    result.passport = dto.passport
      ? new PassportIdentityDTO(dto.passport.id)
      : undefined;

    return result;
  }
}

export class PassportIdentityDTO {
  public id: Guid = undefined;

  private __passportIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IPassportIdentityDTO {
    return { id: id.toString() };
  }
}

export class PassportLocationDTO {
  public passportIdentity: PassportIdentityDTO = undefined;

  public locationIdentity: LocationIdentityDTO = undefined;

  private __passportLocationDTO: string;

  public static toDTO(
    model: Partial<PassportLocationDTO>
  ): IPassportLocationDTO {
    return {
      passportIdentity: model.passportIdentity
        ? PassportIdentityDTO.toDTO(model.passportIdentity.id)
        : undefined,
      locationIdentity: model.locationIdentity
        ? LocationIdentityDTO.toDTO(model.locationIdentity.id)
        : undefined
    };
  }

  public static fromDTO(dto: IPassportLocationDTO): PassportLocationDTO {
    const result = new PassportLocationDTO();

    result.passportIdentity = dto.passportIdentity
      ? new PassportIdentityDTO(dto.passportIdentity.id)
      : undefined;
    result.locationIdentity = dto.locationIdentity
      ? new LocationIdentityDTO(dto.locationIdentity.id)
      : undefined;

    return result;
  }
}

export class PassportOverviewActivityProjectionDTO {
  public activityId: Guid = undefined;

  public activityName: string = undefined;

  public id: Guid = undefined;

  private __passportOverviewActivityProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportOverviewActivityProjectionDTO>
  ): IPassportOverviewActivityProjectionDTO {
    return {
      activityId: model.activityId ? model.activityId.toString() : undefined,
      activityName: model.activityName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportOverviewActivityProjectionDTO
  ): PassportOverviewActivityProjectionDTO {
    const result = new PassportOverviewActivityProjectionDTO();

    result.activityId = dto.activityId ? new Guid(dto.activityId) : undefined;
    result.activityName = dto.activityName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportOverviewEngagementModelProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __passportOverviewEngagementModelProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportOverviewEngagementModelProjectionDTO>
  ): IPassportOverviewEngagementModelProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportOverviewEngagementModelProjectionDTO
  ): PassportOverviewEngagementModelProjectionDTO {
    const result = new PassportOverviewEngagementModelProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportOverviewMethodologyProjectionDTO {
  public methodologyId: Guid = undefined;

  public methodologyName: string = undefined;

  public id: Guid = undefined;

  private __passportOverviewMethodologyProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportOverviewMethodologyProjectionDTO>
  ): IPassportOverviewMethodologyProjectionDTO {
    return {
      methodologyId: model.methodologyId
        ? model.methodologyId.toString()
        : undefined,
      methodologyName: model.methodologyName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportOverviewMethodologyProjectionDTO
  ): PassportOverviewMethodologyProjectionDTO {
    const result = new PassportOverviewMethodologyProjectionDTO();

    result.methodologyId = dto.methodologyId
      ? new Guid(dto.methodologyId)
      : undefined;
    result.methodologyName = dto.methodologyName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportOverviewProjectionDTO {
  public activateDate: Date = undefined;

  public project: ProjectOverviewProjectionDTO = undefined;

  public status: PassportStatus = undefined;

  public id: Guid = undefined;

  private __passportOverviewProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportOverviewProjectionDTO>
  ): IPassportOverviewProjectionDTO {
    return {
      activateDate: toDateOut(model.activateDate),
      project: model.project
        ? ProjectOverviewProjectionDTO.toDTO(model.project)
        : undefined,
      status: model.status,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportOverviewProjectionDTO
  ): PassportOverviewProjectionDTO {
    const result = new PassportOverviewProjectionDTO();

    result.activateDate = toDateIn(dto.activateDate);
    result.project = dto.project
      ? ProjectOverviewProjectionDTO.fromDTO(dto.project)
      : undefined;
    result.status = dto.status;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportOverviewQualityApproachProjectionDTO {
  public qualityApproachId: Guid = undefined;

  public qualityApproachName: string = undefined;

  public id: Guid = undefined;

  private __passportOverviewQualityApproachProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportOverviewQualityApproachProjectionDTO>
  ): IPassportOverviewQualityApproachProjectionDTO {
    return {
      qualityApproachId: model.qualityApproachId
        ? model.qualityApproachId.toString()
        : undefined,
      qualityApproachName: model.qualityApproachName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportOverviewQualityApproachProjectionDTO
  ): PassportOverviewQualityApproachProjectionDTO {
    const result = new PassportOverviewQualityApproachProjectionDTO();

    result.qualityApproachId = dto.qualityApproachId
      ? new Guid(dto.qualityApproachId)
      : undefined;
    result.qualityApproachName = dto.qualityApproachName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportProgramUpdateModelStrictDTO {
  public account: FinancialBusinessUnitIdentityDTO = undefined;

  public passport: PassportIdentityDTO = undefined;

  public program: FinancialBusinessUnitIdentityDTO = undefined;

  private __passportProgramUpdateModelStrictDTO: string;

  public static toDTO(
    model: Partial<PassportProgramUpdateModelStrictDTO>
  ): IPassportProgramUpdateModelStrictDTO {
    return {
      account: model.account
        ? FinancialBusinessUnitIdentityDTO.toDTO(model.account.id)
        : undefined,
      passport: model.passport
        ? PassportIdentityDTO.toDTO(model.passport.id)
        : undefined,
      program: model.program
        ? FinancialBusinessUnitIdentityDTO.toDTO(model.program.id)
        : undefined
    };
  }

  public static fromDTO(
    dto: IPassportProgramUpdateModelStrictDTO
  ): PassportProgramUpdateModelStrictDTO {
    const result = new PassportProgramUpdateModelStrictDTO();

    result.account = dto.account
      ? new FinancialBusinessUnitIdentityDTO(dto.account.id)
      : undefined;
    result.passport = dto.passport
      ? new PassportIdentityDTO(dto.passport.id)
      : undefined;
    result.program = dto.program
      ? new FinancialBusinessUnitIdentityDTO(dto.program.id)
      : undefined;

    return result;
  }
}

export class PassportRagInfoModelRichDTO {
  public areas: string[] = undefined;

  public ragItems: RagReportItemModel[] = undefined;

  public projectManager: EmployeeSimpleDTO = undefined;

  public criticalStatus: RagStatus = undefined;

  public headCount: number = undefined;

  public isExpired: boolean = undefined;

  public isLdsProjectLinked: boolean = undefined;

  public ldsUpdatedDate: Date = undefined;

  public passportId: Guid = undefined;

  public passportName: string = undefined;

  public pmUpdatedDate: Date = undefined;

  public projectStatus: ProjectStatus = undefined;

  private __passportRagInfoModelRichDTO: string;

  public static toDTO(
    model: Partial<PassportRagInfoModelRichDTO>
  ): IPassportRagInfoModelRichDTO {
    return {
      areas: model.areas,
      ragItems: model.ragItems
        ? model.ragItems.map(x => RagReportItemModel.toDTO(x))
        : undefined,
      projectManager: model.projectManager
        ? EmployeeSimpleDTO.toDTO(model.projectManager)
        : undefined,
      criticalStatus: model.criticalStatus,
      headCount: model.headCount,
      isExpired: model.isExpired,
      isLdsProjectLinked: model.isLdsProjectLinked,
      ldsUpdatedDate: toDateOut(model.ldsUpdatedDate),
      passportId: model.passportId
        ? model.passportId.toString()
        : Guid.empty.toString(),
      passportName: model.passportName,
      pmUpdatedDate: toDateOut(model.pmUpdatedDate),
      projectStatus: model.projectStatus
    };
  }

  public static fromDTO(
    dto: IPassportRagInfoModelRichDTO
  ): PassportRagInfoModelRichDTO {
    const result = new PassportRagInfoModelRichDTO();

    result.areas = dto.areas;
    result.ragItems = dto.ragItems
      ? dto.ragItems.map(x => RagReportItemModel.fromDTO(x))
      : [];
    result.projectManager = dto.projectManager
      ? EmployeeSimpleDTO.fromDTO(dto.projectManager)
      : undefined;
    result.criticalStatus = dto.criticalStatus;
    result.headCount = dto.headCount;
    result.isExpired = dto.isExpired;
    result.isLdsProjectLinked = dto.isLdsProjectLinked;
    result.ldsUpdatedDate = toDateIn(dto.ldsUpdatedDate);
    result.passportId = new Guid(dto.passportId);
    result.passportName = dto.passportName;
    result.pmUpdatedDate = toDateIn(dto.pmUpdatedDate);
    result.projectStatus = dto.projectStatus;

    return result;
  }
}

export class PassportRoleDTO {
  public passportIdentity: PassportIdentityDTO = undefined;

  public roleIdentity: RoleIdentityDTO = undefined;

  private __passportRoleDTO: string;

  public static toDTO(model: Partial<PassportRoleDTO>): IPassportRoleDTO {
    return {
      passportIdentity: model.passportIdentity
        ? PassportIdentityDTO.toDTO(model.passportIdentity.id)
        : undefined,
      roleIdentity: model.roleIdentity
        ? RoleIdentityDTO.toDTO(model.roleIdentity.id)
        : undefined
    };
  }

  public static fromDTO(dto: IPassportRoleDTO): PassportRoleDTO {
    const result = new PassportRoleDTO();

    result.passportIdentity = dto.passportIdentity
      ? new PassportIdentityDTO(dto.passportIdentity.id)
      : undefined;
    result.roleIdentity = dto.roleIdentity
      ? new RoleIdentityDTO(dto.roleIdentity.id)
      : undefined;

    return result;
  }
}

export class PassportSearchModelStrictDTO {
  public filter: PassportFilterModelStrictDTO = undefined;

  public query: string = undefined;

  public skip: number = undefined;

  public take: number = undefined;

  private __passportSearchModelStrictDTO: string;

  public static toDTO(
    model: Partial<PassportSearchModelStrictDTO>
  ): IPassportSearchModelStrictDTO {
    return {
      filter: model.filter
        ? PassportFilterModelStrictDTO.toDTO(model.filter)
        : undefined,
      query: model.query,
      skip: model.skip,
      take: model.take
    };
  }

  public static fromDTO(
    dto: IPassportSearchModelStrictDTO
  ): PassportSearchModelStrictDTO {
    const result = new PassportSearchModelStrictDTO();

    result.filter = dto.filter
      ? PassportFilterModelStrictDTO.fromDTO(dto.filter)
      : undefined;
    result.query = dto.query;
    result.skip = dto.skip;
    result.take = dto.take;

    return result;
  }
}

export class PassportSkillsProjectionDTO {
  public project: ProjectSkillsProjectionDTO = undefined;

  public id: Guid = undefined;

  private __passportSkillsProjectionDTO: string;

  public static toDTO(
    model: Partial<PassportSkillsProjectionDTO>
  ): IPassportSkillsProjectionDTO {
    return {
      project: model.project
        ? ProjectSkillsProjectionDTO.toDTO(model.project)
        : undefined,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IPassportSkillsProjectionDTO
  ): PassportSkillsProjectionDTO {
    const result = new PassportSkillsProjectionDTO();

    result.project = dto.project
      ? ProjectSkillsProjectionDTO.fromDTO(dto.project)
      : undefined;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class PassportStatusesDashboardModelSimpleDTO {
  public count: number = undefined;

  public status: PassportStatus = undefined;

  private __passportStatusesDashboardModelSimpleDTO: string;

  public static toDTO(
    model: Partial<PassportStatusesDashboardModelSimpleDTO>
  ): IPassportStatusesDashboardModelSimpleDTO {
    return {
      count: model.count,
      status: model.status
    };
  }

  public static fromDTO(
    dto: IPassportStatusesDashboardModelSimpleDTO
  ): PassportStatusesDashboardModelSimpleDTO {
    const result = new PassportStatusesDashboardModelSimpleDTO();

    result.count = dto.count;
    result.status = dto.status;

    return result;
  }
}

export class PassportUpdateModelStrictDto {
  public closeDate: OptionalNullableDateTime = undefined;

  public engagementModel: OptionalEngagementModelIdentityDTO = undefined;

  public passport: PassportIdentityDTO = undefined;

  public pricingModel: OptionalNullablePricingModel = undefined;

  public projectGoals: OptionalString = undefined;

  public pmProjectComplexity: OptionalProjectComplexity = undefined;

  public projectStatus: OptionalProjectStatus = undefined;

  public startDate: OptionalDateTime = undefined;

  public mainActivities: OptionalActivityIdentityDTOArray = undefined;

  public qualityApproaches: OptionalQualityApproachIdentityDTOArray = undefined;

  public methodologies: OptionalMethodologyIdentityDTOArray = undefined;

  public skills: OptionalSkillIdentityDTOArray = undefined;

  public customerProjectManager: OptionalString = undefined;

  public projectManager: OptionalEmployeeIdentityDTO = undefined;

  public programManager: OptionalEmployeeIdentityDTO = undefined;

  public accountManager: OptionalEmployeeIdentityDTO = undefined;

  public ldsProjectId: OptionalNullableGuid = undefined;

  public deliveryMaturityConsultant: OptionalEmployeeIdentityDTO = undefined;

  public functionalSafety: OptionalNullableFunctionalSafety = undefined;

  public functionalSafetyManager: OptionalEmployeeIdentityDTO = undefined;

  public seProjects: OptionalSeProjectIdentityDTOArray = undefined;

  public projectName: OptionalString = undefined;

  private __passportUpdateModelStrictDto: string;

  public static toDTO(
    model: Partial<PassportUpdateModelStrictDto>
  ): IPassportUpdateModelStrictDto {
    return {
      closeDate: model.closeDate
        ? OptionalNullableDateTime.toDTO(model.closeDate)
        : undefined,
      engagementModel: model.engagementModel
        ? OptionalEngagementModelIdentityDTO.toDTO(model.engagementModel)
        : undefined,
      passport: model.passport
        ? PassportIdentityDTO.toDTO(model.passport.id)
        : undefined,
      pricingModel: model.pricingModel
        ? OptionalNullablePricingModel.toDTO(model.pricingModel)
        : undefined,
      projectGoals: model.projectGoals
        ? OptionalString.toDTO(model.projectGoals)
        : undefined,
      pmProjectComplexity: model.pmProjectComplexity
        ? OptionalProjectComplexity.toDTO(model.pmProjectComplexity)
        : undefined,
      projectStatus: model.projectStatus
        ? OptionalProjectStatus.toDTO(model.projectStatus)
        : undefined,
      startDate: model.startDate
        ? OptionalDateTime.toDTO(model.startDate)
        : undefined,
      mainActivities: model.mainActivities
        ? OptionalActivityIdentityDTOArray.toDTO(model.mainActivities)
        : undefined,
      qualityApproaches: model.qualityApproaches
        ? OptionalQualityApproachIdentityDTOArray.toDTO(model.qualityApproaches)
        : undefined,
      methodologies: model.methodologies
        ? OptionalMethodologyIdentityDTOArray.toDTO(model.methodologies)
        : undefined,
      skills: model.skills
        ? OptionalSkillIdentityDTOArray.toDTO(model.skills)
        : undefined,
      customerProjectManager: model.customerProjectManager
        ? OptionalString.toDTO(model.customerProjectManager)
        : undefined,
      projectManager: model.projectManager
        ? OptionalEmployeeIdentityDTO.toDTO(model.projectManager)
        : undefined,
      programManager: model.programManager
        ? OptionalEmployeeIdentityDTO.toDTO(model.programManager)
        : undefined,
      accountManager: model.accountManager
        ? OptionalEmployeeIdentityDTO.toDTO(model.accountManager)
        : undefined,
      ldsProjectId: model.ldsProjectId
        ? OptionalNullableGuid.toDTO(model.ldsProjectId)
        : undefined,
      deliveryMaturityConsultant: model.deliveryMaturityConsultant
        ? OptionalEmployeeIdentityDTO.toDTO(model.deliveryMaturityConsultant)
        : undefined,
      functionalSafety: model.functionalSafety
        ? OptionalNullableFunctionalSafety.toDTO(model.functionalSafety)
        : undefined,
      functionalSafetyManager: model.functionalSafetyManager
        ? OptionalEmployeeIdentityDTO.toDTO(model.functionalSafetyManager)
        : undefined,
      seProjects: model.seProjects
        ? OptionalSeProjectIdentityDTOArray.toDTO(model.seProjects)
        : undefined,
      projectName: model.projectName
        ? OptionalString.toDTO(model.projectName)
        : undefined
    };
  }

  public static fromDTO(
    dto: IPassportUpdateModelStrictDto
  ): PassportUpdateModelStrictDto {
    const result = new PassportUpdateModelStrictDto();

    result.closeDate = dto.closeDate
      ? OptionalNullableDateTime.fromDTO(dto.closeDate)
      : undefined;
    result.engagementModel = dto.engagementModel
      ? OptionalEngagementModelIdentityDTO.fromDTO(dto.engagementModel)
      : undefined;
    result.passport = dto.passport
      ? new PassportIdentityDTO(dto.passport.id)
      : undefined;
    result.pricingModel = dto.pricingModel
      ? OptionalNullablePricingModel.fromDTO(dto.pricingModel)
      : undefined;
    result.projectGoals = dto.projectGoals
      ? OptionalString.fromDTO(dto.projectGoals)
      : undefined;
    result.pmProjectComplexity = dto.pmProjectComplexity
      ? OptionalProjectComplexity.fromDTO(dto.pmProjectComplexity)
      : undefined;
    result.projectStatus = dto.projectStatus
      ? OptionalProjectStatus.fromDTO(dto.projectStatus)
      : undefined;
    result.startDate = dto.startDate
      ? OptionalDateTime.fromDTO(dto.startDate)
      : undefined;
    result.mainActivities = dto.mainActivities
      ? OptionalActivityIdentityDTOArray.fromDTO(dto.mainActivities)
      : undefined;
    result.qualityApproaches = dto.qualityApproaches
      ? OptionalQualityApproachIdentityDTOArray.fromDTO(dto.qualityApproaches)
      : undefined;
    result.methodologies = dto.methodologies
      ? OptionalMethodologyIdentityDTOArray.fromDTO(dto.methodologies)
      : undefined;
    result.skills = dto.skills
      ? OptionalSkillIdentityDTOArray.fromDTO(dto.skills)
      : undefined;
    result.customerProjectManager = dto.customerProjectManager
      ? OptionalString.fromDTO(dto.customerProjectManager)
      : undefined;
    result.projectManager = dto.projectManager
      ? OptionalEmployeeIdentityDTO.fromDTO(dto.projectManager)
      : undefined;
    result.programManager = dto.programManager
      ? OptionalEmployeeIdentityDTO.fromDTO(dto.programManager)
      : undefined;
    result.accountManager = dto.accountManager
      ? OptionalEmployeeIdentityDTO.fromDTO(dto.accountManager)
      : undefined;
    result.ldsProjectId = dto.ldsProjectId
      ? OptionalNullableGuid.fromDTO(dto.ldsProjectId)
      : undefined;
    result.deliveryMaturityConsultant = dto.deliveryMaturityConsultant
      ? OptionalEmployeeIdentityDTO.fromDTO(dto.deliveryMaturityConsultant)
      : undefined;
    result.functionalSafety = dto.functionalSafety
      ? OptionalNullableFunctionalSafety.fromDTO(dto.functionalSafety)
      : undefined;
    result.functionalSafetyManager = dto.functionalSafetyManager
      ? OptionalEmployeeIdentityDTO.fromDTO(dto.functionalSafetyManager)
      : undefined;
    result.seProjects = dto.seProjects
      ? OptionalSeProjectIdentityDTOArray.fromDTO(dto.seProjects)
      : undefined;
    result.projectName = dto.projectName
      ? OptionalString.fromDTO(dto.projectName)
      : undefined;

    return result;
  }
}

export class PeriodFilterModelStrictDTO {
  public from: Date = undefined;

  public to: Date = undefined;

  private __periodFilterModelStrictDTO: string;

  public static toDTO(
    model: Partial<PeriodFilterModelStrictDTO>
  ): IPeriodFilterModelStrictDTO {
    return {
      from: toDateOut(model.from),
      to: toDateOut(model.to)
    };
  }

  public static fromDTO(
    dto: IPeriodFilterModelStrictDTO
  ): PeriodFilterModelStrictDTO {
    const result = new PeriodFilterModelStrictDTO();

    result.from = toDateIn(dto.from);
    result.to = toDateIn(dto.to);

    return result;
  }
}

export class ProjectOverviewProjectionDTO {
  public account: FbuProjectionDTO = undefined;

  public calculatedComplexity: ProjectComplexity = undefined;

  public categorizationId: Guid = undefined;

  public closeDate: Date = undefined;

  public code: string = undefined;

  public engagementModel: PassportOverviewEngagementModelProjectionDTO = undefined;

  public functionalSafety: FunctionalSafety = undefined;

  public functionalSafetyManager: FunctionalSafetyEmployeeProjectionDTO = undefined;

  public goals: string = undefined;

  public isAlobProgram: boolean = undefined;

  public isCategorizationCompleted: boolean = undefined;

  public isInternalProject: boolean = undefined;

  public mainActivities: PassportOverviewActivityProjectionDTO[] = undefined;

  public methodologies: PassportOverviewMethodologyProjectionDTO[] = undefined;

  public name: string = undefined;

  public pmComplexity: ProjectComplexity = undefined;

  public pricingModel: PricingModel = undefined;

  public program: FbuProjectionDTO = undefined;

  public programHorizontalName: string = undefined;

  public qualityApproaches: PassportOverviewQualityApproachProjectionDTO[] = undefined;

  public startDate: Date = undefined;

  public status: ProjectStatus = undefined;

  public id: Guid = undefined;

  private __projectOverviewProjectionDTO: string;

  public static toDTO(
    model: Partial<ProjectOverviewProjectionDTO>
  ): IProjectOverviewProjectionDTO {
    return {
      account: model.account
        ? FbuProjectionDTO.toDTO(model.account)
        : undefined,
      calculatedComplexity: model.calculatedComplexity,
      categorizationId: model.categorizationId
        ? model.categorizationId.toString()
        : undefined,
      closeDate: toDateOut(model.closeDate),
      code: model.code,
      engagementModel: model.engagementModel
        ? PassportOverviewEngagementModelProjectionDTO.toDTO(
            model.engagementModel
          )
        : undefined,
      functionalSafety: model.functionalSafety,
      functionalSafetyManager: model.functionalSafetyManager
        ? FunctionalSafetyEmployeeProjectionDTO.toDTO(
            model.functionalSafetyManager
          )
        : undefined,
      goals: model.goals,
      isAlobProgram: model.isAlobProgram,
      isCategorizationCompleted: model.isCategorizationCompleted,
      isInternalProject: model.isInternalProject,
      mainActivities: model.mainActivities
        ? model.mainActivities.map(x =>
            PassportOverviewActivityProjectionDTO.toDTO(x)
          )
        : undefined,
      methodologies: model.methodologies
        ? model.methodologies.map(x =>
            PassportOverviewMethodologyProjectionDTO.toDTO(x)
          )
        : undefined,
      name: model.name,
      pmComplexity: model.pmComplexity,
      pricingModel: model.pricingModel,
      program: model.program
        ? FbuProjectionDTO.toDTO(model.program)
        : undefined,
      programHorizontalName: model.programHorizontalName,
      qualityApproaches: model.qualityApproaches
        ? model.qualityApproaches.map(x =>
            PassportOverviewQualityApproachProjectionDTO.toDTO(x)
          )
        : undefined,
      startDate: toDateOut(model.startDate),
      status: model.status,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IProjectOverviewProjectionDTO
  ): ProjectOverviewProjectionDTO {
    const result = new ProjectOverviewProjectionDTO();

    result.account = dto.account
      ? FbuProjectionDTO.fromDTO(dto.account)
      : undefined;
    result.calculatedComplexity = dto.calculatedComplexity;
    result.categorizationId = dto.categorizationId
      ? new Guid(dto.categorizationId)
      : undefined;
    result.closeDate = toDateIn(dto.closeDate);
    result.code = dto.code;
    result.engagementModel = dto.engagementModel
      ? PassportOverviewEngagementModelProjectionDTO.fromDTO(
          dto.engagementModel
        )
      : undefined;
    result.functionalSafety = dto.functionalSafety;
    result.functionalSafetyManager = dto.functionalSafetyManager
      ? FunctionalSafetyEmployeeProjectionDTO.fromDTO(
          dto.functionalSafetyManager
        )
      : undefined;
    result.goals = dto.goals;
    result.isAlobProgram = dto.isAlobProgram;
    result.isCategorizationCompleted = dto.isCategorizationCompleted;
    result.isInternalProject = dto.isInternalProject;
    result.mainActivities = dto.mainActivities
      ? dto.mainActivities.map(x =>
          PassportOverviewActivityProjectionDTO.fromDTO(x)
        )
      : [];
    result.methodologies = dto.methodologies
      ? dto.methodologies.map(x =>
          PassportOverviewMethodologyProjectionDTO.fromDTO(x)
        )
      : [];
    result.name = dto.name;
    result.pmComplexity = dto.pmComplexity;
    result.pricingModel = dto.pricingModel;
    result.program = dto.program
      ? FbuProjectionDTO.fromDTO(dto.program)
      : undefined;
    result.programHorizontalName = dto.programHorizontalName;
    result.qualityApproaches = dto.qualityApproaches
      ? dto.qualityApproaches.map(x =>
          PassportOverviewQualityApproachProjectionDTO.fromDTO(x)
        )
      : [];
    result.startDate = toDateIn(dto.startDate);
    result.status = dto.status;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class ProjectSkillProjectionDTO {
  public skillId: Guid = undefined;

  public skillName: string = undefined;

  public id: Guid = undefined;

  private __projectSkillProjectionDTO: string;

  public static toDTO(
    model: Partial<ProjectSkillProjectionDTO>
  ): IProjectSkillProjectionDTO {
    return {
      skillId: model.skillId ? model.skillId.toString() : undefined,
      skillName: model.skillName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IProjectSkillProjectionDTO
  ): ProjectSkillProjectionDTO {
    const result = new ProjectSkillProjectionDTO();

    result.skillId = dto.skillId ? new Guid(dto.skillId) : undefined;
    result.skillName = dto.skillName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class ProjectSkillsProjectionDTO {
  public skills: ProjectSkillProjectionDTO[] = undefined;

  public id: Guid = undefined;

  private __projectSkillsProjectionDTO: string;

  public static toDTO(
    model: Partial<ProjectSkillsProjectionDTO>
  ): IProjectSkillsProjectionDTO {
    return {
      skills: model.skills
        ? model.skills.map(x => ProjectSkillProjectionDTO.toDTO(x))
        : undefined,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: IProjectSkillsProjectionDTO
  ): ProjectSkillsProjectionDTO {
    const result = new ProjectSkillsProjectionDTO();

    result.skills = dto.skills
      ? dto.skills.map(x => ProjectSkillProjectionDTO.fromDTO(x))
      : [];
    result.id = new Guid(dto.id);

    return result;
  }
}

export class QualityApproachFilterStrictDTO {
  private __qualityApproachFilterStrictDTO: string;

  public static toDTO(
    model: Partial<QualityApproachFilterStrictDTO>
  ): IQualityApproachFilterStrictDTO {
    return {};
  }

  public static fromDTO(
    dto: IQualityApproachFilterStrictDTO
  ): QualityApproachFilterStrictDTO {
    const result = new QualityApproachFilterStrictDTO();

    return result;
  }
}

export class QualityApproachIdentityDTO {
  public id: Guid = undefined;

  private __qualityApproachIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IQualityApproachIdentityDTO {
    return { id: id.toString() };
  }
}

export class QuestionAreaRateModelSimpleDTO {
  public name: string = undefined;

  public rate: number = undefined;

  private __questionAreaRateModelSimpleDTO: string;

  public static toDTO(
    model: Partial<QuestionAreaRateModelSimpleDTO>
  ): IQuestionAreaRateModelSimpleDTO {
    return {
      name: model.name,
      rate: model.rate
    };
  }

  public static fromDTO(
    dto: IQuestionAreaRateModelSimpleDTO
  ): QuestionAreaRateModelSimpleDTO {
    const result = new QuestionAreaRateModelSimpleDTO();

    result.name = dto.name;
    result.rate = dto.rate;

    return result;
  }
}

export class RagReportItemModel {
  public area: string = undefined;

  public status: RagStatus = undefined;

  public comment: string = undefined;

  private __ragReportItemModel: string;

  public static toDTO(model: Partial<RagReportItemModel>): IRagReportItemModel {
    return {
      area: model.area,
      status: model.status,
      comment: model.comment
    };
  }

  public static fromDTO(dto: IRagReportItemModel): RagReportItemModel {
    const result = new RagReportItemModel();

    result.area = dto.area;
    result.status = dto.status;
    result.comment = dto.comment;

    return result;
  }
}

export class RagReportModel {
  public date: Date = undefined;

  public isActual: boolean = undefined;

  public items: RagReportItemModel[] = undefined;

  private __ragReportModel: string;

  public static toDTO(model: Partial<RagReportModel>): IRagReportModel {
    return {
      date: toDateOut(model.date),
      isActual: model.isActual,
      items: model.items
        ? model.items.map(x => RagReportItemModel.toDTO(x))
        : undefined
    };
  }

  public static fromDTO(dto: IRagReportModel): RagReportModel {
    const result = new RagReportModel();

    result.date = toDateIn(dto.date);
    result.isActual = dto.isActual;
    result.items = dto.items
      ? dto.items.map(x => RagReportItemModel.fromDTO(x))
      : [];

    return result;
  }
}

export class RagSummaryModelRichDTO {
  public areas: string[] = undefined;

  public reports: RagReportModel[] = undefined;

  public actualReporter: string = undefined;

  public criticalStatus: RagStatus = undefined;

  public isExpired: boolean = undefined;

  public pmLastReportDate: Date = undefined;

  private __ragSummaryModelRichDTO: string;

  public static toDTO(
    model: Partial<RagSummaryModelRichDTO>
  ): IRagSummaryModelRichDTO {
    return {
      areas: model.areas,
      reports: model.reports
        ? model.reports.map(x => RagReportModel.toDTO(x))
        : undefined,
      actualReporter: model.actualReporter,
      criticalStatus: model.criticalStatus,
      isExpired: model.isExpired,
      pmLastReportDate: toDateOut(model.pmLastReportDate)
    };
  }

  public static fromDTO(dto: IRagSummaryModelRichDTO): RagSummaryModelRichDTO {
    const result = new RagSummaryModelRichDTO();

    result.areas = dto.areas;
    result.reports = dto.reports
      ? dto.reports.map(x => RagReportModel.fromDTO(x))
      : [];
    result.actualReporter = dto.actualReporter;
    result.criticalStatus = dto.criticalStatus;
    result.isExpired = dto.isExpired;
    result.pmLastReportDate = toDateIn(dto.pmLastReportDate);

    return result;
  }
}

export class RoleIdentityDTO {
  public id: Guid = undefined;

  private __roleIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): IRoleIdentityDTO {
    return { id: id.toString() };
  }
}

export class RoleModelRichDTO {
  public count: number = undefined;

  public id: Guid = undefined;

  public name: string = undefined;

  private __roleModelRichDTO: string;

  public static toDTO(model: Partial<RoleModelRichDTO>): IRoleModelRichDTO {
    return {
      count: model.count,
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name
    };
  }

  public static fromDTO(dto: IRoleModelRichDTO): RoleModelRichDTO {
    const result = new RoleModelRichDTO();

    result.count = dto.count;
    result.id = new Guid(dto.id);
    result.name = dto.name;

    return result;
  }
}

export class SearchActivityProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __searchActivityProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchActivityProjectionDTO>
  ): ISearchActivityProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchActivityProjectionDTO
  ): SearchActivityProjectionDTO {
    const result = new SearchActivityProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchEmployeeProjectionDTO {
  public businessUnit: string = undefined;

  public fullName: string = undefined;

  public id: Guid = undefined;

  private __searchEmployeeProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchEmployeeProjectionDTO>
  ): ISearchEmployeeProjectionDTO {
    return {
      businessUnit: model.businessUnit,
      fullName: model.fullName,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchEmployeeProjectionDTO
  ): SearchEmployeeProjectionDTO {
    const result = new SearchEmployeeProjectionDTO();

    result.businessUnit = dto.businessUnit;
    result.fullName = dto.fullName;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchEngagementModelProjectionDTO {
  public name: string = undefined;

  public pricingModels: PricingModel[] = undefined;

  public id: Guid = undefined;

  private __searchEngagementModelProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchEngagementModelProjectionDTO>
  ): ISearchEngagementModelProjectionDTO {
    return {
      name: model.name,
      pricingModels: model.pricingModels,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchEngagementModelProjectionDTO
  ): SearchEngagementModelProjectionDTO {
    const result = new SearchEngagementModelProjectionDTO();

    result.name = dto.name;
    result.pricingModels = dto.pricingModels;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchFbuProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __searchFbuProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchFbuProjectionDTO>
  ): ISearchFbuProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(dto: ISearchFbuProjectionDTO): SearchFbuProjectionDTO {
    const result = new SearchFbuProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchMethodologyProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __searchMethodologyProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchMethodologyProjectionDTO>
  ): ISearchMethodologyProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchMethodologyProjectionDTO
  ): SearchMethodologyProjectionDTO {
    const result = new SearchMethodologyProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchQualityApproachProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __searchQualityApproachProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchQualityApproachProjectionDTO>
  ): ISearchQualityApproachProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchQualityApproachProjectionDTO
  ): SearchQualityApproachProjectionDTO {
    const result = new SearchQualityApproachProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchSeProjectProjectionDTO {
  public headCount: number = undefined;

  public name: string = undefined;

  public plannedEndDate: Date = undefined;

  public id: Guid = undefined;

  private __searchSeProjectProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchSeProjectProjectionDTO>
  ): ISearchSeProjectProjectionDTO {
    return {
      headCount: model.headCount,
      name: model.name,
      plannedEndDate: toDateOut(model.plannedEndDate),
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchSeProjectProjectionDTO
  ): SearchSeProjectProjectionDTO {
    const result = new SearchSeProjectProjectionDTO();

    result.headCount = dto.headCount;
    result.name = dto.name;
    result.plannedEndDate = toDateIn(dto.plannedEndDate);
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchSkillProjectionDTO {
  public name: string = undefined;

  public id: Guid = undefined;

  private __searchSkillProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchSkillProjectionDTO>
  ): ISearchSkillProjectionDTO {
    return {
      name: model.name,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchSkillProjectionDTO
  ): SearchSkillProjectionDTO {
    const result = new SearchSkillProjectionDTO();

    result.name = dto.name;
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SearchTierReportProjectionDTO {
  public reviewDate: Date = undefined;

  public id: Guid = undefined;

  private __searchTierReportProjectionDTO: string;

  public static toDTO(
    model: Partial<SearchTierReportProjectionDTO>
  ): ISearchTierReportProjectionDTO {
    return {
      reviewDate: toDateOut(model.reviewDate),
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ISearchTierReportProjectionDTO
  ): SearchTierReportProjectionDTO {
    const result = new SearchTierReportProjectionDTO();

    result.reviewDate = toDateIn(dto.reviewDate);
    result.id = new Guid(dto.id);

    return result;
  }
}

export class SeProjectFilterStrictDTO {
  public name: string = undefined;

  public passport: PassportIdentityDTO = undefined;

  public skip: number = undefined;

  public take: number = undefined;

  private __seProjectFilterStrictDTO: string;

  public static toDTO(
    model: Partial<SeProjectFilterStrictDTO>
  ): ISeProjectFilterStrictDTO {
    return {
      name: model.name,
      passport: model.passport
        ? PassportIdentityDTO.toDTO(model.passport.id)
        : undefined,
      skip: model.skip,
      take: model.take
    };
  }

  public static fromDTO(
    dto: ISeProjectFilterStrictDTO
  ): SeProjectFilterStrictDTO {
    const result = new SeProjectFilterStrictDTO();

    result.name = dto.name;
    result.passport = dto.passport
      ? new PassportIdentityDTO(dto.passport.id)
      : undefined;
    result.skip = dto.skip;
    result.take = dto.take;

    return result;
  }
}

export class SeProjectIdentityDTO {
  public id: Guid = undefined;

  private __seProjectIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ISeProjectIdentityDTO {
    return { id: id.toString() };
  }
}

export class SkillFilterStrictDTO {
  public name: string = undefined;

  private __skillFilterStrictDTO: string;

  public static toDTO(
    model: Partial<SkillFilterStrictDTO>
  ): ISkillFilterStrictDTO {
    return {
      name: model.name
    };
  }

  public static fromDTO(dto: ISkillFilterStrictDTO): SkillFilterStrictDTO {
    const result = new SkillFilterStrictDTO();

    result.name = dto.name;

    return result;
  }
}

export class SkillIdentityDTO {
  public id: Guid = undefined;

  private __skillIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ISkillIdentityDTO {
    return { id: id.toString() };
  }
}

export class SkillUsageModelSimpleDTO {
  public count: number = undefined;

  public id: Guid = undefined;

  public name: string = undefined;

  private __skillUsageModelSimpleDTO: string;

  public static toDTO(
    model: Partial<SkillUsageModelSimpleDTO>
  ): ISkillUsageModelSimpleDTO {
    return {
      count: model.count,
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name
    };
  }

  public static fromDTO(
    dto: ISkillUsageModelSimpleDTO
  ): SkillUsageModelSimpleDTO {
    const result = new SkillUsageModelSimpleDTO();

    result.count = dto.count;
    result.id = new Guid(dto.id);
    result.name = dto.name;

    return result;
  }
}

export class StatisticsDataDto {
  public category: string = undefined;

  public eventDate: Date = undefined;

  public eventName: string = undefined;

  public jsonEventData: string = undefined;

  private __statisticsDataDto: string;

  public static toDTO(model: Partial<StatisticsDataDto>): IStatisticsDataDto {
    return {
      category: model.category,
      eventDate: toDateOut(model.eventDate),
      eventName: model.eventName,
      jsonEventData: model.jsonEventData
    };
  }

  public static fromDTO(dto: IStatisticsDataDto): StatisticsDataDto {
    const result = new StatisticsDataDto();

    result.category = dto.category;
    result.eventDate = toDateIn(dto.eventDate);
    result.eventName = dto.eventName;
    result.jsonEventData = dto.jsonEventData;

    return result;
  }
}

export class TaskDashboardModelRichDTO {
  public myTasks: EmployeeTaskDashboardModelRichDTO[] = undefined;

  public teamTasks: TeamTaskDashboardModelRichDTO[] = undefined;

  private __taskDashboardModelRichDTO: string;

  public static toDTO(
    model: Partial<TaskDashboardModelRichDTO>
  ): ITaskDashboardModelRichDTO {
    return {
      myTasks: model.myTasks
        ? model.myTasks.map(x => EmployeeTaskDashboardModelRichDTO.toDTO(x))
        : undefined,
      teamTasks: model.teamTasks
        ? model.teamTasks.map(x => TeamTaskDashboardModelRichDTO.toDTO(x))
        : undefined
    };
  }

  public static fromDTO(
    dto: ITaskDashboardModelRichDTO
  ): TaskDashboardModelRichDTO {
    const result = new TaskDashboardModelRichDTO();

    result.myTasks = dto.myTasks
      ? dto.myTasks.map(x => EmployeeTaskDashboardModelRichDTO.fromDTO(x))
      : [];
    result.teamTasks = dto.teamTasks
      ? dto.teamTasks.map(x => TeamTaskDashboardModelRichDTO.fromDTO(x))
      : [];

    return result;
  }
}

export class TaskExecuteModelStrictDTO {
  public commandType: CommandType = undefined;

  public comment: string = undefined;

  public task: TaskIdentityDTO = undefined;

  private __taskExecuteModelStrictDTO: string;

  public static toDTO(
    model: Partial<TaskExecuteModelStrictDTO>
  ): ITaskExecuteModelStrictDTO {
    return {
      commandType: model.commandType,
      comment: model.comment,
      task: model.task ? TaskIdentityDTO.toDTO(model.task.id) : undefined
    };
  }

  public static fromDTO(
    dto: ITaskExecuteModelStrictDTO
  ): TaskExecuteModelStrictDTO {
    const result = new TaskExecuteModelStrictDTO();

    result.commandType = dto.commandType;
    result.comment = dto.comment;
    result.task = dto.task ? new TaskIdentityDTO(dto.task.id) : undefined;

    return result;
  }
}

export class TaskIdentityDTO {
  public id: Guid = undefined;

  private __taskIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ITaskIdentityDTO {
    return { id: id.toString() };
  }
}

export class TaskModel {
  public id: Guid = undefined;

  public type: TaskType = undefined;

  public name: string = undefined;

  public assignee: EmployeeModel = undefined;

  public startDate: Date = undefined;

  public dueDate: Date = undefined;

  public comment: string = undefined;

  public previousTaskComment: string = undefined;

  public previousTaskAssignee: EmployeeModel = undefined;

  public previousTaskEndDate: Date = undefined;

  public commands: CommandModel[] = undefined;

  private __taskModel: string;

  public static toDTO(model: Partial<TaskModel>): ITaskModel {
    return {
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      type: model.type,
      name: model.name,
      assignee: model.assignee
        ? EmployeeModel.toDTO(model.assignee)
        : undefined,
      startDate: toDateOut(model.startDate),
      dueDate: toDateOut(model.dueDate),
      comment: model.comment,
      previousTaskComment: model.previousTaskComment,
      previousTaskAssignee: model.previousTaskAssignee
        ? EmployeeModel.toDTO(model.previousTaskAssignee)
        : undefined,
      previousTaskEndDate: toDateOut(model.previousTaskEndDate),
      commands: model.commands
        ? model.commands.map(x => CommandModel.toDTO(x))
        : undefined
    };
  }

  public static fromDTO(dto: ITaskModel): TaskModel {
    const result = new TaskModel();

    result.id = new Guid(dto.id);
    result.type = dto.type;
    result.name = dto.name;
    result.assignee = dto.assignee
      ? EmployeeModel.fromDTO(dto.assignee)
      : undefined;
    result.startDate = toDateIn(dto.startDate);
    result.dueDate = toDateIn(dto.dueDate);
    result.comment = dto.comment;
    result.previousTaskComment = dto.previousTaskComment;
    result.previousTaskAssignee = dto.previousTaskAssignee
      ? EmployeeModel.fromDTO(dto.previousTaskAssignee)
      : undefined;
    result.previousTaskEndDate = toDateIn(dto.previousTaskEndDate);
    result.commands = dto.commands
      ? dto.commands.map(x => CommandModel.fromDTO(x))
      : [];

    return result;
  }
}

export class TeamModelRichDTO {
  public locations: LocationModelRichDTO[] = undefined;

  public roles: RoleModelRichDTO[] = undefined;

  public workload: WorkloadModelSimpleDTO = undefined;

  public currentHeadCount: number = undefined;

  public hasClosedSeProject: boolean = undefined;

  public maxHeadCount: number = undefined;

  public maxHeadCountDate: Date = undefined;

  public seProjectCount: number = undefined;

  private __teamModelRichDTO: string;

  public static toDTO(model: Partial<TeamModelRichDTO>): ITeamModelRichDTO {
    return {
      locations: model.locations
        ? model.locations.map(x => LocationModelRichDTO.toDTO(x))
        : undefined,
      roles: model.roles
        ? model.roles.map(x => RoleModelRichDTO.toDTO(x))
        : undefined,
      workload: model.workload
        ? WorkloadModelSimpleDTO.toDTO(model.workload)
        : undefined,
      currentHeadCount: model.currentHeadCount,
      hasClosedSeProject: model.hasClosedSeProject,
      maxHeadCount: model.maxHeadCount,
      maxHeadCountDate: toDateOut(model.maxHeadCountDate),
      seProjectCount: model.seProjectCount
    };
  }

  public static fromDTO(dto: ITeamModelRichDTO): TeamModelRichDTO {
    const result = new TeamModelRichDTO();

    result.locations = dto.locations
      ? dto.locations.map(x => LocationModelRichDTO.fromDTO(x))
      : [];
    result.roles = dto.roles
      ? dto.roles.map(x => RoleModelRichDTO.fromDTO(x))
      : [];
    result.workload = dto.workload
      ? WorkloadModelSimpleDTO.fromDTO(dto.workload)
      : undefined;
    result.currentHeadCount = dto.currentHeadCount;
    result.hasClosedSeProject = dto.hasClosedSeProject;
    result.maxHeadCount = dto.maxHeadCount;
    result.maxHeadCountDate = toDateIn(dto.maxHeadCountDate);
    result.seProjectCount = dto.seProjectCount;

    return result;
  }
}

export class TeamSizeFilterModelStrictDTO {
  public max: number = undefined;

  public min: number = undefined;

  private __teamSizeFilterModelStrictDTO: string;

  public static toDTO(
    model: Partial<TeamSizeFilterModelStrictDTO>
  ): ITeamSizeFilterModelStrictDTO {
    return {
      max: model.max,
      min: model.min
    };
  }

  public static fromDTO(
    dto: ITeamSizeFilterModelStrictDTO
  ): TeamSizeFilterModelStrictDTO {
    const result = new TeamSizeFilterModelStrictDTO();

    result.max = dto.max;
    result.min = dto.min;

    return result;
  }
}

export class TeamTaskDashboardModelRichDTO {
  public tasks: EmployeeTaskDashboardModelRichDTO[] = undefined;

  public assignee: VisualObjectModelSimpleDTO = undefined;

  public count: number = undefined;

  public overdue: number = undefined;

  private __teamTaskDashboardModelRichDTO: string;

  public static toDTO(
    model: Partial<TeamTaskDashboardModelRichDTO>
  ): ITeamTaskDashboardModelRichDTO {
    return {
      tasks: model.tasks
        ? model.tasks.map(x => EmployeeTaskDashboardModelRichDTO.toDTO(x))
        : undefined,
      assignee: model.assignee
        ? VisualObjectModelSimpleDTO.toDTO(model.assignee)
        : undefined,
      count: model.count,
      overdue: model.overdue
    };
  }

  public static fromDTO(
    dto: ITeamTaskDashboardModelRichDTO
  ): TeamTaskDashboardModelRichDTO {
    const result = new TeamTaskDashboardModelRichDTO();

    result.tasks = dto.tasks
      ? dto.tasks.map(x => EmployeeTaskDashboardModelRichDTO.fromDTO(x))
      : [];
    result.assignee = dto.assignee
      ? VisualObjectModelSimpleDTO.fromDTO(dto.assignee)
      : undefined;
    result.count = dto.count;
    result.overdue = dto.overdue;

    return result;
  }
}

export class TierIndicatorModel {
  public name: string = undefined;

  public isGrowUp: boolean = undefined;

  private __tierIndicatorModel: string;

  public static toDTO(model: Partial<TierIndicatorModel>): ITierIndicatorModel {
    return {
      name: model.name,
      isGrowUp: model.isGrowUp
    };
  }

  public static fromDTO(dto: ITierIndicatorModel): TierIndicatorModel {
    const result = new TierIndicatorModel();

    result.name = dto.name;
    result.isGrowUp = dto.isGrowUp;

    return result;
  }
}

export class TierReportIdentityDTO {
  public id: Guid = undefined;

  private __tierReportIdentityDTO: string;

  constructor(id: Guid | string = null) {
    this.id = new Guid(id);
  }

  public static toDTO(id: Guid): ITierReportIdentityDTO {
    return { id: id.toString() };
  }
}

export class TierReportOverviewProjectionDTO {
  public comments: string = undefined;

  public expiryDate: Date = undefined;

  public forecast: TierForecast = undefined;

  public isExpired: boolean = undefined;

  public status: TierStatus = undefined;

  public tiers: TierStatusModel[] = undefined;

  public id: Guid = undefined;

  private __tierReportOverviewProjectionDTO: string;

  public static toDTO(
    model: Partial<TierReportOverviewProjectionDTO>
  ): ITierReportOverviewProjectionDTO {
    return {
      comments: model.comments,
      expiryDate: toDateOut(model.expiryDate),
      forecast: model.forecast,
      isExpired: model.isExpired,
      status: model.status,
      tiers: model.tiers
        ? model.tiers.map(x => TierStatusModel.toDTO(x))
        : undefined,
      id: model.id ? model.id.toString() : Guid.empty.toString()
    };
  }

  public static fromDTO(
    dto: ITierReportOverviewProjectionDTO
  ): TierReportOverviewProjectionDTO {
    const result = new TierReportOverviewProjectionDTO();

    result.comments = dto.comments;
    result.expiryDate = toDateIn(dto.expiryDate);
    result.forecast = dto.forecast;
    result.isExpired = dto.isExpired;
    result.status = dto.status;
    result.tiers = dto.tiers
      ? dto.tiers.map(x => TierStatusModel.fromDTO(x))
      : [];
    result.id = new Guid(dto.id);

    return result;
  }
}

export class TierStatusModel {
  public tier: TierStatus = undefined;

  public indicators: TierIndicatorModel[] = undefined;

  private __tierStatusModel: string;

  public static toDTO(model: Partial<TierStatusModel>): ITierStatusModel {
    return {
      tier: model.tier,
      indicators: model.indicators
        ? model.indicators.map(x => TierIndicatorModel.toDTO(x))
        : undefined
    };
  }

  public static fromDTO(dto: ITierStatusModel): TierStatusModel {
    const result = new TierStatusModel();

    result.tier = dto.tier;
    result.indicators = dto.indicators
      ? dto.indicators.map(x => TierIndicatorModel.fromDTO(x))
      : [];

    return result;
  }
}

export class VisualObjectModelRichDTO {
  public id: Guid = undefined;

  public name: string = undefined;

  private __visualObjectModelRichDTO: string;

  public static toDTO(
    model: Partial<VisualObjectModelRichDTO>
  ): IVisualObjectModelRichDTO {
    return {
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name
    };
  }

  public static fromDTO(
    dto: IVisualObjectModelRichDTO
  ): VisualObjectModelRichDTO {
    const result = new VisualObjectModelRichDTO();

    result.id = new Guid(dto.id);
    result.name = dto.name;

    return result;
  }
}

export class VisualObjectModelSimpleDTO {
  public id: Guid = undefined;

  public name: string = undefined;

  private __visualObjectModelSimpleDTO: string;

  public static toDTO(
    model: Partial<VisualObjectModelSimpleDTO>
  ): IVisualObjectModelSimpleDTO {
    return {
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name
    };
  }

  public static fromDTO(
    dto: IVisualObjectModelSimpleDTO
  ): VisualObjectModelSimpleDTO {
    const result = new VisualObjectModelSimpleDTO();

    result.id = new Guid(dto.id);
    result.name = dto.name;

    return result;
  }
}

export class WorkloadModelSimpleDTO {
  public greaterEighty: number = undefined;

  public lessOrEqualEighty: number = undefined;

  public lessOrEqualFifty: number = undefined;

  public undefined: number = undefined;

  private __workloadModelSimpleDTO: string;

  public static toDTO(
    model: Partial<WorkloadModelSimpleDTO>
  ): IWorkloadModelSimpleDTO {
    return {
      greaterEighty: model.greaterEighty,
      lessOrEqualEighty: model.lessOrEqualEighty,
      lessOrEqualFifty: model.lessOrEqualFifty,
      undefined: model.undefined
    };
  }

  public static fromDTO(dto: IWorkloadModelSimpleDTO): WorkloadModelSimpleDTO {
    const result = new WorkloadModelSimpleDTO();

    result.greaterEighty = dto.greaterEighty;
    result.lessOrEqualEighty = dto.lessOrEqualEighty;
    result.lessOrEqualFifty = dto.lessOrEqualFifty;
    result.undefined = dto.undefined;

    return result;
  }
}

// #endregion
// #region Interfaces
export interface IActivityFilterStrictDTO {}

export interface IActivityIdentityDTO {
  id: string;
}

export interface IAllocationModel {
  seProject: string;

  workloadPercent: number;

  endDate: string;
}

export interface ICaseStudyAttachmentFilterStrictDTO {
  caseStudy: ICaseStudyIdentityDTO;
}

export interface ICaseStudyAttachmentIdentityDTO {
  id: string;
}

export interface ICaseStudyAttachmentViewProjectionDTO {
  name: string;

  id: string;
}

export interface ICaseStudyIdentityDTO {
  id: string;
}

export interface ICaseStudyOverviewProjectionDTO {
  archSolution: ArchitectureSolution;

  archSolutionDescription: string;

  businessGoal: string;

  clientSegmentation: ClientSegmentation;

  customer: string;

  customerFeedback: string;

  customerLocation: string;

  customerRole: string;

  executiveSummary: string;

  luxoftSolutions: string;

  resultAndAchievements: string;

  id: string;
}

export interface ICaseStudyUpdateModelStrictDto {
  caseStudy: ICaseStudyIdentityDTO;

  executiveSummary: IOptionalString;

  clientSegmentation: IOptionalNullableClientSegmentation;

  businessGoal: IOptionalString;

  luxoftSolutions: IOptionalString;

  resultAndAchievements: IOptionalString;

  customer: IOptionalString;

  customerLocation: IOptionalString;

  customerRole: IOptionalString;

  customerFeedback: IOptionalString;

  archSolution: IOptionalNullableArchitectureSolution;

  archSolutionDescription: IOptionalString;
}

export interface ICommandModel {
  type: CommandType;

  name: string;

  commentIsRequired: boolean;
}

export interface ICssModelRichDTO {
  rates: ICssSurveyModelRichDTO[];

  customer: string;
}

export interface ICssSurveyModelRichDTO {
  averageRate: number;

  comment: string;

  commentDate: string;

  date: string;

  id: string;
}

export interface ICustomerManagementProjectionDTO {
  clientName: string;

  customerKeyPeople: string[];

  hasLdsProject: boolean;

  projectCustomerProjectManager: string;

  projectLdsProjectId: string;

  id: string;
}

export interface IEmployeeByLocationModel {
  roleName: string;

  active: boolean;

  totalWorkloadPercent: number;

  allocations: IAllocationModel[];

  id: string;

  name: string;
}

export interface IEmployeeByRoleModelRichDTO {
  allocations: IAllocationModel[];

  active: boolean;

  country: string;

  id: string;

  location: string;

  name: string;

  totalWorkloadPercent: number;
}

export interface IEmployeeIdentityDTO {
  id: string;
}

export interface IEmployeeModel {
  id: string;

  fullName: string;

  active: boolean;

  isCurrent: boolean;
}

export interface IEmployeeSimpleDTO {
  email: string;

  firstName: string;

  fullName: string;

  lastName: string;

  login: string;

  pin: number;

  status: EmployeeStatus;

  terminationDate: string;

  active: boolean;

  createDate: string;

  createdBy: string;

  modifiedBy: string;

  modifyDate: string;

  version: number;

  id: string;
}

export interface IEmployeeTaskDashboardModelRichDTO {
  dueDate: string;

  passportId: string;

  project: string;

  startDate: string;

  taskName: string;

  taskType: TaskType;
}

export interface IEngagementModelIdentityDTO {
  id: string;
}

export interface IFbuFilterStrictDTO {
  name: string;
}

export interface IFbuProjectionDTO {
  name: string;

  id: string;
}

export interface IFinancialBusinessUnitIdentityDTO {
  id: string;
}

export interface IFunctionalSafetyEmployeeProjectionDTO {
  active: boolean;

  fullName: string;

  id: string;
}

export interface IGetTierReportModelStrictDTO {
  passport: IPassportIdentityDTO;

  tierReport: ITierReportIdentityDTO;
}

export interface IInitDto {
  version: string;

  id: string;

  name: string;

  login: string;
}

export interface IInternalPassportIdentityDTO {
  id: string;
}

export interface IInternalPassportSectionItemIdentityDTO {
  id: string;
}

export interface IInternalPassportSectionItemUpdateStrictDto {
  sectionItem: IInternalPassportSectionItemIdentityDTO;

  status: RagStatus;
}

export interface ILdsDashboardCriticalFilterModelRichDTO {
  count: number;

  status: RagStatus;
}

export interface ILdsDashboardFilterModelStrictDTO {
  ragStatus: RagStatus;

  skip: number;

  take: number;
}

export interface ILdsDashboardTotalInfoModelRichDTO {
  criticalFilters: ILdsDashboardCriticalFilterModelRichDTO[];

  totalCount: number;
}

export interface ILocationIdentityDTO {
  id: string;
}

export interface ILocationModelRichDTO {
  count: number;

  countryName: string;

  hasProjectManager: boolean;

  id: string;

  name: string;
}

export interface ILuxoftManagementEmployeeProjectionDTO {
  active: boolean;

  fullName: string;

  id: string;
}

export interface ILuxoftManagementProjectionDTO {
  accountManager: ILuxoftManagementEmployeeProjectionDTO;

  deliveryMaturityConsultant: ILuxoftManagementEmployeeProjectionDTO;

  programManager: ILuxoftManagementEmployeeProjectionDTO;

  projectManager: ILuxoftManagementEmployeeProjectionDTO;

  id: string;
}

export interface IMethodologyFilterStrictDTO {}

export interface IMethodologyIdentityDTO {
  id: string;
}

export interface IOptionalActivityIdentityDTOArray {
  value: IActivityIdentityDTO[];
}

export interface IOptionalDateTime {
  value: string;
}

export interface IOptionalEmployeeIdentityDTO {
  value: IEmployeeIdentityDTO;
}

export interface IOptionalEngagementModelIdentityDTO {
  value: IEngagementModelIdentityDTO;
}

export interface IOptionalMethodologyIdentityDTOArray {
  value: IMethodologyIdentityDTO[];
}

export interface IOptionalNullableArchitectureSolution {
  value: ArchitectureSolution;
}

export interface IOptionalNullableClientSegmentation {
  value: ClientSegmentation;
}

export interface IOptionalNullableDateTime {
  value: string;
}

export interface IOptionalNullableFunctionalSafety {
  value: FunctionalSafety;
}

export interface IOptionalNullableGuid {
  value: string;
}

export interface IOptionalNullablePricingModel {
  value: PricingModel;
}

export interface IOptionalProjectComplexity {
  value: ProjectComplexity;
}

export interface IOptionalProjectStatus {
  value: ProjectStatus;
}

export interface IOptionalQualityApproachIdentityDTOArray {
  value: IQualityApproachIdentityDTO[];
}

export interface IOptionalSeProjectIdentityDTOArray {
  value: ISeProjectIdentityDTO[];
}

export interface IOptionalSkillIdentityDTOArray {
  value: ISkillIdentityDTO[];
}

export interface IOptionalString {
  value: string;
}

export interface IPassportCardActivityProjectionDTO {
  activityName: string;

  id: string;
}

export interface IPassportCardEmployeeProjectionDTO {
  active: boolean;

  fullName: string;

  id: string;
}

export interface IPassportCardProjectionDTO {
  caseStudyInProgress: boolean;

  cssOverallLevel: number;

  hasAccessToManagementInfo: boolean;

  ldsCriticalStatus: RagStatus;

  project: IPassportCardProjectProjectionDTO;

  status: PassportStatus;

  teamLocations: string[];

  teamSize: number;

  id: string;
}

export interface IPassportCardProjectProjectionDTO {
  accountManager: IPassportCardEmployeeProjectionDTO;

  client: string;

  closeDate: string;

  horizontal: string;

  mainActivities: IPassportCardActivityProjectionDTO[];

  name: string;

  projectManager: IPassportCardEmployeeProjectionDTO;

  skills: IPassportCardSkillProjectionDTO[];

  startDate: string;

  id: string;
}

export interface IPassportCardSkillProjectionDTO {
  skillName: string;

  id: string;
}

export interface IPassportCreateModelStrictDTO {
  code: string;

  name: string;

  program: IFinancialBusinessUnitIdentityDTO;

  projectManager: IEmployeeIdentityDTO;

  startDate: string;
}

export interface IPassportFilterDataModelRichDTO {
  countries: IVisualObjectModelRichDTO[];

  engagementModels: IVisualObjectModelRichDTO[];

  lobs: IVisualObjectModelRichDTO[];

  mainActivity: IVisualObjectModelRichDTO[];

  methodologies: IVisualObjectModelRichDTO[];

  qualityApproaches: IVisualObjectModelRichDTO[];
}

export interface IPassportFilterModelStrictDTO {
  clientSegmentations: ClientSegmentation[];

  dqmsId: string;

  endDateFilterModel: IPeriodFilterModelStrictDTO;

  engagementModels: string[];

  functionalSafeties: FunctionalSafety[];

  isCaseStudyExist: boolean;

  lineOfBusinesses: string[];

  mainActivities: string[];

  methodologyModels: string[];

  passportStatuses: PassportStatus[];

  pricingModels: PricingModel[];

  projectStatuses: ProjectStatus[];

  qualityApproachModels: string[];

  startDateFilterModel: IPeriodFilterModelStrictDTO;

  teamLocations: string[];

  teamSize: ITeamSizeFilterModelStrictDTO;
}

export interface IPassportFilterStrictDTO {
  passport: IPassportIdentityDTO;
}

export interface IPassportIdentityDTO {
  id: string;
}

export interface IPassportLocationDTO {
  passportIdentity: IPassportIdentityDTO;

  locationIdentity: ILocationIdentityDTO;
}

export interface IPassportOverviewActivityProjectionDTO {
  activityId: string;

  activityName: string;

  id: string;
}

export interface IPassportOverviewEngagementModelProjectionDTO {
  name: string;

  id: string;
}

export interface IPassportOverviewMethodologyProjectionDTO {
  methodologyId: string;

  methodologyName: string;

  id: string;
}

export interface IPassportOverviewProjectionDTO {
  activateDate: string;

  project: IProjectOverviewProjectionDTO;

  status: PassportStatus;

  id: string;
}

export interface IPassportOverviewQualityApproachProjectionDTO {
  qualityApproachId: string;

  qualityApproachName: string;

  id: string;
}

export interface IPassportProgramUpdateModelStrictDTO {
  account: IFinancialBusinessUnitIdentityDTO;

  passport: IPassportIdentityDTO;

  program: IFinancialBusinessUnitIdentityDTO;
}

export interface IPassportRagInfoModelRichDTO {
  areas: string[];

  ragItems: IRagReportItemModel[];

  projectManager: IEmployeeSimpleDTO;

  criticalStatus: RagStatus;

  headCount: number;

  isExpired: boolean;

  isLdsProjectLinked: boolean;

  ldsUpdatedDate: string;

  passportId: string;

  passportName: string;

  pmUpdatedDate: string;

  projectStatus: ProjectStatus;
}

export interface IPassportRoleDTO {
  passportIdentity: IPassportIdentityDTO;

  roleIdentity: IRoleIdentityDTO;
}

export interface IPassportSearchModelStrictDTO {
  filter: IPassportFilterModelStrictDTO;

  query: string;

  skip: number;

  take: number;
}

export interface IPassportSkillsProjectionDTO {
  project: IProjectSkillsProjectionDTO;

  id: string;
}

export interface IPassportStatusesDashboardModelSimpleDTO {
  count: number;

  status: PassportStatus;
}

export interface IPassportUpdateModelStrictDto {
  closeDate: IOptionalNullableDateTime;

  engagementModel: IOptionalEngagementModelIdentityDTO;

  passport: IPassportIdentityDTO;

  pricingModel: IOptionalNullablePricingModel;

  projectGoals: IOptionalString;

  pmProjectComplexity: IOptionalProjectComplexity;

  projectStatus: IOptionalProjectStatus;

  startDate: IOptionalDateTime;

  mainActivities: IOptionalActivityIdentityDTOArray;

  qualityApproaches: IOptionalQualityApproachIdentityDTOArray;

  methodologies: IOptionalMethodologyIdentityDTOArray;

  skills: IOptionalSkillIdentityDTOArray;

  customerProjectManager: IOptionalString;

  projectManager: IOptionalEmployeeIdentityDTO;

  programManager: IOptionalEmployeeIdentityDTO;

  accountManager: IOptionalEmployeeIdentityDTO;

  ldsProjectId: IOptionalNullableGuid;

  deliveryMaturityConsultant: IOptionalEmployeeIdentityDTO;

  functionalSafety: IOptionalNullableFunctionalSafety;

  functionalSafetyManager: IOptionalEmployeeIdentityDTO;

  seProjects: IOptionalSeProjectIdentityDTOArray;

  projectName: IOptionalString;
}

export interface IPeriodFilterModelStrictDTO {
  from: string;

  to: string;
}

export interface IProjectOverviewProjectionDTO {
  account: IFbuProjectionDTO;

  calculatedComplexity: ProjectComplexity;

  categorizationId: string;

  closeDate: string;

  code: string;

  engagementModel: IPassportOverviewEngagementModelProjectionDTO;

  functionalSafety: FunctionalSafety;

  functionalSafetyManager: IFunctionalSafetyEmployeeProjectionDTO;

  goals: string;

  isAlobProgram: boolean;

  isCategorizationCompleted: boolean;

  isInternalProject: boolean;

  mainActivities: IPassportOverviewActivityProjectionDTO[];

  methodologies: IPassportOverviewMethodologyProjectionDTO[];

  name: string;

  pmComplexity: ProjectComplexity;

  pricingModel: PricingModel;

  program: IFbuProjectionDTO;

  programHorizontalName: string;

  qualityApproaches: IPassportOverviewQualityApproachProjectionDTO[];

  startDate: string;

  status: ProjectStatus;

  id: string;
}

export interface IProjectSkillProjectionDTO {
  skillId: string;

  skillName: string;

  id: string;
}

export interface IProjectSkillsProjectionDTO {
  skills: IProjectSkillProjectionDTO[];

  id: string;
}

export interface IQualityApproachFilterStrictDTO {}

export interface IQualityApproachIdentityDTO {
  id: string;
}

export interface IQuestionAreaRateModelSimpleDTO {
  name: string;

  rate: number;
}

export interface IRagReportItemModel {
  area: string;

  status: RagStatus;

  comment: string;
}

export interface IRagReportModel {
  date: string;

  isActual: boolean;

  items: IRagReportItemModel[];
}

export interface IRagSummaryModelRichDTO {
  areas: string[];

  reports: IRagReportModel[];

  actualReporter: string;

  criticalStatus: RagStatus;

  isExpired: boolean;

  pmLastReportDate: string;
}

export interface IRoleIdentityDTO {
  id: string;
}

export interface IRoleModelRichDTO {
  count: number;

  id: string;

  name: string;
}

export interface ISearchActivityProjectionDTO {
  name: string;

  id: string;
}

export interface ISearchEmployeeProjectionDTO {
  businessUnit: string;

  fullName: string;

  id: string;
}

export interface ISearchEngagementModelProjectionDTO {
  name: string;

  pricingModels: PricingModel[];

  id: string;
}

export interface ISearchFbuProjectionDTO {
  name: string;

  id: string;
}

export interface ISearchMethodologyProjectionDTO {
  name: string;

  id: string;
}

export interface ISearchQualityApproachProjectionDTO {
  name: string;

  id: string;
}

export interface ISearchSeProjectProjectionDTO {
  headCount: number;

  name: string;

  plannedEndDate: string;

  id: string;
}

export interface ISearchSkillProjectionDTO {
  name: string;

  id: string;
}

export interface ISearchTierReportProjectionDTO {
  reviewDate: string;

  id: string;
}

export interface ISeProjectFilterStrictDTO {
  name: string;

  passport: IPassportIdentityDTO;

  skip: number;

  take: number;
}

export interface ISeProjectIdentityDTO {
  id: string;
}

export interface ISkillFilterStrictDTO {
  name: string;
}

export interface ISkillIdentityDTO {
  id: string;
}

export interface ISkillUsageModelSimpleDTO {
  count: number;

  id: string;

  name: string;
}

export interface IStatisticsDataDto {
  category: string;

  eventDate: string;

  eventName: string;

  jsonEventData: string;
}

export interface ITaskDashboardModelRichDTO {
  myTasks: IEmployeeTaskDashboardModelRichDTO[];

  teamTasks: ITeamTaskDashboardModelRichDTO[];
}

export interface ITaskExecuteModelStrictDTO {
  commandType: CommandType;

  comment: string;

  task: ITaskIdentityDTO;
}

export interface ITaskIdentityDTO {
  id: string;
}

export interface ITaskModel {
  id: string;

  type: TaskType;

  name: string;

  assignee: IEmployeeModel;

  startDate: string;

  dueDate: string;

  comment: string;

  previousTaskComment: string;

  previousTaskAssignee: IEmployeeModel;

  previousTaskEndDate: string;

  commands: ICommandModel[];
}

export interface ITeamModelRichDTO {
  locations: ILocationModelRichDTO[];

  roles: IRoleModelRichDTO[];

  workload: IWorkloadModelSimpleDTO;

  currentHeadCount: number;

  hasClosedSeProject: boolean;

  maxHeadCount: number;

  maxHeadCountDate: string;

  seProjectCount: number;
}

export interface ITeamSizeFilterModelStrictDTO {
  max: number;

  min: number;
}

export interface ITeamTaskDashboardModelRichDTO {
  tasks: IEmployeeTaskDashboardModelRichDTO[];

  assignee: IVisualObjectModelSimpleDTO;

  count: number;

  overdue: number;
}

export interface ITierIndicatorModel {
  name: string;

  isGrowUp: boolean;
}

export interface ITierReportIdentityDTO {
  id: string;
}

export interface ITierReportOverviewProjectionDTO {
  comments: string;

  expiryDate: string;

  forecast: TierForecast;

  isExpired: boolean;

  status: TierStatus;

  tiers: ITierStatusModel[];

  id: string;
}

export interface ITierStatusModel {
  tier: TierStatus;

  indicators: ITierIndicatorModel[];
}

export interface IVisualObjectModelRichDTO {
  id: string;

  name: string;
}

export interface IVisualObjectModelSimpleDTO {
  id: string;

  name: string;
}

export interface IWorkloadModelSimpleDTO {
  greaterEighty: number;

  lessOrEqualEighty: number;

  lessOrEqualFifty: number;

  undefined: number;
}

// #endregion
